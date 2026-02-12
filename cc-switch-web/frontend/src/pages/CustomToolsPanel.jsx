import React, { useState, useEffect } from 'react';
import { fetchTools, registerTool, switchToolConfig, unregisterTool, fetchToolStatus } from '../api';

function CustomToolsPanel() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [toolStatus, setToolStatus] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    configPath: '',
    apiKeyField: 'apiKey',
    endpointField: 'baseUrl',
    modelField: 'model',
    format: 'json',
  });

  const [switchData, setSwitchData] = useState({
    apiKey: '',
    endpoint: '',
    model: '',
  });

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      const data = await fetchTools();
      setTools(data.tools || []);
    } catch (error) {
      console.error('Error loading tools:', error);
      setMessage({ type: 'error', text: `Error loading tools: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setMessage(null);
      const result = await registerTool(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Tool registered successfully!' });
        setShowRegisterForm(false);
        setFormData({
          name: '',
          configPath: '',
          apiKeyField: 'apiKey',
          endpointField: 'baseUrl',
          modelField: 'model',
          format: 'json',
        });
        await loadTools();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to register tool' });
      }
    } catch (error) {
      console.error('Error registering tool:', error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    }
  };

  const handleUnregister = async (name) => {
    if (!confirm(`Are you sure you want to unregister ${name}?`)) {
      return;
    }

    try {
      setMessage(null);
      const result = await unregisterTool(name);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Tool unregistered successfully!' });
        await loadTools();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to unregister tool' });
      }
    } catch (error) {
      console.error('Error unregistering tool:', error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    }
  };

  const handleSwitch = async (e) => {
    e.preventDefault();
    try {
      setMessage(null);
      const result = await switchToolConfig(
        selectedTool,
        switchData.apiKey,
        switchData.endpoint,
        switchData.model
      );
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Tool configuration updated successfully!' });
        setSelectedTool(null);
        setSwitchData({ apiKey: '', endpoint: '', model: '' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to switch tool config' });
      }
    } catch (error) {
      console.error('Error switching tool config:', error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    }
  };

  const handleViewStatus = async (name) => {
    try {
      const status = await fetchToolStatus(name);
      setToolStatus(status);
    } catch (error) {
      console.error('Error fetching tool status:', error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Custom Tools</h2>
        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showRegisterForm ? 'Cancel' : 'Register New Tool'}
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {showRegisterForm && (
        <div className="bg-white shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Register New Tool
            </h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tool Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., kilocode"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Config Path</label>
                  <input
                    type="text"
                    required
                    value={formData.configPath}
                    onChange={(e) => setFormData({ ...formData, configPath: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="~/.kilocode/config.json"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">API Key Field</label>
                  <input
                    type="text"
                    value={formData.apiKeyField}
                    onChange={(e) => setFormData({ ...formData, apiKeyField: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="apiKey"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endpoint Field</label>
                  <input
                    type="text"
                    value={formData.endpointField}
                    onChange={(e) => setFormData({ ...formData, endpointField: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="baseUrl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Model Field</label>
                  <input
                    type="text"
                    value={formData.modelField}
                    onChange={(e) => setFormData({ ...formData, modelField: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="model"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                    <option value="env">ENV</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading tools...</div>
        </div>
      ) : tools.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No custom tools registered.</p>
          <p className="text-sm text-gray-400 mt-2">Click &quot;Register New Tool&quot; to get started.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tools.map((tool) => (
              <li key={tool.name}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">{tool.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 font-mono">{tool.configPath}</p>
                      <div className="mt-2 flex gap-2 text-xs text-gray-400">
                        <span>Format: {tool.format}</span>
                        <span>•</span>
                        <span>API Key: {tool.apiKeyField}</span>
                        <span>•</span>
                        <span>Endpoint: {tool.endpointField}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewStatus(tool.name)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => setSelectedTool(tool.name)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Switch Config
                      </button>
                      <button
                        onClick={() => handleUnregister(tool.name)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTool && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Switch Config for {selectedTool}
            </h3>
            <form onSubmit={handleSwitch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">API Key</label>
                <input
                  type="password"
                  value={switchData.apiKey}
                  onChange={(e) => setSwitchData({ ...switchData, apiKey: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Leave empty to keep current"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Endpoint</label>
                <input
                  type="text"
                  value={switchData.endpoint}
                  onChange={(e) => setSwitchData({ ...switchData, endpoint: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Leave empty to keep current"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  value={switchData.model}
                  onChange={(e) => setSwitchData({ ...switchData, model: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Leave empty to keep current"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTool(null);
                    setSwitchData({ apiKey: '', endpoint: '', model: '' });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toolStatus && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tool Status: {toolStatus.name}
            </h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Config Path</dt>
                <dd className="text-sm text-gray-900 font-mono">{toolStatus.configPath}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Exists</dt>
                <dd className="text-sm text-gray-900">
                  {toolStatus.exists ? (
                    <span className="text-green-600">✓ Yes</span>
                  ) : (
                    <span className="text-red-600">✗ No</span>
                  )}
                </dd>
              </div>
              {toolStatus.exists && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">API Key</dt>
                    <dd className="text-sm text-gray-900">
                      {toolStatus.currentApiKey || 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Endpoint</dt>
                    <dd className="text-sm text-gray-900">
                      {toolStatus.currentEndpoint || 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Model</dt>
                    <dd className="text-sm text-gray-900">
                      {toolStatus.currentModel || 'Not set'}
                    </dd>
                  </div>
                </>
              )}
              {toolStatus.error && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Error</dt>
                  <dd className="text-sm text-red-600">{toolStatus.error}</dd>
                </div>
              )}
            </dl>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setToolStatus(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomToolsPanel;
