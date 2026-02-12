import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-2">
          Configure system settings and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                API Endpoint
              </label>
              <input
                type="text"
                defaultValue="http://localhost:3010/api"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Refresh Interval (seconds)
              </label>
              <input type="number" defaultValue="30" className="input w-full" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Encryption Key
              </label>
              <input type="password" className="input w-full" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-backup configs</p>
                <p className="text-sm text-slate-400">
                  Create backups before modifying configs
                </p>
              </div>
              <button className="btn-primary">Enabled</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Provider switch alerts</p>
                <p className="text-sm text-slate-400">
                  Notify when provider is switched
                </p>
              </div>
              <button className="btn-primary">Enabled</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Health check alerts</p>
                <p className="text-sm text-slate-400">
                  Notify when health checks fail
                </p>
              </div>
              <button className="btn-primary">Enabled</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
