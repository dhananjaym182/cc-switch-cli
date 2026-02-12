import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Database Service
 *
 * Handles database connections and queries.
 * Phase 1: In-memory / SQLite
 * Phase 2: PostgreSQL
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private connected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    this.logger.log('Connecting to database...');

    // In production, would establish real database connection
    // For now, simulating connection
    setTimeout(() => {
      this.connected = true;
      this.logger.log('Database connected successfully');
    }, 100);
  }

  private async disconnect() {
    if (this.connected) {
      this.logger.log('Disconnecting from database...');
      this.connected = false;
      this.logger.log('Database disconnected');
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
