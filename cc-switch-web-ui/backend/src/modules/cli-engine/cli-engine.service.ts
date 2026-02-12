import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import * as yaml from 'yaml';
import * as toml from 'toml';
import * as ini from 'ini';
import * as dotenv from 'dotenv';

import { CLIToolSchema, ConfigSnapshot, ConfigChange, BUILTIN_TOOLS } from '../../schemas/cli-tool-schema';

/**
 * Registered CLI tool
 */
export interface RegisteredTool {
  schema: CLIToolSchema;
  installed: boolean;
  lastChecked?: Date;
  configExists: boolean;
}

/**
 * Configuration read result
 */
export interface ConfigReadResult {
  toolId: string;
  format: string;
  raw: string;
  parsed: Record<string, any>;
  hash: string;
}

/**
 * Configuration update request
 */
export interface ConfigUpdateRequest {
  toolId: string;
  updates: Record<string, any>;
  backup?: boolean;
  dryRun?: boolean;
}

/**
 * CLI Engine Service - Universal CLI Extension Engine
 *
 * Provides schema-based configuration management for unlimited CLI tools.
 * Supports multiple config formats: JSON, YAML, TOML, ENV, INI.
 */
@Injectable()
export class CLIEngineService {
  private readonly logger = new Logger(CLIEngineService.name);
  private readonly tools: Map<string, CLIToolSchema> = new Map();
  private readonly backupsPath: string;

  constructor() {
    // Initialize with built-in tools
    BUILTIN_TOOLS.forEach((tool) => {
      this.tools.set(tool.id, tool);
    });

    // Setup backups directory
    this.backupsPath = path.join(os.homedir(), '.cc-switch', 'backups');
    this.ensureBackupsDirectory();
  }

  /**
   * Get all registered tools
   */
  async getRegisteredTools(): Promise<RegisteredTool[]> {
    const results: RegisteredTool[] = [];

    for (const [id, schema] of this.tools.entries()) {
      const result = await this.checkToolStatus(schema);
      results.push(result);
    }

    return results;
  }

  /**
   * Get tool by ID
   */
  async getTool(id: string): Promise<RegisteredTool | null> {
    const schema = this.tools.get(id);
    if (!schema) {
      return null;
    }

    return await this.checkToolStatus(schema);
  }

  /**
   * Register a custom tool
   */
  async registerTool(schema: CLIToolSchema): Promise<RegisteredTool> {
    // Validate schema
    if (!this.validateSchema(schema).valid) {
      throw new BadRequestException('Invalid tool schema');
    }

    // Add to registry
    this.tools.set(schema.id, schema);

    // Check status
    return await this.checkToolStatus(schema);
  }

  /**
   * Unregister a tool
   */
  unregisterTool(id: string): boolean {
    return this.tools.delete(id);
  }

