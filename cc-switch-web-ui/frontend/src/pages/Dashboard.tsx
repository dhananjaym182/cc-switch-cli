import { useQuery } from '@tanstack/react-query';
import { apiClient, Provider, Profile } from '../services/api';
import {
  Activity,
  Brain,
  AppWindow,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function Dashboard() {
  const { data: status } = useQuery({
    queryKey: ['status'],
    queryFn: () => apiClient.getStatus(),
  });

  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: () => apiClient.getProviders(),
  });

  const { data: activeProfile } = useQuery({
    queryKey: ['active-profile'],
    queryFn: () => apiClient.getActiveProfile(),
  });

  const { data: apps } = useQuery({
    queryKey: ['apps'],
    queryFn: () => apiClient.getApps(),
  });

  const stats = [
    {
      name: 'Active Provider',
      value: providers?.data?.data?.find((p: Provider) => p.active)?.name || 'N/A',
      icon: Brain,
      color: 'text-blue-500',
    },
    {
      name: 'Active Profile',
      value: activeProfile?.data?.data?.name || 'N/A',
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      name: 'Registered Apps',
      value: apps?.data?.data?.length?.toString() || '0',
      icon: AppWindow,
      color: 'text-purple-500',
    },
    {
      name: 'System Status',
      value: status?.data?.data?.ccswitch?.installed ? 'Healthy' : 'Warning',
      icon: Activity,
      color: status?.data?.data?.ccswitch?.installed ? 'text-green-500' : 'text-yellow-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Universal AI CLI Configuration Orchestrator
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </h2>
          {status?.data?.data ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Environment</span>
                <span className="font-medium">{status.data.data.environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Version</span>
                <span className="font-medium">{status.data.data.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Uptime</span>
                <span className="font-medium">
                  {Math.floor(status.data.data.uptime / 60)}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">cc-switch</span>
                <span className={`font-medium ${status.data.data.ccswitch.installed ? 'text-green-500' : 'text-red-500'}`}>
                  {status.data.data.ccswitch.installed
                    ? `Installed (${status.data.data.ccswitch.version})`
                    : 'Not Installed'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">Loading...</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-primary">Switch Provider</button>
            <button className="btn-secondary">New Profile</button>
            <button className="btn-secondary">Register App</button>
            <button className="btn-secondary">View Logs</button>
          </div>
        </div>
      </div>

      {/* System Info */}
      {status?.data?.data?.system && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-400">Platform</p>
              <p className="font-medium">{status.data.data.system.platform}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Architecture</p>
              <p className="font-medium">{status.data.data.system.arch}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Node.js Version</p>
              <p className="font-medium">{status.data.data.system.nodeVersion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
