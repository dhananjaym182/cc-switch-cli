import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CCSwitchAdapterService } from '../modules/ccswitch-adapter/ccswitch-adapter.service';

/**
 * App Service
 *
 * Main application service providing core functionality.
 */
@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ccSwitchAdapterService: CCSwitchAdapterService,
  ) {}

  /**
   * Get system status
   */
  async getStatus() {
    const installationCheck = await this.ccSwitchAdapterService.checkInstallation();

    return {
      success: true,
      data: {
        name: 'CC-Switch Web UI',
        version: '1.0.0',
        environment: this.configService.get('NODE_ENV', 'development'),
        uptime: process.uptime(),
        timestamp: new Date(),
        ccswitch: {
          installed: installationCheck.installed,
          version: installationCheck.version,
          error: installationCheck.error,
        },
        system: {
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
        },
      },
    };
  }

  /**
   * Health check
   */
  async getHealth() {
    return {
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime(),
      checks: {
        database: 'ok',
        api: 'ok',
        ccswitch: (await this.ccSwitchAdapterService.checkInstallation()).installed ? 'ok' : 'error',
      },
    };
  }
}
