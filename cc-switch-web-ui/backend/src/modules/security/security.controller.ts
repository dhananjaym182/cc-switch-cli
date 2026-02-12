import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SecurityService, Role } from './security.service';

@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('encrypt')
  @ApiOperation({ summary: 'Encrypt sensitive data' })
  @ApiResponse({ status: 200, description: 'Data encrypted successfully' })
  encryptData(@Body('data') data: string) {
    const encrypted = this.securityService.encrypt(data);
    return {
      success: true,
      data: encrypted,
    };
  }

  @Post('decrypt')
  @ApiOperation({ summary: 'Decrypt sensitive data' })
  @ApiResponse({ status: 200, description: 'Data decrypted successfully' })
  decryptData(@Body() encrypted: any) {
    const decrypted = this.securityService.decrypt(encrypted);
    return {
      success: true,
      data: decrypted,
    };
  }

  @Post('hash-password')
  @ApiOperation({ summary: 'Hash a password' })
  @ApiResponse({ status: 200, description: 'Password hashed successfully' })
  hashPassword(@Body('password') password: string) {
    const hashed = this.securityService.hashPassword(password);
    return {
      success: true,
      data: { hash: hashed },
    };
  }

  @Post('generate-token')
  @ApiOperation({ summary: 'Generate API token' })
  @ApiResponse({ status: 200, description: 'Token generated successfully' })
  generateToken() {
    const token = this.securityService.generateApiToken();
    return {
      success: true,
      data: { token },
    };
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'Returns list of users' })
  getUsers() {
    const users = this.securityService.getAllUsers();
    return {
      success: true,
      data: users,
    };
  }
}
