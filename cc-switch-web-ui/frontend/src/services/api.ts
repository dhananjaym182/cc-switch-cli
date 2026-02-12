import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Provider {
  id: string;
  name: string;
  type: string;
  active: boolean;
  description?: string;
}

export interface RegisteredTool {
  schema: {
    id: string;
    name: string;
    type: string;
    description?: string;
    icon?: string;
  };
  installed: boolean;
  configExists: boolean;
}

export interface Profile {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  activeProvider?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  action: string;
  resource: string;
  details: Record<string, any>;
}

// API Methods
export const apiClient = {
  // Status
  getStatus: () => api.get('/status'),
  getHealth: () => api.get('/status/health'),

  // Providers
  getProviders: () => api.get('/providers'),
  switchProvider: (providerId: string) => api.post('/providers/switch', { providerId }),
  getConfig: () => api.get('/config'),
  getEnv: () => api.get('/config/env'),

  // Apps (CLI Tools)
  getApps: () => api.get('/apps'),
  getApp: (id: string) => api.get(`/apps/${id}`),
  getAppConfig: (id: string) => api.get(`/apps/${id}/config`),
  updateAppConfig: (id: string, updates: any) => api.put(`/apps/${id}/config`, updates),
  getAppBackups: (id: string) => api.get(`/apps/${id}/backups`),
  rollbackApp: (id: string, backupId: string) =>
    api.post(`/apps/${id}/rollback`, { backupId }),

  // Profiles
  getProfiles: () => api.get('/profiles'),
  getActiveProfile: () => api.get('/profiles/active'),
  setActiveProfile: (id: string) => api.post('/profiles/active', { id }),
  createProfile: (profile: any) => api.post('/profiles', profile),
  updateProfile: (id: string, updates: any) => api.put(`/profiles/${id}`, updates),
  deleteProfile: (id: string) => api.delete(`/profiles/${id}`),

  // Logs
  getLogs: (params?: any) => api.get('/logs', { params }),
  getRecentLogs: (limit?: number) => api.get('/logs/recent', { params: { limit } }),
  getLogStats: () => api.get('/logs/stats'),

  // Plugins
  getPlugins: () => api.get('/plugins'),
  enablePlugin: (id: string) => api.post(`/plugins/${id}/enable`),
  disablePlugin: (id: string) => api.post(`/plugins/${id}/disable`),

  // Security
  encryptData: (data: string) => api.post('/security/encrypt', { data }),
  decryptData: (encrypted: any) => api.post('/security/decrypt', encrypted),
};

export default api;
