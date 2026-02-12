import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { ScrollText } from 'lucide-react';

export default function Logs() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: () => apiClient.getRecentLogs(50),
  });

  if (isLoading) {
    return <div className="text-slate-500">Loading...</div>;
  }

  const logList = logs?.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-slate-400 mt-2">
          View system activity and configuration changes
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Timestamp
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Level
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Action
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Resource
                </th>
              </tr>
            </thead>
            <tbody>
              {logList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500">
                    No logs found
                  </td>
                </tr>
              ) : (
                logList.map((log: any) => (
                  <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          log.level === 'error'
                            ? 'bg-red-900/50 text-red-400'
                            : log.level === 'warn'
                            ? 'bg-yellow-900/50 text-yellow-400'
                            : log.level === 'info'
                            ? 'bg-blue-900/50 text-blue-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-400">
                      {log.resource}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
