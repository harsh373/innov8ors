import { useEffect, useState } from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { getUserActivity, type UserActivity } from '../../api/adminApi';
import { formatRelativeTime } from '../../utils/formatters';

const AVATARS = ['🦁', '🐯', '🦊', '🐺', '🦅', '🐬', '🦋', '🐲', '🦄', '🐻', '🦈', '🦉'];

const getAvatar = (userId: string) => {
  const index = userId.charCodeAt(userId.length - 1) % AVATARS.length;
  return AVATARS[index];
};

const getAvatarColor = (userId: string) => {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-orange-100 text-orange-600',
    'bg-pink-100 text-pink-600',
    'bg-teal-100 text-teal-600',
  ];
  const index = userId.charCodeAt(5) % colors.length;
  return colors[index];
};

const UserActivityPage = () => {
  const [users, setUsers] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserActivity();
  }, []);

  const loadUserActivity = async () => {
    try {
      setLoading(true);
      const data = await getUserActivity();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
          <p className="text-gray-400 text-sm">Loading user activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-xl">
            <Users size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">User Activity</h2>
            <p className="text-sm text-gray-500">Monitor behavior and identify suspicious patterns</p>
          </div>
        </div>
      </div>

      {users.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: users.length, color: 'text-gray-900' },
            { label: 'Low Risk', value: users.filter((u) => u.flaggedPercentage < 20).length, color: 'text-green-600' },
            { label: 'Medium Risk', value: users.filter((u) => u.flaggedPercentage >= 20 && u.flaggedPercentage < 40).length, color: 'text-yellow-600' },
            { label: 'High Risk', value: users.filter((u) => u.flaggedPercentage >= 40).length, color: 'text-red-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <Users size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-700 font-semibold">No user activity yet</p>
            <p className="text-xs text-gray-400">Stats will appear once reports are submitted</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Total Reports</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Flagged</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Flagged %</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Last Active</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => {
                  const isLowRisk = user.flaggedPercentage < 20;
                  const isMediumRisk = user.flaggedPercentage >= 20 && user.flaggedPercentage < 40;
                  const isHighRisk = user.flaggedPercentage >= 40;
                  const avatarColor = getAvatarColor(user.userId);
                  const avatar = getAvatar(user.userId);
                  const shortId = user.userId.substring(0, 12) + '...';

                  return (
                    <tr key={user.userId} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${avatarColor}`}>
                            {avatar}
                          </div>
                          <div>
                            <div className="text-xs font-mono text-gray-500">{shortId}</div>
                            <div className="text-xs text-gray-400">Registered user</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-base font-bold text-gray-900">{user.totalReports}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {user.flaggedReports > 0 && <AlertTriangle size={14} className="text-orange-500" />}
                          <span className={`font-bold text-sm ${user.flaggedReports > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                            {user.flaggedReports}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${isHighRisk ? 'bg-red-500' : isMediumRisk ? 'bg-yellow-400' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(user.flaggedPercentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 w-10">
                            {user.flaggedPercentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{formatRelativeTime(user.lastActivity)}</span>
                      </td>

                      <td className="px-6 py-4">
                        {isLowRisk && (
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">Low</span>
                        )}
                        {isMediumRisk && (
                          <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full">Medium</span>
                        )}
                        {isHighRisk && (
                          <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full">High</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityPage;