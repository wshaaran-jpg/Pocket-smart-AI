import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchHistory, deleteHistoryItem } from '../services/api';
import { HistoryItem } from '../types';
import {
  History,
  Home,
  PartyPopper,
  Sparkles,
  Calendar,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface HistoryPageProps {
  onViewDetails: (item: HistoryItem) => void;
  onNavigateToPlanner: (planner: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onViewDetails, onNavigateToPlanner }) => {
  const { formatPrice } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchHistory();
      setHistoryItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this saved recommendation?')) return;
    try {
      await deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(item.input_summary).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'home':
        return 'border-l-emerald-500';
      case 'party':
        return 'border-l-amber-500';
      case 'jewelry':
        return 'border-l-rose-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-4 h-4 text-emerald-600" />;
      case 'party':
        return <PartyPopper className="w-4 h-4 text-amber-600" />;
      case 'jewelry':
        return <Sparkles className="w-4 h-4 text-rose-600" />;
      default:
        return <History className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner (matching page 38) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-8 sm:p-10 text-white text-center shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Your Recommendation History
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            View and manage all your previous budget plans and recommendations
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Filters */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Plans' },
            { id: 'home', label: 'Home Interior' },
            { id: 'party', label: 'Party Planning' },
            { id: 'jewelry', label: 'Jewelry Budget' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Grid of Recommendations (matching page 38) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <History className="w-4 h-4 text-blue-600" />
          <span>Recent Recommendations</span>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading recommendation history...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
            <p className="text-slate-500 text-xs font-medium">No saved plans matching your criteria.</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onNavigateToPlanner('home-planner')}
                className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                Create Home Plan
              </button>
              <button
                onClick={() => onNavigateToPlanner('party-planner')}
                className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
              >
                Create Party Plan
              </button>
              <button
                onClick={() => onNavigateToPlanner('jewelry-planner')}
                className="px-3.5 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 cursor-pointer"
              >
                Create Jewelry Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl border border-slate-200 border-l-4 ${getBorderColor(
                  item.type
                )} shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  {/* Top: Title & Date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                        {getCategoryIcon(item.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-900 capitalize">{item.title}</h3>
                        <span className="text-[10px] text-slate-400 block">{item.timestamp}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                      title="Delete plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Budget & Remaining */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-xs border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Total Budget</span>
                      <span className="font-bold text-slate-900">{formatPrice(item.total_budget)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Remaining</span>
                      <span className="font-bold text-blue-600">{formatPrice(item.remaining_budget)}</span>
                    </div>
                  </div>

                  {/* Details Summary Specific to category (matching page 38) */}
                  <div className="text-xs text-slate-600 space-y-1">
                    {item.type === 'jewelry' && (
                      <>
                        <div>Occasion: <span className="font-medium text-slate-800">{item.input_summary.occasion || 'General'}</span></div>
                        <div>With outfit image: <span className="font-medium text-slate-800">{item.input_summary.has_image ? 'Yes' : 'No'}</span></div>
                      </>
                    )}

                    {item.type === 'party' && (
                      <>
                        <div>Party Type: <span className="font-medium text-slate-800">{item.input_summary.party_type || 'Event'}</span></div>
                        <div>Guests: <span className="font-medium text-slate-800">{item.input_summary.guests || '3'}</span></div>
                        {item.input_summary.needs && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.input_summary.needs.map((n: string, i: number) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                                {n}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {item.type === 'home' && (
                      <>
                        {item.input_summary.rooms && (
                          <div>Rooms: <span className="font-medium text-slate-800">{String(item.input_summary.rooms)}</span></div>
                        )}
                        <div className="text-[11px] text-slate-500">
                          Lights: {item.input_summary.lights || 5} • Fans: {item.input_summary.fans || 4} • Furniture: {item.input_summary.furniture || 2}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* View Details Button (matching page 38) */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onViewDetails(item)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
