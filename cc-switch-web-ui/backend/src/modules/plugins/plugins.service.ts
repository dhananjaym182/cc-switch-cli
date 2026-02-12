import { Injectable, Logger } from '@nestjs/common';

/**
 * Plugin information
 */
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  installed: boolean;
  schema?: any;
  config?: Record<string, any>;
}

/**
 * Plugins Service
 *
 * Manages plugins for extending functionality.
 * Future-ready for plugin marketplace.
 */
@Injectable()
export class PluginsService {
  private readonly logger = new Logger(PluginsService.name);
  private readonly plugins: Map<string, Plugin> = new Map();

  constructor() {
    this.initializeBuiltinPlugins();
  }

  /**
   * Get all plugins
   */
  async getAllPlugins(): Promise<Plugin[]> {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugin by ID
   */
  async getPlugin(id: string): Promise<Plugin | null> {
    return this.plugins.get(id) || null;
  }

  /**
   * Enable a plugin
   */
  async enablePlugin(id: string): Promise<Plugin | null> {
    const plugin = this.plugins.get(id);

    if (!plugin) {
      return null;
    }

    plugin.enabled = true;
    this.logger.log(`Enabled plugin: ${plugin.name} (${id})`);

    return plugin;
  }

  /**
   * Disable a plugin
   */
  async disablePlugin(id: string): Promise<Plugin | null> {
    const plugin = this.plugins.get(id);

    if (!plugin) {
      return null;
    }

    plugin.enabled = false;
    this.logger.log(`Disabled plugin: ${plugin.name} (${id})`);

    return plugin;
  }

  /**
   * Install a plugin (stub for future marketplace)
   */
  async installPlugin(id: string): Promise<Plugin> {
    this.logger.log(`Install plugin requested: ${id}`);

    // In production, would fetch from marketplace and install
    const plugin: Plugin = {
      id,
      name: `Plugin ${id}`,
      version: '1.0.0',
      description: 'Custom plugin',
      author: 'Unknown',
      enabled: true,
      installed: true,
    };

    this.plugins.set(id, plugin);
    return plugin;
  }

  /**
   * Uninstall a plugin
   */
  async uninstallPlugin(id: string): Promise<boolean> {
    const plugin = this.plugins.delete(id);
    if (plugin) {
      this.logger.log(`Uninstalled plugin: ${id}`);
    }
    return plugin;
  }

  /**
   * Initialize built-in plugins
   */
  private initializeBuiltinPlugins(): void {
    const builtinPlugins: Plugin[] = [
      {
        id: 'kilocode',
        name: 'Kilocode',
        version: '1.0.0',
        description: 'AI-powered coding assistant support',
        author: 'CC-Switch Team',
        enabled: true,
        installed: true,
      },
      {
        id: 'droid',
        name: 'Droid',
        version: '1.0.0',
        description: 'Advanced AI coding agent support',
        author: 'CC-Switch Team',
        enabled: true,
        installed: true,
      },
      {
        id: 'rightstockai',
        name: 'RightStockAI',
        version: '1.0.0',
        description: 'RightStockAI workflow integration',
        author: 'RightStockAI',
        enabled: true,
        installed: true,
      },
    ];

    for (const plugin of builtinPlugins) {
      this.plugins.set(plugin.id, plugin);
    }

    this.logger.log(`Initialized ${builtinPlugins.length} built-in plugins`);
  }
}
