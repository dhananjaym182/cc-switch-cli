import { exec } from 'child_process';
import { promisify } from 'util';
import { getCCSwitchBinary } from './config.js';

const execAsync = promisify(exec);

export async function executeCommand(args) {
  try {
    const binary = getCCSwitchBinary();
    const command = `${binary} ${args}`;
    const { stdout, stderr } = await execAsync(command, { 
      maxBuffer: 1024 * 1024 * 10,
      timeout: 30000 
    });
    
    if (stderr && stderr.trim().length > 0) {
      console.warn('cc-switch stderr:', stderr);
    }
    
    return { success: true, output: stdout, error: null };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || '', 
      error: error.stderr || error.message 
    };
  }
}

export async function listProviders(app = 'claude') {
  const result = await executeCommand(`--app ${app} provider list`);
  
  if (!result.success) {
    return { success: false, providers: [], error: result.error };
  }
  
  try {
    const providers = parseProviderList(result.output);
    return { success: true, providers, error: null };
  } catch (error) {
    return { success: false, providers: [], error: error.message };
  }
}

export async function getCurrentProvider(app = 'claude') {
  const result = await executeCommand(`--app ${app} provider current`);
  
  if (!result.success) {
    return { success: false, provider: null, error: result.error };
  }
  
  try {
    const provider = parseCurrentProvider(result.output);
    return { success: true, provider, error: null };
  } catch (error) {
    return { success: false, provider: null, error: error.message };
  }
}

export async function switchProvider(id, app = 'claude') {
  const result = await executeCommand(`--app ${app} provider switch ${id}`);
  return result;
}

export async function getConfigShow() {
  const result = await executeCommand('config show');
  return result;
}

function parseProviderList(output) {
  const providers = [];
  const lines = output.split('\n');
  
  let isTableStarted = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.includes('─') || trimmed.includes('│ ID ') || trimmed === '') {
      if (trimmed.includes('│ ID ')) {
        isTableStarted = true;
      }
      continue;
    }
    
    if (!isTableStarted) continue;
    
    const parts = trimmed.split('│').map(p => p.trim()).filter(p => p);
    
    if (parts.length >= 3) {
      const id = parts[0];
      const name = parts[1];
      const endpoint = parts[2];
      
      if (id && id !== 'ID' && !id.includes('─')) {
        providers.push({
          id,
          name,
          endpoint,
          active: trimmed.startsWith('*') || trimmed.includes('✓')
        });
      }
    }
  }
  
  return providers;
}

function parseCurrentProvider(output) {
  const lines = output.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    const parts = trimmed.split('│').map(p => p.trim()).filter(p => p);
    
    if (parts.length >= 3) {
      const id = parts[0];
      const name = parts[1];
      const endpoint = parts[2];
      
      if (id && id !== 'ID' && !id.includes('─')) {
        return {
          id,
          name,
          endpoint
        };
      }
    }
  }
  
  return null;
}
