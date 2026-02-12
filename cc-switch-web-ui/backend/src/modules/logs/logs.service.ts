import { Injectable, Logger } from '@nestjs/common';

/**
 * Log entry types
 */
export type LogType = 'info' | 'warn' | 'error' | 'debug';

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  level: LogType;
  userId?: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

/**
 * Log filter options
 */
export interface LogFilter {
  userId?: string;
  level?: LogType;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Logs Service
 *
 * Handles audit logging and log retrieval for compliance and debugging.
 */
@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);
  private readonly logs: AuditLogEntry[] = [];

  /**
   * Create a log entry
   */
  create(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const logEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date(),
    };

    this.logs.push(logEntry);
    this.logger.debug(`Created log entry: ${entry.action} on ${entry.resource}`);

    // Keep logs in memory only (in production, would write to database)
    if (this.logs.length > 10000) {
      this.logs.shift(); // Remove oldest
    }

    return logEntry;
  }

  /**
   * Query logs with filters
   */
  query(filter: LogFilter): AuditLogEntry[] {
    let results = [...this.logs];

    // Filter by userId
    if (filter.userId) {
      results = results.filter((log) => log.userId === filter.userId);
    }

    // Filter by level
    if (filter.level) {
      results = results.filter((log) => log.level === filter.level);
    }

    // Filter by action
    if (filter.action) {
      results = results.filter((log) => log.action.includes(filter.action));
    }

    // Filter by resource
    if (filter.resource) {
      results = results.filter((log) => log.resource === filter.resource);
    }

    // Filter by date range
    if (filter.startDate) {
      results = results.filter((log) => log.timestamp >= filter.startDate);
    }
    if (filter.endDate) {
      results = results.filter((log) => log.timestamp <= filter.endDate);
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    if (filter.offset) {
      results = results.slice(filter.offset);
    }
    if (filter.limit) {
      results = results.slice(0, filter.limit);
    }

    return results;
  }

  /**
   * Get log by ID
   */
  getById(id: string): AuditLogEntry | undefined {
    return this.logs.find((log) => log.id === id);
  }

  /**
   * Get recent logs
   */
  getRecent(limit: number = 100): AuditLogEntry[] {
    return this.query({ limit });
  }

  /**
   * Clear all logs (with caution)
   */
  clear(): void {
    this.logs.length = 0;
    this.logger.warn('All logs cleared');
  }

  /**
   * Get logs statistics
   */
  getStats(): Record<string, number> {
    const stats = {
      total: this.logs.length,
      info: 0,
      warn: 0,
      error: 0,
      debug: 0,
    };

    for (const log of this.logs) {
      stats[log.level]++;
    }

    return stats;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
