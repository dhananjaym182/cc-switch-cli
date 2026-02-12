import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execa, ExecaChildProcess } from 'execa';
import * as os from 'os';
import * as path from 'path';

/**
 * Provider information
 */
export interface Provider {
  id: string;
  name: string;
  type: string;
  active: boolean;
  description?: string;
}

/**
 * Configuration from cc-switch
 */
export interface CCSwitchConfig {
  activeProvider: string;
  providers: Provider[];
  mcpServers: any[];
  prompts: any[];
  configPath: string;
}

/**
 * Command execution result
 */
export interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  command: string[];
  duration: number;
}

/**
 * cc-switch CLI Adapter Service
 *
 * Wraps the cc-switch CLI tool and provides a clean API interface.
 * Executes commands safely with proper error handling.
 */
@Injectable()
export class CCSwitchAdapterService {
  private readonly logger = new Logger(CCSwitchAdapterService.name);
  private readonly ccSwitchPath: string;
  private readonly configHome: string;

  constructor(private readonly configService: ConfigService) {
    this.ccSwitchPath = this.configService.get<string>('CC_SWITCH_PATH', 'cc-switch');
    this.configHome = this.configService.get<string>('CC_SWITCH_CONFIG_HOME', '~/.cc-switch');
  }

  /**
   * Check if cc-switch is installed and accessible
   */
  async checkInstallation(): Promise<{ installed: boolean; version?: string; error?: string }> {
    try {
      const result = await this.executeCommand(['--version']);
      const version = result.stdout.trim();
      return { installed: true, version };
    } catch (error) {
      this.logger.error('cc-switch not found or not accessible', error);
      return { installed: false, error: error.message };
    }
  }

  /**
   * List all available providers
   */
  async listProviders(): Promise<Provider[]> {
    try {
      const result = await this.executeCommand(['provider', 'list']);
      const providers = this.parseProviderList(result.stdout);
      return providers;
    } catch (error) {
      this.logger.error('Failed to list providers', error);
      throw new BadRequestException('Failed to list providers');
    }
  }

  /**
   * Switch to a specific provider
   */
  async switchProvider(providerId: string): Promise<void> {
    try {
      const result = await this.executeCommand(['provider', 'switch', providerId]);
      this.logger.log(`Switched to provider: ${providerId}`);
    } catch (error) {
      this.logger.error(`Failed to switch to provider: ${providerId}`, error);
      throw new BadRequestException(`Failed to switch to provider ${providerId}`);
    }
  }

  /**
   * Get current configuration
   */
  async getConfig(): Promise<CCSwitchConfig> {
    try {
      const configPath = path.join(os.homedir(), '.cc-switch', 'config.json');

      // Get active provider
      const statusResult = await this.executeCommand(['status']);
      const activeProvider = this.parseActiveProvider(statusResult.stdout);

      // Get providers list
      const providers = await this.listProviders();

      // Get MCP servers
      const mcpServers = await this.listMCPServers();

      // Get prompts
      const prompts = await this.listPrompts();

      return {
        activeProvider,
        providers,
        mcpServers,
        prompts,
        configPath,
      };
    } catch (error) {
      this.logger.error('Failed to get configuration', error);
      throw new BadRequestException('Failed to get configuration');
    }
  }

  /**
   * List MCP servers
   */
  async listMCPServers(): Promise<any[]> {
    try {
      const result = await this.executeCommand(['mcp', 'list']);
      return this.parseMCPServers(result.stdout);
    } catch (error) {
      this.logger.warn('Failed to list MCP servers', error);
      return [];
    }
  }

  /**
   * List available prompts
   */
  async listPrompts(): Promise<any[]> {
    try {
      const result = await this.executeCommand(['prompts', 'list']);
      return this.parsePrompts(result.stdout);
    } catch (error) {
      this.logger.warn('Failed to list prompts', error);
      return [];
    }
  }

