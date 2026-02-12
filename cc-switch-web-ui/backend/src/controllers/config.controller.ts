import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CCSwitchAdapterService } from '../modules/ccswitch-adapter/ccswitch-adapter.service';

@ApiTags('config')
@Controller('config')
export class ConfigController {
  constructor(private readonly ccSwitchAdapterService: CCSwitchAdapterService) {}

  @Get()
  @ApiOperation({ summary: 'Get current configuration' })
  @ApiResponse({ status: 200, description: 'Returns current configuration' })
  async getConfig() {
    const config = await this.ccSwitchAdapterService.getConfig();
    return {
      success: true,
      data: config,
    };
  }

  @Get('env')
  @ApiOperation({ summary: 'Get environment variables' })
  @ApiResponse({ status: 200, description: 'Returns environment variables' })
  async getEnv() {
    const env = await this.ccSwitchAdapterService.getEnv();
    return {
      success: true,
      data: env,
    };
  }
}