  /**
   * Read configuration for a tool
   */
  async readConfig(toolId: string): Promise<ConfigReadResult> {
    const schema = this.tools.get(toolId);
    if (!schema) {
      throw new NotFoundException(`Tool not found: ${toolId}`);
    }

    const configPath = this.expandPath(schema.configPath);

    try {
      const raw = await fs.readFile(configPath, 'utf-8');
      const parsed = this.parseConfig(raw, schema.format);
      const hash = this.computeHash(raw);

      return {
        toolId,
        format: schema.format,
        raw,
        parsed,
        hash,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`Config file not found: ${configPath}`);
      }
      throw new BadRequestException(`Failed to read config: ${error.message}`);
    }
  }

  /**
   * Update configuration for a tool
   */
  async updateConfig(request: ConfigUpdateRequest): Promise<ConfigSnapshot> {
    const { toolId, updates, backup = true, dryRun = false } = request;

    const schema = this.tools.get(toolId);
    if (!schema) {
      throw new NotFoundException(`Tool not found: ${toolId}`);
    }

    const configPath = this.expandPath(schema.configPath);

    // Read current config
    const current = await this.readConfig(toolId);

    // Create backup if requested
    if (backup) {
      await this.createBackup(toolId, current);
    }

    // Merge updates with current config
    const updatedParsed = { ...current.parsed, ...updates };

    // Validate updated config
    const validation = this.validateConfig(schema, updatedParsed);
    if (!validation.valid) {
      throw new BadRequestException(`Config validation failed: ${validation.errors.join(', ')}`);
    }

    if (dryRun) {
      this.logger.log(`Dry run: would update config for ${toolId}`);
      return {
        toolId,
        timestamp: new Date(),
        content: this.stringifyConfig(updatedParsed, schema.format),
        parsed: updatedParsed,
        hash: this.computeHash(this.stringifyConfig(updatedParsed, schema.format)),
      };
    }

    // Write updated config
    const updatedRaw = this.stringifyConfig(updatedParsed, schema.format);
    await fs.writeFile(configPath, updatedRaw, 'utf-8');

    const newHash = this.computeHash(updatedRaw);

    this.logger.log(`Updated config for ${toolId}`);

    return {
      toolId,
      timestamp: new Date(),
      content: updatedRaw,
      parsed: updatedParsed,
      hash: newHash,
    };
  }

  /**
   * Rollback to a previous configuration
   */
  async rollbackConfig(toolId: string, backupId: string): Promise<void> {
    const backupPath = path.join(this.backupsPath, toolId, `${backupId}.bak`);

    try {
      const backupContent = await fs.readFile(backupPath, 'utf-8');
      const configPath = this.expandPath(this.tools.get(toolId).configPath);

      // Write backup content to config
      await fs.writeFile(configPath, backupContent, 'utf-8');

      this.logger.log(`Rolled back config for ${toolId} to ${backupId}`);
    } catch (error) {
      throw new BadRequestException(`Failed to rollback: ${error.message}`);
    }
  }

  /**
   * List backups for a tool
   */
  async listBackups(toolId: string): Promise<Array<{ id: string; timestamp: Date }>> {
    const toolBackupPath = path.join(this.backupsPath, toolId);

    try {
      const files = await fs.readdir(toolBackupPath);
      const backups: Array<{ id: string; timestamp: Date }> = [];

      for (const file of files) {
        if (file.endsWith('.bak')) {
          const id = file.replace('.bak', '');
          const stats = await fs.stat(path.join(toolBackupPath, file));
          backups.push({ id, timestamp: stats.mtime });
        }
      }

      return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      return [];
    }
  }

  /**
   * Validate tool schema
   */
  private validateSchema(schema: CLIToolSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schema.id || schema.id.trim() === '') {
      errors.push('Tool ID is required');
    }

    if (!schema.name || schema.name.trim() === '') {
      errors.push('Tool name is required');
    }

    if (!schema.configPath || schema.configPath.trim() === '') {
      errors.push('Config path is required');
    }

    if (!schema.fields || !schema.fields.apiKey) {
      errors.push('API key field mapping is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate configuration against schema
   */
  private validateConfig(schema: CLIToolSchema, config: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    if (schema.validation.required) {
      for (const field of schema.validation.required) {
        if (!config[field]) {
          errors.push(`Required field '${field}' is missing`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check tool installation and config status
   */
  private async checkToolStatus(schema: CLIToolSchema): Promise<RegisteredTool> {
    let installed = false;
    let lastChecked: Date | undefined;

    // Check if CLI command exists
    if (schema.commands?.checkInstalled) {
      try {
        const { execa } = await import('execa');
        await execa(schema.commands.checkInstalled[0], schema.commands.checkInstalled.slice(1), {
          shell: true,
          timeout: 5000,
        });
        installed = true;
        lastChecked = new Date();
      } catch (error) {
        installed = false;
      }
    }

    // Check if config file exists
    let configExists = false;
    try {
      const configPath = this.expandPath(schema.configPath);
      await fs.access(configPath);
      configExists = true;
    } catch (error) {
      configExists = false;
    }

    return {
      schema,
      installed,
      lastChecked,
      configExists,
    };
  }

  /**
   * Parse config based on format
   */
  private parseConfig(content: string, format: string): Record<string, any> {
    try {
      switch (format) {
        case 'json':
          return JSON.parse(content);
        case 'yaml':
          return yaml.parse(content);
        case 'toml':
          return toml.parse(content);
        case 'ini':
          return ini.parse(content);
        case 'env':
          return dotenv.parse(content);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      this.logger.error(`Failed to parse ${format} config`, error);
      throw new BadRequestException(`Failed to parse config: ${error.message}`);
    }
  }

  /**
   * Stringify config based on format
   */
  private stringifyConfig(config: Record<string, any>, format: string): string {
    try {
      switch (format) {
        case 'json':
          return JSON.stringify(config, null, 2);
        case 'yaml':
          return yaml.stringify(config);
        case 'toml':
          return toml.stringify(config);
        case 'ini':
          return ini.stringify(config);
        case 'env':
          return Object.entries(config)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      this.logger.error(`Failed to stringify ${format} config`, error);
      throw new BadRequestException(`Failed to stringify config: ${error.message}`);
    }
  }

  /**
   * Create backup of config
   */
  private async createBackup(toolId: string, config: ConfigReadResult): Promise<string> {
    const toolBackupPath = path.join(this.backupsPath, toolId);
    await fs.mkdir(toolBackupPath, { recursive: true });

    const backupId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const backupPath = path.join(toolBackupPath, `${backupId}.bak`);

    await fs.writeFile(backupPath, config.raw, 'utf-8');

    // Clean old backups (keep max backups)
    await this.cleanOldBackups(toolId);

    this.logger.debug(`Created backup for ${toolId}: ${backupId}`);
    return backupId;
  }

  /**
   * Clean old backups
   */
  private async cleanOldBackups(toolId: string): Promise<void> {
    const toolBackupPath = path.join(this.backupsPath, toolId);

    try {
      const files = await fs.readdir(toolBackupPath);
      const backups: Array<{ name: string; time: number }> = [];

      for (const file of files) {
        if (file.endsWith('.bak')) {
          const stat = await fs.stat(path.join(toolBackupPath, file));
          backups.push({ name: file, time: stat.mtimeMs });
        }
      }

      // Sort by time (oldest first)
      backups.sort((a, b) => a.time - b.time);

      // Keep max 10 backups
      const maxBackups = 10;
      if (backups.length > maxBackups) {
        for (let i = 0; i < backups.length - maxBackups; i++) {
          const backupPath = path.join(toolBackupPath, backups[i].name);
          await fs.unlink(backupPath);
          this.logger.debug(`Deleted old backup: ${backups[i].name}`);
        }
      }
    } catch (error) {
      this.logger.warn('Failed to clean old backups', error);
    }
  }

  /**
   * Ensure backups directory exists
   */
  private async ensureBackupsDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.backupsPath, { recursive: true });
    } catch (error) {
      this.logger.warn('Failed to create backups directory', error);
    }
  }

  /**
   * Expand ~ in path
   */
  private expandPath(p: string): string {
    return p.replace(/^~/, os.homedir());
  }

  /**
   * Compute hash of content
   */
  private computeHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}
