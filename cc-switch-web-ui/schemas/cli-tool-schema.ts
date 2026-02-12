/**
 * Universal CLI Tool Schema Definitions
 * Version: 1.0.0
 *
 * This schema defines how custom CLI tools are registered and managed
 * in the Universal CLI Extension Engine.
 */

/**
 * Configuration file format types
 */
export type ConfigFormat = 'json' | 'yaml' | 'toml' | 'env' | 'ini' | 'xml';

/**
 * CLI tool types
 */
export type ToolType = 'custom' | 'proxy' | 'api' | 'mcp' | 'built-in';

/**
 * Field mapping for config files
 */
export interface FieldMapping {
  /** Field name for API key in config file */
  apiKey: string;
  /** Field name for API endpoint (optional) */
  endpoint?: string;
  /** Field name for model selection (optional) */
  model?: string;
  /** Additional custom fields */
  custom?: Record<string, string>;
}

/**
 * Validation rules for configuration
 */
export interface ValidationRules {
  /** Required fields */
  required: string[];
  /** Field type validations */
  types?: Record<string, 'string' | 'number' | 'boolean' | 'url' | 'email'>;
  /** Value constraints */
  constraints?: Record<string, {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  }>;
}

/**
 * Backup strategy options
 */
export interface BackupStrategy {
  /** Enable backup before modification */
  enabled: boolean;
  /** Number of backups to keep */
  maxBackups?: number;
  /** Backup location */
  backupPath?: string;
}

/**
 * CLI Tool Schema - Complete definition for a CLI tool
 */
export interface CLIToolSchema {
  /** Unique tool identifier */
  id: string;

  /** Display name */
  name: string;

  /** Tool type */
  type: ToolType;

  /** Tool description */
  description?: string;

  /** Documentation URL */
  docsUrl?: string;

  /** Icon/emoji for UI */
  icon?: string;

  /** Configuration file location (supports ~ expansion) */
  configPath: string;

  /** Configuration file format */
  format: ConfigFormat;

  /** Field mapping for config file */
  fields: FieldMapping;

  /** Validation rules */
  validation: ValidationRules;

  /** Backup strategy */
  backup?: BackupStrategy;

  /** CLI commands (if tool has CLI interface) */
  commands?: {
    /** Command to check if tool is installed */
    checkInstalled: string[];
    /** Command to get version */
    version: string[];
    /** Command to validate config */
    validateConfig?: string[];
    /** Command to apply config */
    applyConfig?: string[];
  };

  /** Environment variable overrides */
  envVars?: {
    /** Map config field to env var name */
    apiKey?: string;
    endpoint?: string;
    model?: string;
  };

  /** Metadata */
  metadata?: {
    /** Tool version */
    version?: string;
    /** Author */
    author?: string;
    /** Homepage */
    homepage?: string;
    /** Repository */
    repository?: string;
    /** License */
    license?: string;
    /** Tags for filtering */
    tags?: string[];
    /** Supported platforms */
    platforms?: ('linux' | 'macos' | 'windows' | 'wsl')[];
  };
}

/**
 * Configuration snapshot - captured state at a point in time
 */
export interface ConfigSnapshot {
  /** Tool ID */
  toolId: string;

  /** Snapshot timestamp */
  timestamp: Date;

  /** Raw config content */
  content: string;

  /** Parsed config object */
  parsed: Record<string, any>;

  /** Hash for integrity checking */
  hash: string;

  /** Associated profile ID */
  profileId?: string;

  /** User who created this snapshot */
  userId?: string;
}

/**
 * Configuration change record
 */
export interface ConfigChange {
  /** Change ID */
  id: string;

  /** Tool ID */
  toolId: string;

  /** Previous snapshot ID */
  previousSnapshot: string;

  /** New snapshot ID */
  newSnapshot: string;

  /** Diff summary */
  diff: {
    added: string[];
    removed: string[];
    modified: Record<string, { from: any; to: any }>;
  };

  /** Change metadata */
  metadata: {
    /** Who made the change */
    userId: string;

    /** When the change was made */
    timestamp: Date;

    /** Reason for change */
    reason?: string;

    /** Source of change (API, CLI, UI, etc.) */
    source: 'api' | 'cli' | 'ui' | 'scheduled' | 'rollback';

    /** Associated profile ID */
    profileId?: string;
  };
}

/**
 * Pre-defined tool schemas for popular CLI tools
 */
