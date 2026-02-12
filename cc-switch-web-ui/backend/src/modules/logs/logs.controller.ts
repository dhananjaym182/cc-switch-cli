import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LogsService, AuditLogEntry, LogFilter } from './logs.service';

@ApiTags('logs')
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiOperation({ summary: 'Query audit logs' })
  @ApiResponse({ status: 200, description: 'Returns filtered logs' })
  queryLogs(@Query() filter: LogFilter): { success: boolean; data: AuditLogEntry[]; total: number } {
    const logs = this.logsService.query(filter);
    return {
      success: true,
      data: logs,
      total: logs.length,
    };
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent logs' })
  @ApiResponse({ status: 200, description: 'Returns recent logs' })
  getRecentLogs(@Query('limit') limit: string = '100'): { success: boolean; data: AuditLogEntry[] } {
    const logs = this.logsService.getRecent(parseInt(limit, 10));
    return {
      success: true,
      data: logs,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get log statistics' })
  @ApiResponse({ status: 200, description: 'Returns log statistics' })
  getStats(): { success: boolean; data: Record<string, number> } {
    const stats = this.logsService.getStats();
    return {
      success: true,
      data: stats,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a log entry' })
  @ApiResponse({ status: 201, description: 'Log entry created' })
  createLog(@Body() entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): { success: boolean; data: AuditLogEntry } {
    const log = this.logsService.create(entry);
    return {
      success: true,
      data: log,
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all logs' })
  @ApiResponse({ status: 200, description: 'All logs cleared' })
  clearLogs(): { success: boolean; message: string } {
    this.logsService.clear();
    return {
      success: true,
      message: 'All logs cleared',
    };
  }
}
