import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CCSwitchAdapterService } from './ccswitch-adapter.service';
import { CCSwitchAdapterController } from './ccswitch-adapter.controller';

@Module({
  imports: [ConfigModule],
  controllers: [CCSwitchAdapterController],
  providers: [CCSwitchAdapterService],
  exports: [CCSwitchAdapterService],
})
export class CCSwitchAdapterModule {}