export const BUILTIN_TOOLS: CLIToolSchema[] = [
  {
    id: 'kilocode',
    name: 'kilocode',
    type: 'custom',
    description: 'AI-powered coding assistant',
    docsUrl: 'https://kilocode.ai/docs',
    icon: '🤖',
    configPath: '~/.kilocode/config.json',
    format: 'json',
    fields: {
      apiKey: 'token',
      endpoint: 'baseUrl',
      model: 'model',
      custom: {
        maxTokens: 'max_tokens',
        temperature: 'temperature',
      },
    },
    validation: {
      required: ['token'],
      types: {
        token: 'string',
        baseUrl: 'url',
      },
      constraints: {
        token: {
          pattern: '^sk-[a-zA-Z0-9]{32,}$',
        },
      },
    },
    backup: {
      enabled: true,
      maxBackups: 10,
    },
    commands: {
      checkInstalled: ['kilocode', '--version'],
      version: ['kilocode', '--version'],
    },
    metadata: {
      tags: ['coding', 'assistant'],
      platforms: ['linux', 'macos', 'windows', 'wsl'],
    },
  },

  {
    id: 'droid',
    name: 'droid',
    type: 'custom',
    description: 'Advanced AI coding agent',
    docsUrl: 'https://droid.dev/docs',
    icon: '🦾',
    configPath: '~/.droid/config.yaml',
    format: 'yaml',
    fields: {
      apiKey: 'api_key',
      endpoint: 'endpoint',
      model: 'model',
    },
    validation: {
      required: ['api_key'],
      types: {
        api_key: 'string',
        endpoint: 'url',
      },
    },
    backup: {
      enabled: true,
      maxBackups: 5,
    },
    commands: {
      checkInstalled: ['droid', '--version'],
      version: ['droid', '--version'],
    },
    metadata: {
      tags: ['agent', 'automation'],
      platforms: ['linux', 'macos'],
    },
  },

  {
    id: 'aider',
    name: 'aider',
    type: 'custom',
    description: 'AI pair programming in your terminal',
    docsUrl: 'https://aider.chat/docs',
    icon: '🧑‍💻',
    configPath: '~/.aider.config.yml',
    format: 'yaml',
    fields: {
      apiKey: 'openai_api_key',
      endpoint: 'api_base',
      model: 'model',
    },
    validation: {
      required: ['model'],
      types: {
        model: 'string',
        api_base: 'url',
      },
    },
    backup: {
      enabled: true,
      maxBackups: 5,
    },
    commands: {
      checkInstalled: ['aider', '--version'],
      version: ['aider', '--version'],
    },
    metadata: {
      tags: ['coding', 'git'],
      platforms: ['linux', 'macos', 'windows'],
    },
  },

  {
    id: 'continue',
    name: 'Continue',
    type: 'custom',
    description: 'VS Code AI autopilot',
    docsUrl: 'https://continue.dev/docs',
    icon: '⚡',
    configPath: '~/.continue/config.json',
    format: 'json',
    fields: {
      apiKey: 'apiKey',
      model: 'model',
      custom: {
        provider: 'provider',
        temperature: 'temperature',
      },
    },
    validation: {
      required: ['model'],
      types: {
        model: 'string',
        apiKey: 'string',
      },
    },
    backup: {
      enabled: true,
      maxBackups: 3,
    },
    commands: {
      checkInstalled: ['continue', '--version'],
      version: ['continue', '--version'],
    },
    metadata: {
      tags: ['vscode', 'extension'],
      platforms: ['linux', 'macos', 'windows'],
    },
  },

  {
    id: 'custom-proxy',
    name: 'Custom API Proxy',
    type: 'proxy',
    description: 'Custom API proxy configuration',
    icon: '🔀',
    configPath: '~/.custom-proxy/config.env',
    format: 'env',
    fields: {
      apiKey: 'API_KEY',
      endpoint: 'API_ENDPOINT',
      model: 'DEFAULT_MODEL',
    },
    validation: {
      required: ['API_ENDPOINT'],
      types: {
        API_KEY: 'string',
        API_ENDPOINT: 'url',
      },
    },
    backup: {
      enabled: true,
      maxBackups: 5,
    },
    metadata: {
      tags: ['proxy', 'custom'],
      platforms: ['linux', 'macos', 'windows', 'wsl'],
    },
  },
];

/**
 * Schema validator
 */
export class SchemaValidator {
  static validate(schema: CLIToolSchema): { valid: boolean; errors: string[] } {
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

    if (!schema.validation || !schema.validation.required) {
      errors.push('Validation rules with required fields must be specified');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static validateConfig(
    schema: CLIToolSchema,
    config: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    for (const field of schema.validation.required) {
      if (!config[field]) {
        errors.push(`Required field '${field}' is missing`);
      }
    }

    // Check field types
    if (schema.validation.types) {
      for (const [field, type] of Object.entries(schema.validation.types)) {
        const value = config[field];
        if (value === undefined || value === null) continue;

        let valid = true;
        switch (type) {
          case 'string':
            valid = typeof value === 'string';
            break;
          case 'number':
            valid = typeof value === 'number';
            break;
          case 'boolean':
            valid = typeof value === 'boolean';
            break;
          case 'url':
            valid =
              typeof value === 'string' && /^https?:\/\//.test(value);
            break;
          case 'email':
            valid =
              typeof value === 'string' &&
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        }

        if (!valid) {
          errors.push(
            `Field '${field}' must be of type '${type}'`
          );
        }
      }
    }

    // Check constraints
    if (schema.validation.constraints) {
      for (const [field, constraint] of Object.entries(
        schema.validation.constraints
      )) {
        const value = config[field];
        if (value === undefined || value === null) continue;

        if (constraint.min !== undefined && value < constraint.min) {
          errors.push(
            `Field '${field}' must be >= ${constraint.min}`
          );
        }
        if (constraint.max !== undefined && value > constraint.max) {
          errors.push(
            `Field '${field}' must be <= ${constraint.max}`
          );
        }
        if (constraint.pattern && typeof value === 'string') {
          const regex = new RegExp(constraint.pattern);
          if (!regex.test(value)) {
            errors.push(
              `Field '${field}' does not match required pattern`
            );
          }
        }
        if (constraint.enum && !constraint.enum.includes(value)) {
          errors.push(
            `Field '${field}' must be one of: ${constraint.enum.join(', ')}`
          );
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
