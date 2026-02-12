import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

/**
 * Role types for RBAC
 */
export enum Role {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

/**
 * User information
 */
export interface User {
  id: string;
  username: string;
  roles: Role[];
  createdAt: Date;
}

/**
 * Encrypted secret
 */
export interface EncryptedSecret {
  algorithm: string;
  iv: string;
  data: string;
  authTag: string;
}

/**
 * Security Service
 *
 * Handles encryption, secrets management, and role-based access control.
 */
@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private readonly encryptionKey: Buffer;
  private readonly algorithm = 'aes-256-gcm';
  private readonly users: Map<string, User> = new Map();

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('ENCRYPTION_KEY');

    if (!key) {
      throw new Error('ENCRYPTION_KEY must be set in environment');
    }

    if (key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be exactly 32 characters');
    }

    this.encryptionKey = Buffer.from(key, 'utf-8');

    // Initialize default admin user
    this.initializeDefaultUser();
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(plaintext: string): EncryptedSecret {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      algorithm: this.algorithm,
      iv: iv.toString('hex'),
      data: encrypted,
      authTag: authTag.toString('hex'),
    };
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encrypted: EncryptedSecret): string {
    const iv = Buffer.from(encrypted.iv, 'hex');
    const authTag = Buffer.from(encrypted.authTag, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Hash a password
   */
  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  /**
   * Generate API token
   */
  generateApiToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Verify user has required role
   */
  hasRole(user: User, requiredRole: Role): boolean {
    const roleHierarchy = {
      [Role.ADMIN]: 3,
      [Role.DEVELOPER]: 2,
      [Role.VIEWER]: 1,
    };

    return roleHierarchy[user.roles[0]] >= roleHierarchy[requiredRole];
  }

  /**
   * Create a new user
   */
  createUser(username: string, roles: Role[]): User {
    const user: User = {
      id: crypto.randomUUID(),
      username,
      roles,
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    this.logger.log(`Created user: ${username} (${user.id})`);

    return user;
  }

  /**
   * Get user by ID
   */
  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  /**
   * Get all users
   */
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * Initialize default admin user
   */
  private initializeDefaultUser(): void {
    const adminUser: User = {
      id: 'admin-001',
      username: 'admin',
      roles: [Role.ADMIN],
      createdAt: new Date(),
    };

    this.users.set(adminUser.id, adminUser);
    this.logger.log('Default admin user initialized');
  }
}
