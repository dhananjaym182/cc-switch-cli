const API_BASE = '/api';

export async function fetchStatus() {
  const response = await fetch(`${API_BASE}/status`);
  return response.json();
}

export async function fetchProviders(app = 'claude') {
  const response = await fetch(`${API_BASE}/ccswitch/providers?app=${app}`);
  return response.json();
}

export async function fetchCurrentProvider(app = 'claude') {
  const response = await fetch(`${API_BASE}/ccswitch/current?app=${app}`);
  return response.json();
}

export async function switchProvider(id, app = 'claude') {
  const response = await fetch(`${API_BASE}/ccswitch/switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, app }),
  });
  return response.json();
}

export async function fetchTools() {
  const response = await fetch(`${API_BASE}/tools`);
  return response.json();
}

export async function fetchToolStatus(name) {
  const response = await fetch(`${API_BASE}/tools/${name}/status`);
  return response.json();
}

export async function registerTool(toolSchema) {
  const response = await fetch(`${API_BASE}/tools/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toolSchema),
  });
  return response.json();
}

export async function switchToolConfig(name, apiKey, endpoint, model) {
  const response = await fetch(`${API_BASE}/tools/${name}/switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, endpoint, model }),
  });
  return response.json();
}

export async function unregisterTool(name) {
  const response = await fetch(`${API_BASE}/tools/${name}`, {
    method: 'DELETE',
  });
  return response.json();
}

export async function fetchConfig() {
  const response = await fetch(`${API_BASE}/config`);
  return response.json();
}
