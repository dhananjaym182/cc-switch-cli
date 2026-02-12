import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService, Profile } from './profiles.service';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'List all profiles' })
  @ApiResponse({ status: 200, description: 'Returns list of profiles' })
  async getAllProfiles(): Promise<{ success: boolean; data: Profile[] }> {
    const profiles = await this.profilesService.getAllProfiles();
    return {
      success: true,
      data: profiles,
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Get the currently active profile' })
  @ApiResponse({ status: 200, description: 'Returns active profile' })
  async getActiveProfile(): Promise<{ success: boolean; data: Profile | null }> {
    const profile = await this.profilesService.getActiveProfile();
    return {
      success: true,
      data: profile,
    };
  }

  @Post('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set the active profile' })
  @ApiResponse({ status: 200, description: 'Active profile set' })
  async setActiveProfile(@Body('id') id: string): Promise<{ success: boolean; data: Profile }> {
    const profile = await this.profilesService.setActiveProfile(id);
    return {
      success: true,
      data: profile,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiResponse({ status: 200, description: 'Returns profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfile(@Param('id') id: string): Promise<{ success: boolean; data?: Profile; message?: string }> {
    const profile = await this.profilesService.getProfile(id);

    if (!profile) {
      return {
        success: false,
        message: `Profile not found: ${id}`,
      };
    }

    return {
      success: true,
      data: profile,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({ status: 201, description: 'Profile created' })
  async createProfile(@Body() profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: Profile }> {
    const newProfile = await this.profilesService.createProfile(profile);
    return {
      success: true,
      data: newProfile,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(
    @Param('id') id: string,
    @Body() updates: Partial<Profile>
  ): Promise<{ success: boolean; data?: Profile; message?: string }> {
    try {
      const profile = await this.profilesService.updateProfile(id, updates);
      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a profile' })
  @ApiResponse({ status: 200, description: 'Profile deleted' })
  async deleteProfile(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.profilesService.deleteProfile(id);

    if (!deleted) {
      return {
        success: false,
        message: `Profile not found: ${id}`,
      };
    }

    return {
      success: true,
      message: `Profile deleted: ${id}`,
    };
  }
}
