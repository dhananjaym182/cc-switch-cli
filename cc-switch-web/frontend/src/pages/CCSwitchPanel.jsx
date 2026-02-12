import React, { useState, useEffect } from 'react';
import { fetchProviders, switchProvider } from '../api';

function CCSwitchPanel() {
  const [app, setApp] = useState('claude');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadProviders();
  }, [app]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await fetchProviders(app);
      setProviders(data.providers || []);
    } catch (error) {
      console.error('Error loading providers:', error);
      setMessage({ type: 'error', text: `Error loading providers: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async (id) => {
    try {
      setSwitching(true);
      setMessage(null);
      
      const result = await switchProvider(id, app);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Provider switched successfully!' });
        await loadProviders();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to switch provider' });
      }
    } catch (error) {
      console.error('Error switching provider:', error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">CC-Switch Providers</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Application:</label>
          <select
            value={app}
            onChange={(e) => setApp(e.target.value)}
            className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="claude">Claude</option>
            <option value="codex">Codex</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading providers...</div>
        </div>
      ) : providers.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No providers configured for {app}.</p>
          <p className="text-sm text-gray-400 mt-2">Use cc-switch CLI to add providers.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {providers.map((provider) => (
              <li key={provider.id} className={provider.active ? 'bg-indigo-50' : ''}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {provider.name}
                      </h3>
                      {provider.active && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate">{provider.endpoint}</p>
                    <p className="mt-1 text-xs text-gray-400">ID: {provider.id}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleSwitch(provider.id)}
                      disabled={switching || provider.active}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        provider.active
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                    >
                      {switching ? 'Switching...' : provider.active ? 'Current' : 'Switch'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={loadProviders}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default CCSwitchPanel;
