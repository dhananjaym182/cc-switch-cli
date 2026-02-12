import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { AppWindow, CheckCircle, AlertCircle } from 'lucide-react';

export default function Apps() {
  const { data: apps, isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: () => apiClient.getApps(),
  });

  if (isLoading) {
    return <div className="text-slate-500">Loading...</div>;
  }

  const appList = apps?.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Apps Registry</h1>
        <p className="text-slate-400 mt-2">
          Manage CLI tools and applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appList.map((app: any) => (
          <div key={app.schema.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <span className="text-2xl">{app.schema.icon || '📦'}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{app.schema.name}</h3>
                  <p className="text-sm text-slate-400">{app.schema.id}</p>
                </div>
              </div>
              {app.installed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            {app.schema.description && (
              <p className="text-sm text-slate-400 mb-4">
                {app.schema.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <span className={app.installed ? 'text-green-500' : 'text-yellow-500'}>
                {app.installed ? 'Installed' : 'Not installed'}
              </span>
              <span className={app.configExists ? 'text-green-500' : 'text-slate-500'}>
                {app.configExists ? 'Config exists' : 'No config'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
