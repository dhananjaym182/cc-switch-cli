import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, Provider } from '../services/api';
import { Brain, Check, Loader2 } from 'lucide-react';

export default function Providers() {
  const queryClient = useQueryClient();

  const { data: providers, isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: () => apiClient.getProviders(),
  });

  const switchMutation = useMutation({
    mutationFn: (providerId: string) =>
      apiClient.switchProvider(providerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['status'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const providerList = providers?.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Providers</h1>
        <p className="text-slate-400 mt-2">
          Manage AI providers for cc-switch
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providerList.map((provider: Provider) => (
          <div
            key={provider.id}
            className={`card relative transition-all ${
              provider.active ? 'border-primary-500' : ''
            }`}
          >
            {provider.active && (
              <div className="absolute top-4 right-4">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary-600/20 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold">{provider.name}</h3>
                <p className="text-sm text-slate-400">{provider.type}</p>
              </div>
            </div>
            {provider.description && (
              <p className="text-sm text-slate-400 mb-4">
                {provider.description}
              </p>
            )}
            <button
              onClick={() => !provider.active && switchMutation.mutate(provider.id)}
              disabled={provider.active || switchMutation.isPending}
              className={`w-full ${
                provider.active
                  ? 'bg-slate-700 text-slate-400 cursor-default'
                  : 'btn-primary'
              }`}
            >
              {provider.active ? 'Active' : 'Switch to ' + provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
