import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useStats } from '../api/statsApi';
import { useReports } from '../api/reportApi';
import { useTrends } from '../api/trendApi';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  ArrowRight,
  Plus,
  BarChart2,
  Sparkles,
} from 'lucide-react';
import {
  formatCurrency,
  formatRelativeTime,
  formatPriceChange,
} from '../utils/formatters';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { stats, loading: statsLoading, fetchStats } = useStats();
  const { reports, loading: reportsLoading, fetchRecentReports } = useReports();
  const { alerts, loading: alertsLoading, fetchAlerts } = useTrends();

  useEffect(() => {
    fetchStats();
    fetchRecentReports();
    fetchAlerts();
  }, [fetchStats, fetchRecentReports, fetchAlerts]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1 tracking-wide uppercase">
                {greeting}
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {user?.firstName}{' '}
                <span className="inline-block animate-wave">👋</span>
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Real-time price intelligence across 7 Delhi markets
              </p>
            </div>

           
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/report-price')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-200 transition-all duration-150"
              >
                <Plus size={16} />
                Report Price
              </button>
              <button
                onClick={() => navigate('/history')}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150"
              >
                <BarChart2 size={16} />
                History
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={FileText}    label="Total Reports"  value={stats?.totalReports || 0}    color="blue"   loading={statsLoading} />
          <StatsCard icon={CheckCircle} label="Verified"        value={stats?.verifiedReports || 0} color="green"  loading={statsLoading} />
          <StatsCard icon={Clock}       label="Pending Review"  value={stats?.pendingReports || 0}  color="amber"  loading={statsLoading} />
          <StatsCard icon={Activity}    label="This Week"       value={stats?.recentActivity || 0}  color="purple" loading={statsLoading} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

       
          <div className="lg:col-span-2 space-y-6">

           
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-1.5 rounded-lg">
                    <AlertTriangle size={18} className="text-orange-500" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Price Alerts</h2>
                </div>
                <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
                  Live
                </span>
              </div>

              <div className="p-4">
                {alertsLoading ? (
                  <AlertSkeleton />
                ) : alerts.length === 0 ? (
                  <EmptyState
                    icon="✅"
                    title="All prices look normal"
                    subtitle="No significant spikes detected right now"
                  />
                ) : (
                  <div className="space-y-2">
                    {alerts.slice(0, 3).map((alert, index) => (
                      <AlertRow key={index} alert={alert} />
                    ))}
                  </div>
                )}
              </div>
            </div>

           
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                <h2 className="text-base font-bold text-gray-900">Recent Reports</h2>
                <button
                  onClick={() => navigate('/history')}
                  className="text-blue-600 text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>

              <div className="p-4">
                {reportsLoading ? (
                  <ReportSkeleton />
                ) : reports.length === 0 ? (
                  <EmptyState
                    icon="📋"
                    title="No reports yet"
                    subtitle="Be the first to report a price in your market"
                    action={{ label: 'Create First Report', onClick: () => navigate('/report-price') }}
                  />
                ) : (
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <ReportRow key={report._id} report={report} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        
          <div className="space-y-6">

          
            <div className="relative bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-6 overflow-hidden text-white shadow-lg shadow-blue-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-blue-200" />
                  <span className="text-blue-200 text-xs font-semibold tracking-wide uppercase">Gemini AI</span>
                </div>
                <p className="text-lg font-bold leading-snug mb-1">
                  AI-Powered Price Intelligence
                </p>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Every report is analyzed by ML models + Gemini to detect unfair pricing patterns across Delhi markets.
                </p>
              </div>
            </div>

         
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="text-base font-bold text-gray-900">Your Top Products</h2>
              </div>
              <div className="p-4">
                {statsLoading ? (
                  <ProductSkeleton />
                ) : !stats?.topProducts || stats.topProducts.length === 0 ? (
                  <EmptyState icon="📦" title="No data yet" subtitle="Start reporting prices!" />
                ) : (
                  <div className="space-y-2">
                    {stats.topProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                            {index + 1}
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-400">{product.count} reports</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-blue-600">
                          {formatCurrency(product.avgPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

       
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Market Coverage</h2>
              <div className="grid grid-cols-2 gap-2">
                {['Azadpur', 'Daryaganj', 'Ghazipur', 'INA Market', 'Keshopur', 'Okhla', 'Rohini'].map((market) => (
                  <div
                    key={market}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-xs font-medium text-gray-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                    {market}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        .animate-wave { display: inline-block; animation: wave 1.5s ease-in-out 0.5s 2; }
      `}</style>
    </div>
  );
};



const colorMap: Record<string, { bg: string; icon: string; text: string; border: string }> = {
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-500',   text: 'text-blue-600',   border: 'border-blue-100' },
  green:  { bg: 'bg-green-50',  icon: 'bg-green-500',  text: 'text-green-600',  border: 'border-green-100' },
  amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-500',  text: 'text-amber-600',  border: 'border-amber-100' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-100' },
};

interface StatsCardProps {
  icon: any;
  label: string;
  value: number;
  color: string;
  loading: boolean;
}

const StatsCard = ({ icon: Icon, label, value, color, loading }: StatsCardProps) => {
  const c = colorMap[color];
  return (
    <div className={`bg-white rounded-2xl border ${c.border} shadow-sm p-5 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
          {loading ? (
            <div className="h-8 w-14 bg-gray-100 animate-pulse rounded-lg" />
          ) : (
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
          )}
        </div>
        <div className={`${c.icon} p-2.5 rounded-xl`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
    </div>
  );
};

const AlertRow = ({ alert }: { alert: any }) => (
  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${alert.type === 'increase' ? 'bg-red-50' : 'bg-green-50'}`}>
        {alert.type === 'increase'
          ? <TrendingUp size={16} className="text-red-500" />
          : <TrendingDown size={16} className="text-green-500" />}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-900">{alert.product}</div>
        <div className="text-xs text-gray-500">{alert.area} · {formatCurrency(alert.oldPrice)} → {formatCurrency(alert.newPrice)}</div>
      </div>
    </div>
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${alert.type === 'increase' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
      {formatPriceChange(alert.change)}
    </span>
  </div>
);

const ReportRow = ({ report }: { report: any }) => (
  <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors group">
    <div>
      <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
        {report.productName}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">
        {report.marketName} · {report.month}
      </div>
      <div className="text-xs text-gray-400">{formatRelativeTime(report.createdAt)}</div>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold text-gray-900">{formatCurrency(report.price)}</div>
      {report.mlAnalysis?.expectedPrice && (
        <div className="text-xs text-blue-600 font-medium">
          AI: {formatCurrency(report.mlAnalysis.expectedPrice)}
        </div>
      )}
      <div className="text-xs text-gray-400">per {report.unit}</div>
    </div>
  </div>
);

const EmptyState = ({ icon, title, subtitle, action }: { icon: string; title: string; subtitle: string; action?: { label: string; onClick: () => void } }) => (
  <div className="text-center py-8 px-4">
    <div className="text-3xl mb-3">{icon}</div>
    <p className="text-sm font-semibold text-gray-700">{title}</p>
    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-4 bg-blue-600 text-white text-xs font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);

const AlertSkeleton = () => (
  <div className="space-y-2">
    {[1,2,3].map(i => (
      <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
    ))}
  </div>
);

const ReportSkeleton = () => (
  <div className="space-y-2">
    {[1,2,3].map(i => (
      <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
    ))}
  </div>
);

const ProductSkeleton = () => (
  <div className="space-y-2">
    {[1,2,3].map(i => (
      <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
    ))}
  </div>
);

export default Home;