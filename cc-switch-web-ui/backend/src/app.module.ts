import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

// Core Modules
import { CCSwitchAdapterModule } from './modules/ccswitch-adapter/ccswitch-adapter.module';
import { CLIEngineModule } from './modules/cli-engine/cli-engine.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { SecurityModule } from './modules/security/security.module';
import { LogsModule } from './modules/logs/logs.module';
import { PluginsModule } from './modules/plugins/plugins.module';

// API Controllers
import { StatusController } from './controllers/status.controller';
import { ConfigController } from './controllers/config.controller';

// Services
import { AppService } from './services/app.service';
import { DatabaseService } from './services/database.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('THROTTLE_TTL', 60),
        limit: configService.get<number>('THROTTLE_LIMIT', 100),
      }),
    }),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // Feature modules
    CCSwitchAdapterModule,
    CLIEngineModule,
    ProfilesModule,
    SecurityModule,
    LogsModule,
    PluginsModule,
  ],
  controllers: [
    StatusController,
    ConfigController,
  ],
  providers: [
    AppService,
    DatabaseService,
  ],
  exports: [
    AppService,
    DatabaseService,
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    console.log('='.repeat(60));
    console.log('CC-Switch Web UI Backend');
    console.log('='.repeat(60));
    console.log(`Environment: ${this.configService.get('NODE_ENV', 'development')}`);
    console.log(`Port: ${this.configService.get('PORT', 3010)}`);
    console.log(`Database: ${this.configService.get('DATABASE_TYPE', 'sqlite')}`);
    console.log('='.repeat(60));
  }
}
