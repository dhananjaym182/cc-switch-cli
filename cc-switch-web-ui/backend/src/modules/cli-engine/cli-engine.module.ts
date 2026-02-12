import { Module } from '@nestjs/common';
import { CLIEngineService } from './cli-engine.service';
import { CLIEngineController } from './cli-engine.controller';

@Module({
  controllers: [CLIEngineController],
  providers: [CLIEngineService],
  exports: [CLIEngineService],
})
export class CLIEngineModule {}
