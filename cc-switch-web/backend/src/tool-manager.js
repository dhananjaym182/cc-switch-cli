import fs from 'fs';
import path from 'path';
import os from 'os';
import yaml from 'yaml';

export class ToolManager {
  constructor(config) {
    this.config = config;
  }

  getTools() {
    return this.config.tools || [];
  }

  getTool(name) {
    return this.config.tools.find(t => t.name === name);
  }

  registerTool(toolSchema) {
    const { name, configPath, apiKeyField, endpointField, modelField, format } = toolSchema;
    
    if (!name || !configPath) {
      throw new Error('Tool name and configPath are required');
    }
    
    const existingIndex = this.config.tools.findIndex(t => t.name === name);
    
    const tool = {
      name,
      configPath: expandHome(configPath),
      apiKeyField: apiKeyField || 'apiKey',
      endpointField: endpointField || 'baseUrl',
      modelField: modelField || 'model',
      format: format || 'json',
      enabled: true,
    };
    
    if (existingIndex >= 0) {
      this.config.tools[existingIndex] = tool;
    } else {
      this.config.tools.push(tool);
    }
    
    return tool;
  }

  unregisterTool(name) {
    const index = this.config.tools.findIndex(t => t.name === name);
    if (index >= 0) {
      this.config.tools.splice(index, 1);
      return true;
    }
    return false;
  }

  readToolConfig(tool) {
    const configPath = tool.configPath;
    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }
    
    const content = fs.readFileSync(configPath, 'utf8');
    
    switch (tool.format.toLowerCase()) {
      case 'json':
        return JSON.parse(content);
      case 'yaml':
      case 'yml':
        return yaml.parse(content);
      case 'toml':
        throw new Error('TOML parsing not yet implemented');
      case 'env':
        return parseEnvFile(content);
      default:
        throw new Error(`Unsupported format: ${tool.format}`);
    }
  }

  writeToolConfig(tool, config) {
    const configPath = tool.configPath;
    
    const backupPath = `${configPath}.backup-${Date.now()}`;
    if (fs.existsSync(configPath)) {
      fs.copyFileSync(configPath, backupPath);
    }
    
    let content;
    
    switch (tool.format.toLowerCase()) {
      case 'json':
        content = JSON.stringify(config, null, 2);
        break;
      case 'yaml':
      case 'yml':
        content = yaml.stringify(config);
        break;
      case 'toml':
        throw new Error('TOML writing not yet implemented');
      case 'env':
        content = stringifyEnvFile(config);
        break;
      default:
        throw new Error(`Unsupported format: ${tool.format}`);
    }
    
    fs.writeFileSync(configPath, content, 'utf8');
  }

  switchToolConfig(name, apiKey, endpoint, model) {
    const tool = this.getTool(name);
    
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }
    
    const config = this.readToolConfig(tool);
    
    if (apiKey && tool.apiKeyField) {
      setNestedProperty(config, tool.apiKeyField, apiKey);
    }
    
    if (endpoint && tool.endpointField) {
      setNestedProperty(config, tool.endpointField, endpoint);
    }
    
    if (model && tool.modelField) {
      setNestedProperty(config, tool.modelField, model);
    }
    
    this.writeToolConfig(tool, config);
    
    this.config.lastActiveTool = name;
    
    return { success: true, tool: name };
  }

  getToolStatus(name) {
    const tool = this.getTool(name);
    
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }
    
    try {
      const config = this.readToolConfig(tool);
      
      return {
        name: tool.name,
        configPath: tool.configPath,
        exists: true,
        currentApiKey: getNestedProperty(config, tool.apiKeyField) ? '***' : null,
        currentEndpoint: getNestedProperty(config, tool.endpointField),
        currentModel: getNestedProperty(config, tool.modelField),
      };
    } catch (error) {
      return {
        name: tool.name,
        configPath: tool.configPath,
        exists: false,
        error: error.message,
      };
    }
  }
}

function expandHome(filePath) {
  if (filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

function parseEnvFile(content) {
  const env = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue;
    
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    
    const key = trimmed.substring(0, eqIndex).trim();
    let value = trimmed.substring(eqIndex + 1).trim();
    
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    env[key] = value;
  }
  
  return env;
}

function stringifyEnvFile(config) {
  const lines = [];
  
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'string') {
      lines.push(`${key}=${value}`);
    }
  }
  
  return lines.join('\n') + '\n';
}

function getNestedProperty(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
}

function setNestedProperty(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
}
