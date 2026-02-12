import React, { useState, useEffect } from 'react';
import { fetchCurrentProvider, fetchConfig, fetchToolStatus } from '../api';

function Dashboard() {
  const [claudeProvider, setClaudeProvider] = useState(null);
  const [codexProvider, setCodexProvider] = useState(null);
  const [geminiProvider, setGeminiProvider] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      const [claudeRes, codexRes, geminiRes, configRes] = await Promise.all([
        fetchCurrentProvider('claude'),
        fetchCurrentProvider('codex'),
        fetchCurrentProvider('gemini'),
        fetchConfig(),
      ]);
      
      setClaudeProvider(claudeRes.provider);
      setCodexProvider(codexRes.provider);
      setGeminiProvider(geminiRes.provider);
      setConfig(configRes);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Claude Provider</dt>
            <dd className="mt-1 text-3xl font-semibold text-indigo-600">
              {claudeProvider ? claudeProvider.name : 'None'}
            </dd>
            {claudeProvider && (
              <p className="mt-2 text-sm text-gray-500 truncate">{claudeProvider.endpoint}</p>
            )}
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Codex Provider</dt>
            <dd className="mt-1 text-3xl font-semibold text-purple-600">
              {codexProvider ? codexProvider.name : 'None'}
            </dd>
            {codexProvider && (
              <p className="mt-2 text-sm text-gray-500 truncate">{codexProvider.endpoint}</p>
            )}
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Gemini Provider</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">
              {geminiProvider ? geminiProvider.name : 'None'}
            </dd>
            {geminiProvider && (
              <p className="mt-2 text-sm text-gray-500 truncate">{geminiProvider.endpoint}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">System Status</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configuration and active tools
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Active Provider</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {config?.lastActiveProvider || 'None'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Active Tool</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {config?.lastActiveTool || 'None'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Registered Tools</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {config?.toolCount || 0} tools
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Config Directory</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                ~/.cc-switch-web/
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={loadDashboard}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
