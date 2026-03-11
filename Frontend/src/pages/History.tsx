import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../api/reportApi';
import { History as HistoryIcon, Trash2, ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const History = () => {
  const navigate = useNavigate();
  const { reports, loading, pagination, fetchReports, deleteReport } = useReports();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchReports(currentPage, 10);
  }, [currentPage, fetchReports]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setDeleteLoading(id);
      const success = await deleteReport(id);
      setDeleteLoading(null);
      if (success) fetchReports(currentPage, 10);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDeviationInfo = (actual: number, predicted: number) => {
    if (!predicted) return null;
    const diff = ((actual - predicted) / predicted) * 100;
    return diff;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <HistoryIcon size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Report History
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  Your past price reports and AI predictions
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/report-price')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-100 transition-all duration-150 whitespace-nowrap"
            >
              <Plus size={15} />
              New Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Loading reports...</p>
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HistoryIcon size={36} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Reports Yet</h3>
            <p className="text-gray-400 text-sm mb-6">You haven't submitted any price reports.</p>
            <button
              onClick={() => navigate('/report-price')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              Create First Report
            </button>
          </div>
        )}

        {!loading && reports.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Your Price</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Market & Month</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">AI Predicted</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Deviation</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reports.map((report) => {
                      const deviation = report.mlAnalysis?.expectedPrice
                        ? getDeviationInfo(report.price, report.mlAnalysis.expectedPrice)
                        : null;

                      return (
                        <tr key={report._id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{report.productName}</div>
                            <div className="text-xs text-gray-400">per {report.unit}</div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-base font-bold text-gray-900">{formatCurrency(report.price)}</div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-800">{report.marketName}</div>
                            <div className="text-xs text-gray-400">{report.month}</div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-base font-bold text-blue-600">
                              {report.mlAnalysis?.expectedPrice ? formatCurrency(report.mlAnalysis.expectedPrice) : '—'}
                            </div>
                            <div className="text-xs text-gray-400">AI estimated</div>
                          </td>

                          <td className="px-6 py-4">
                            <DeviationBadge deviation={deviation} />
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{formatDateTime(report.createdAt)}</div>
                          </td>

                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDelete(report._id)}
                              disabled={deleteLoading === report._id}
                              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 disabled:opacity-50 transition-all"
                            >
                              {deleteLoading === report._id ? (
                                <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {reports.map((report) => {
                const deviation = report.mlAnalysis?.expectedPrice
                  ? getDeviationInfo(report.price, report.mlAnalysis.expectedPrice)
                  : null;

                return (
                  <div key={report._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-gray-900">{report.productName}</div>
                        <div className="text-xs text-gray-400">{report.marketName} · {report.month}</div>
                      </div>
                      <button
                        onClick={() => handleDelete(report._id)}
                        disabled={deleteLoading === report._id}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        {deleteLoading === report._id ? (
                          <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">Your Price</div>
                        <div className="text-sm font-bold text-gray-900">{formatCurrency(report.price)}</div>
                        <div className="text-xs text-gray-400">per {report.unit}</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">AI Price</div>
                        <div className="text-sm font-bold text-blue-600">
                          {report.mlAnalysis?.expectedPrice ? formatCurrency(report.mlAnalysis.expectedPrice) : '—'}
                        </div>
                        <div className="text-xs text-gray-400">predicted</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-400 mb-2">Deviation</div>
                        <DeviationBadge deviation={deviation} />
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-400">{formatDateTime(report.createdAt)}</div>
                  </div>
                );
              })}

              <Pagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const DeviationBadge = ({ deviation }: { deviation: number | null }) => {
  if (deviation === null) return <span className="text-gray-300 text-sm">—</span>;

  const abs = Math.abs(deviation);
  const isUp = deviation > 0;
  const isNeutral = abs <= 2;

  if (isNeutral) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">
        <Minus size={10} /> Fair
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
      isUp ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
    }`}>
      {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {isUp ? '+' : ''}{deviation.toFixed(1)}%
    </span>
  );
};

const Pagination = ({ pagination, currentPage, onPageChange }: {
  pagination: any;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  if (pagination.pages <= 1) return null;

  return (
    <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
      <p className="text-xs text-gray-400">
        Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-gray-700 px-2">
          {currentPage} / {pagination.pages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pagination.pages}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default History;