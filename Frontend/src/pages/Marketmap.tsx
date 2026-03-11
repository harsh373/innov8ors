import { useState } from 'react';
import MapView from '../components/MapView';
import { useMarketMap } from '../api/marketApi';
import { MapPin, Search, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const PRODUCTS = ['Milk', 'Onion', 'Potato', 'Sugar', 'Tomato'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MarketMap = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  const { marketData, loading, error, fetchMarketMapData } = useMarketMap();

  const handleSearch = async () => {
    if (!selectedProduct || !selectedMonth) return;
    setHasSearched(true);
    await fetchMarketMapData(selectedProduct, selectedMonth);
  };

  const anomalousCount = marketData.filter((m) => m.isAnomaly).length;
  const normalCount = marketData.filter((m) => !m.isAnomaly).length;

  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <MapPin size={22} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Delhi Market Map
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Price anomaly visualization across 7 Delhi mandis
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Filter Data
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
          
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Commodity
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select product</option>
                {PRODUCTS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="sm:self-end">
              <button
                onClick={handleSearch}
                disabled={!selectedProduct || !selectedMonth || loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-100 active:scale-95 transition-all duration-150"
              >
                <Search size={15} />
                {loading ? 'Loading...' : 'Show Map'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle size={15} className="text-red-500 shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        
        {!loading && hasSearched && marketData.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp size={16} className="text-blue-500" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{marketData.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total Markets</p>
            </div>
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <p className="text-2xl font-extrabold text-red-600">{anomalousCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Anomalous</p>
            </div>
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle size={16} className="text-green-500" />
              </div>
              <p className="text-2xl font-extrabold text-green-600">{normalCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Normal</p>
            </div>
          </div>
        )}

        {/* Legend — only when data loaded */}
        {!loading && hasSearched && marketData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Legend
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
                <span className="text-xs text-gray-600">Normal <span className="text-gray-400">(≤5% deviation)</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400 shrink-0" />
                <span className="text-xs text-gray-600">Slight Anomaly <span className="text-gray-400">(5–15%)</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                <span className="text-xs text-gray-600">Major Anomaly <span className="text-gray-400">(&gt;15%)</span></span>
              </div>
            </div>
          </div>
        )}

       
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

         
          {loading && (
            <div className="flex flex-col items-center justify-center h-72 sm:h-96 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Fetching market data...</p>
            </div>
          )}

       
          {!loading && !hasSearched && (
            <div className="flex flex-col items-center justify-center h-72 sm:h-96 gap-3 px-6 text-center">
              <div className="bg-blue-50 p-4 rounded-2xl">
                <MapPin size={32} className="text-blue-400" />
              </div>
              <p className="text-gray-700 font-semibold">Select a product & month</p>
              <p className="text-gray-400 text-sm max-w-xs">
                Choose a commodity and month above to visualize price anomalies across Delhi's 7 major mandis
              </p>
            </div>
          )}

         
          {!loading && hasSearched && marketData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-72 sm:h-96 gap-3 px-6 text-center">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <Search size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-700 font-semibold">No data found</p>
              <p className="text-gray-400 text-sm max-w-xs">
                No market data available for <strong>{selectedProduct}</strong> in <strong>{selectedMonth}</strong>. Try a different combination.
              </p>
            </div>
          )}

         
          {!loading && hasSearched && marketData.length > 0 && (
            <div className="w-full overflow-hidden">
              <MapView data={marketData} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MarketMap;