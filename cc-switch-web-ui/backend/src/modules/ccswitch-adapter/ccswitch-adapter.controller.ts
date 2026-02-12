import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CCSwitchAdapterService } from './ccswitch-adapter.service';

@ApiTags('providers')
@Controller('providers')
export class CCSwitchAdapterController {
  constructor(private readonly ccSwitchAdapterService: CCSwitchAdapterService) {}

  @Get()
  @ApiOperation({ summary: 'List all available AI providers' })
  @ApiResponse({ status: 200, description: 'Returns list of providers' })
  async listProviders() {
    const providers = await this.ccSwitchAdapterService.listProviders();
    return {
      success: true,
      data: providers,
    };
  }

  @Post('switch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Switch to a specific provider' })
  @ApiResponse({ status: 200, description: 'Provider switched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid provider ID' })
  async switchProvider(@Body('providerId') providerId: string) {
    await this.ccSwitchAdapterService.switchProvider(providerId);
    return {
      success: true,
      message: `Switched to provider: ${providerId}`,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get provider details' })
  @ApiResponse({ status: 200, description: 'Returns provider details' })
  async getProvider(@Param('id') id: string) {
    const providers = await this.ccSwitchAdapterService.listProviders();
    const provider = providers.find((p) => p.id === id);

    if (!provider) {
      return {
        success: false,
        message: `Provider not found: ${id}`,
      };
    }

    return {
      success: true,
      data: provider,
    };
  }
}
