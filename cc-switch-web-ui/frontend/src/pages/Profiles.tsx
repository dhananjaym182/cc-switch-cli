import { useQuery } from '@tanstack/react-query';
import { apiClient, Profile } from '../services/api';
import { UserCircle } from 'lucide-react';

export default function Profiles() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => apiClient.getProfiles(),
  });

  if (isLoading) {
    return <div className="text-slate-500">Loading...</div>;
  }

  const profileList = profiles?.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profiles</h1>
        <p className="text-slate-400 mt-2">
          Manage configuration profiles for different environments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileList.map((profile: Profile) => (
          <div key={profile.id} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">{profile.name}</h3>
                <p className="text-sm text-slate-400">{profile.id}</p>
              </div>
            </div>
            {profile.description && (
              <p className="text-sm text-slate-400 mb-4">
                {profile.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            {profile.activeProvider && (
              <div className="text-sm text-slate-400">
                Active: {profile.activeProvider}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
