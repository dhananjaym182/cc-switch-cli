import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

const CONFIG_DIR = path.join(os.homedir(), '.cc-switch-web');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function getConfigPath() {
  return CONFIG_FILE;
}

export function loadConfig() {
  ensureConfigDir();
  
  if (!fs.existsSync(CONFIG_FILE)) {
    const defaultConfig = {
      adminPassword: '',
      tools: [],
      lastActiveProvider: null,
      lastActiveTool: null,
    };
    saveConfig(defaultConfig);
    return defaultConfig;
  }
  
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading config:', error);
    return {
      adminPassword: '',
      tools: [],
      lastActiveProvider: null,
      lastActiveTool: null,
    };
  }
}

export function saveConfig(config) {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getCCSwitchBinary() {
  try {
    execSync('which cc-switch', { encoding: 'utf8' });
    return 'cc-switch';
  } catch (error) {
    const localPath = path.join(process.cwd(), '../../src-tauri/target/release/cc-switch');
    if (fs.existsSync(localPath)) {
      return localPath;
    }
    throw new Error('cc-switch binary not found. Please install cc-switch first.');
  }
}
