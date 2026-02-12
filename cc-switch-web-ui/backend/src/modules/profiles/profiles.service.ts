import { Injectable, Logger, NotFoundException } from '@nestjs/common';

/**
 * Profile configuration
 */
export interface Profile {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  activeProvider?: string;
  providers: Record<string, ProviderConfig>;
  customTools: Record<string, Record<string, any>>;
}

/**
 * Provider-specific configuration
 */
export interface ProviderConfig {
  apiKey?: string;
  endpoint?: string;
  model?: string;
  rateLimit?: RateLimitConfig;
  customFields?: Record<string, any>;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  requestsPerMinute?: number;
  requestsPerHour?: number;
  requestsPerDay?: number;
}

/**
 * Profile Service
 *
 * Manages configuration profiles for different environments and use cases.
 */
@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);
  private readonly profiles: Map<string, Profile> = new Map();
  private activeProfileId: string | null = null;

  constructor() {
    // Initialize with default profiles
    this.initializeDefaultProfiles();
  }

  /**
   * Get all profiles
   */
  async getAllProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  /**
   * Get profile by ID
   */
  async getProfile(id: string): Promise<Profile | null> {
    return this.profiles.get(id) || null;
  }

  /**
   * Create a new profile
   */
  async createProfile(profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
    const newProfile: Profile = {
      ...profile,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.profiles.set(newProfile.id, newProfile);
    this.logger.log(`Created profile: ${newProfile.name} (${newProfile.id})`);

    return newProfile;
  }

  /**
   * Update a profile
   */
  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const profile = this.profiles.get(id);

    if (!profile) {
      throw new NotFoundException(`Profile not found: ${id}`);
    }

    const updatedProfile: Profile = {
      ...profile,
      ...updates,
      id: profile.id, // Preserve ID
      createdAt: profile.createdAt, // Preserve creation time
      updatedAt: new Date(),
    };

    this.profiles.set(id, updatedProfile);
    this.logger.log(`Updated profile: ${updatedProfile.name} (${id})`);

    return updatedProfile;
  }

  /**
   * Delete a profile
   */
  async deleteProfile(id: string): Promise<boolean> {
    const profile = this.profiles.get(id);

    if (!profile) {
      return false;
    }

    this.profiles.delete(id);

    // Clear active profile if deleted
    if (this.activeProfileId === id) {
      this.activeProfileId = null;
    }

    this.logger.log(`Deleted profile: ${profile.name} (${id})`);
    return true;
  }

  /**
   * Set active profile
   */
  async setActiveProfile(id: string): Promise<Profile> {
    const profile = this.profiles.get(id);

    if (!profile) {
      throw new NotFoundException(`Profile not found: ${id}`);
    }

    this.activeProfileId = id;
    this.logger.log(`Set active profile: ${profile.name} (${id})`);

    return profile;
  }

  /**
   * Get active profile
   */
  async getActiveProfile(): Promise<Profile | null> {
    if (!this.activeProfileId) {
      return null;
    }

    return this.profiles.get(this.activeProfileId) || null;
  }

  /**
   * Initialize default profiles
   */
  private initializeDefaultProfiles(): void {
    const defaultProfiles: Profile[] = [
      {
        id: 'dev',
        name: 'Development',
        description: 'Development environment profile',
        tags: ['development', 'local'],
        createdAt: new Date(),
        updatedAt: new Date(),
        activeProvider: 'claude',
        providers: {
          claude: {
            model: 'claude-3-sonnet-20240229',
            customFields: {
              maxTokens: 4096,
            },
          },
        },
        customTools: {},
      },
      {
        id: 'prod',
        name: 'Production',
        description: 'Production environment profile',
        tags: ['production', 'live'],
        createdAt: new Date(),
        updatedAt: new Date(),
        activeProvider: 'claude',
        providers: {
          claude: {
            model: 'claude-3-opus-20240229',
            customFields: {
              maxTokens: 8192,
            },
          },
        },
        customTools: {},
      },
      {
        id: 'rightstockai',
        name: 'RightStockAI',
        description: 'RightStockAI workflow configuration',
        tags: ['rightstockai', 'workflow'],
        createdAt: new Date(),
        updatedAt: new Date(),
        activeProvider: 'claude',
        providers: {
          claude: {
            model: 'claude-3-opus-20240229',
            rateLimit: {
              requestsPerMinute: 50,
              requestsPerHour: 1000,
            },
          },
          gemini: {
            model: 'gemini-pro',
          },
        },
        customTools: {
          kilocode: {
            model: 'claude-3-opus-20240229',
          },
        },
      },
      {
        id: 'personal',
        name: 'Personal',
        description: 'Personal development profile',
        tags: ['personal', 'home'],
        createdAt: new Date(),
        updatedAt: new Date(),
        activeProvider: 'claude',
        providers: {
          claude: {
            model: 'claude-3-sonnet-20240229',
          },
        },
        customTools: {},
      },
    ];

    for (const profile of defaultProfiles) {
      this.profiles.set(profile.id, profile);
    }

    // Set default active profile
    this.activeProfileId = 'dev';
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
