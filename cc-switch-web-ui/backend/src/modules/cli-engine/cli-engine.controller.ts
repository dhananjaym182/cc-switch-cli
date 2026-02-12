import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CLIEngineService, RegisteredTool, ConfigUpdateRequest } from './cli-engine.service';
import { CLIToolSchema } from '../../schemas/cli-tool-schema';

@ApiTags('apps')
@Controller('apps')
export class CLIEngineController {
  constructor(private readonly cliEngineService: CLIEngineService) {}

  @Get()
  @ApiOperation({ summary: 'List all registered CLI tools/apps' })
  @ApiResponse({ status: 200, description: 'Returns list of registered tools' })
  async listApps(): Promise<{ success: boolean; data: RegisteredTool[] }> {
    const tools = await this.cliEngineService.getRegisteredTools();
    return {
      success: true,
      data: tools,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific tool' })
  @ApiResponse({ status: 200, description: 'Returns tool details' })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  async getApp(@Param('id') id: string): Promise<{ success: boolean; data?: RegisteredTool; message?: string }> {
    const tool = await this.cliEngineService.getTool(id);

    if (!tool) {
      return {
        success: false,
        message: `Tool not found: ${id}`,
      };
    }

    return {
      success: true,
      data: tool,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new custom CLI tool' })
  @ApiResponse({ status: 201, description: 'Tool registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid schema' })
  async registerTool(@Body() schema: CLIToolSchema): Promise<{ success: boolean; data: RegisteredTool }> {
    const tool = await this.cliEngineService.registerTool(schema);
    return {
      success: true,
      data: tool,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unregister a tool' })
  @ApiResponse({ status: 200, description: 'Tool unregistered successfully' })
  async unregisterTool(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const success = this.cliEngineService.unregisterTool(id);

    if (!success) {
      return {
        success: false,
        message: `Tool not found: ${id}`,
      };
    }

    return {
      success: true,
      message: `Tool unregistered: ${id}`,
    };
  }

  @Get(':id/config')
  @ApiOperation({ summary: 'Read configuration for a tool' })
  @ApiResponse({ status: 200, description: 'Returns configuration' })
  @ApiResponse({ status: 404, description: 'Config file not found' })
  async readConfig(@Param('id') id: string) {
    const config = await this.cliEngineService.readConfig(id);
    return {
      success: true,
      data: config,
    };
  }

  @Put(':id/config')
  @ApiOperation({ summary: 'Update configuration for a tool' })
  @ApiResponse({ status: 200, description: 'Configuration updated' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async updateConfig(
    @Param('id') id: string,
    @Body() request: ConfigUpdateRequest
  ) {
    const snapshot = await this.cliEngineService.updateConfig({
      toolId: id,
      ...request,
    });

    return {
      success: true,
      data: snapshot,
    };
  }

  @Get(':id/backups')
  @ApiOperation({ summary: 'List configuration backups for a tool' })
  @ApiResponse({ status: 200, description: 'Returns list of backups' })
  async listBackups(@Param('id') id: string) {
    const backups = await this.cliEngineService.listBackups(id);
    return {
      success: true,
      data: backups,
    };
  }

  @Post(':id/rollback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rollback configuration to a backup' })
  @ApiResponse({ status: 200, description: 'Configuration rolled back' })
  @ApiResponse({ status: 400, description: 'Rollback failed' })
  async rollbackConfig(
    @Param('id') id: string,
    @Body('backupId') backupId: string
  ) {
    await this.cliEngineService.rollbackConfig(id, backupId);
    return {
      success: true,
      message: `Configuration rolled back to ${backupId}`,
    };
  }
}