  /**
   * Get environment variables
   */
  async getEnv(): Promise<Record<string, string>> {
    try {
      const result = await this.executeCommand(['env']);
      return this.parseEnv(result.stdout);
    } catch (error) {
      this.logger.error('Failed to get environment variables', error);
      throw new BadRequestException('Failed to get environment variables');
    }
  }

  /**
   * Execute a generic cc-switch command
   */
  async executeCommand(args: string[]): Promise<CommandResult> {
    const startTime = Date.now();

    try {
      const { stdout, stderr, exitCode } = await execa(this.ccSwitchPath, args, {
        shell: true,
        timeout: 30000,
      });

      const duration = Date.now() - startTime;

      this.logger.debug(`Command executed: ${this.ccSwitchPath} ${args.join(' ')}`);

      return {
        success: exitCode === 0,
        stdout,
        stderr,
        exitCode,
        command: [this.ccSwitchPath, ...args],
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error(`Command failed: ${this.ccSwitchPath} ${args.join(' ')}`, error);

      return {
        success: false,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.exitCode || 1,
        command: [this.ccSwitchPath, ...args],
        duration,
      };
    }
  }

  /**
   * Parse provider list from command output
   */
  private parseProviderList(output: string): Provider[] {
    const providers: Provider[] = [];

    // Try JSON parsing first
    try {
      const json = JSON.parse(output);
      if (Array.isArray(json)) {
        return json.map((p, index) => ({
          id: p.id || `provider-${index}`,
          name: p.name || p.display_name || p.label || `Provider ${index}`,
          type: p.type || 'unknown',
          active: p.active || p.selected || false,
          description: p.description || p.desc,
        }));
      }
    } catch (e) {
      // Not JSON, try line-based parsing
    }

    // Line-based parsing
    const lines = output.split('\n');
    let activeProviderFound = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('---') || trimmed.startsWith('Name')) {
        continue;
      }

      // Try to match pattern: "provider_name (active)"
      const activeMatch = trimmed.match(/^(.+?)\s*[\*\(]active[\*\)]/i);
      const regularMatch = trimmed.match(/^([a-z0-9_-]+)/i);

      if (activeMatch) {
        providers.push({
          id: activeMatch[1].trim(),
          name: this.formatProviderName(activeMatch[1].trim()),
          type: 'unknown',
          active: true,
        });
        activeProviderFound = true;
      } else if (regularMatch) {
        providers.push({
          id: regularMatch[1].trim(),
          name: this.formatProviderName(regularMatch[1].trim()),
          type: 'unknown',
          active: false,
        });
      }
    }

    return providers;
  }

  /**
   * Parse active provider from status output
   */
  private parseActiveProvider(output: string): string {
    try {
      const json = JSON.parse(output);
      return json.provider || json.active_provider || json.current || 'unknown';
    } catch (e) {
      // Try regex matching
      const match = output.match(/active\s*provider[:\s]+([a-z0-9_-]+)/i);
      return match ? match[1] : 'unknown';
    }
  }

  /**
   * Parse MCP servers from command output
   */
  private parseMCPServers(output: string): any[] {
    try {
      const json = JSON.parse(output);
      return Array.isArray(json) ? json : json.servers || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Parse prompts from command output
   */
  private parsePrompts(output: string): any[] {
    try {
      const json = JSON.parse(output);
      return Array.isArray(json) ? json : json.prompts || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Parse environment variables from command output
   */
  private parseEnv(output: string): Record<string, string> {
    const env: Record<string, string> = {};

    try {
      const json = JSON.parse(output);
      return json.env || json.environment || json;
    } catch (e) {
      // Parse KEY=VALUE format
      const lines = output.split('\n');
      for (const line of lines) {
        const match = line.match(/^([A-Z_]+)=(.+)$/);
        if (match) {
          env[match[1]] = match[2];
        }
      }
    }

    return env;
  }

  /**
   * Format provider name for display
   */
  private formatProviderName(id: string): string {
    return id
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
