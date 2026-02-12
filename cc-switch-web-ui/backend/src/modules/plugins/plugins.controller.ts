import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PluginsService, Plugin } from './plugins.service';

@ApiTags('plugins')
@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Get()
  @ApiOperation({ summary: 'List all plugins' })
  @ApiResponse({ status: 200, description: 'Returns list of plugins' })
  async getAllPlugins(): Promise<{ success: boolean; data: Plugin[] }> {
    const plugins = await this.pluginsService.getAllPlugins();
    return {
      success: true,
      data: plugins,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plugin by ID' })
  @ApiResponse({ status: 200, description: 'Returns plugin details' })
  async getPlugin(@Param('id') id: string): Promise<{ success: boolean; data?: Plugin; message?: string }> {
    const plugin = await this.pluginsService.getPlugin(id);

    if (!plugin) {
      return {
        success: false,
        message: `Plugin not found: ${id}`,
      };
    }

    return {
      success: true,
      data: plugin,
    };
  }

  @Post(':id/enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enable a plugin' })
  @ApiResponse({ status: 200, description: 'Plugin enabled' })
  async enablePlugin(@Param('id') id: string): Promise<{ success: boolean; data?: Plugin; message?: string }> {
    const plugin = await this.pluginsService.enablePlugin(id);

    if (!plugin) {
      return {
        success: false,
        message: `Plugin not found: ${id}`,
      };
    }

    return {
      success: true,
      data: plugin,
    };
  }

  @Post(':id/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable a plugin' })
  @ApiResponse({ status: 200, description: 'Plugin disabled' })
  async disablePlugin(@Param('id') id: string): Promise<{ success: boolean; data?: Plugin; message?: string }> {
    const plugin = await this.pluginsService.disablePlugin(id);

    if (!plugin) {
      return {
        success: false,
        message: `Plugin not found: ${id}`,
      };
    }

    return {
      success: true,
      data: plugin,
    };
  }

  @Post('install')
  @ApiOperation({ summary: 'Install a plugin (future marketplace)' })
  @ApiResponse({ status: 201, description: 'Plugin installed' })
  async installPlugin(@Body('id') id: string): Promise<{ success: boolean; data: Plugin }> {
    const plugin = await this.pluginsService.installPlugin(id);
    return {
      success: true,
      data: plugin,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Uninstall a plugin' })
  @ApiResponse({ status: 200, description: 'Plugin uninstalled' })
  async uninstallPlugin(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const success = await this.pluginsService.uninstallPlugin(id);

    return {
      success,
      message: success ? `Plugin uninstalled: ${id}` : `Plugin not found: ${id}`,
    };
  }
}
