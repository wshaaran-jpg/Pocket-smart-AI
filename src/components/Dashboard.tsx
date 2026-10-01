import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchHistory, deleteHistoryItem } from '../services/api';
import { HistoryItem } from '../types';
import {
  Home,
  PartyPopper,
  Sparkles,
  History,
  Clock,
  ArrowRight,
  TrendingUp,
  Trash2,
  ExternalLink,
  Calendar,
  Layers,
  Sparkle
} from 'lucide-react';

interface DashboardProps {
  onSelectPlanner: (planner: string) => void;
  onViewHistoryItem: (item: HistoryItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectPlanner, onViewHistoryItem }) => {
  const { user, formatPrice } = useAuth();
  const [recentItems, setRecentItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    try {
      setLoading(true);
      const items = await fetchHistory();
      setRecentItems(items.slice(0, 5));
    } catch (err) {
      console.error('Failed to load recent activity', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteHistoryItem(id);
      setRecentItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const getPlannerIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-4 h-4 text-blue-600" />;
      case 'party':
        return <PartyPopper className="w-4 h-4 text-indigo-600" />;
      case 'jewelry':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      default:
        return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-8 sm:p-10 text-white text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, <span className="capitalize text-blue-300">{user?.username || 'Planner'}</span>!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Choose a budget planner to get started with your personalized financial planning experience
          </p>
        </div>
      </div>

      {/* 3 Planners Grid (matching page 31) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Card 1: Home */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group">
          <div>
            <div className="h-44 bg-gradient-to-tr from-slate-800 to-blue-950 relative overflow-hidden flex items-center justify-center p-4">
              {/* Home visual illustration banner */}
              <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-xs" />
              <div className="relative z-10 text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-105 transition-transform">
                  <Home className="w-7 h-7" />
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-blue-200">Furniture & Lighting</div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Home Budget Planner</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plan your interior design budget efficiently with AI-powered recommendations for furniture, lighting, and more.
              </p>
            </div>
          </div>

          <div className="p-6 pt-0">
            <button
              onClick={() => onSelectPlanner('home-planner')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-center"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Card 2: Party */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group">
          <div>
            <div className="h-44 bg-gradient-to-tr from-indigo-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-xs" />
              <div className="relative z-10 text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:scale-105 transition-transform">
                  <PartyPopper className="w-7 h-7" />
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-indigo-200">Events & Catering</div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <PartyPopper className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Party Budget Planner</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plan your perfect event with budget allocations for venue, catering, decorations, and entertainment.
              </p>
            </div>
          </div>

          <div className="p-6 pt-0">
            <button
              onClick={() => onSelectPlanner('party-planner')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-center"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Card 3: Jewelry */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group">
          <div>
            <div className="h-44 bg-gradient-to-tr from-amber-950 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-xs" />
              <div className="relative z-10 text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/40 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-amber-200">Multimodal Matching</div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Jewelry Budget Planner</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find the ideal jewelry pieces for any occasion that match your outfit and stay within your budget.
              </p>
            </div>
          </div>

          <div className="p-6 pt-0">
            <button
              onClick={() => onSelectPlanner('jewelry-planner')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-center"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Action: View All History (matching page 31 button) */}
      <div className="flex justify-center">
        <button
          onClick={() => onSelectPlanner('history')}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-lg shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <History className="w-4 h-4" />
          <span>View All Recommendation History</span>
        </button>
      </div>

      {/* Recent Activity Section (matching page 31) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <h2 className="font-bold text-sm tracking-wide">Recent Activity</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Last 5 Plans</span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading recent plans...</div>
          ) : recentItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No recent plans yet. Select a planner above to create your first budget!
            </div>
          ) : (
            recentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onViewHistoryItem(item)}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {getPlannerIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Budget: <span className="font-semibold text-slate-700">{formatPrice(item.total_budget)}</span>
                      {' • '}
                      <span>{item.timestamp}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-semibold text-emerald-600 block">
                      Saved {formatPrice(item.remaining_budget)}
                    </span>
                    <span className="text-[10px] text-slate-400">Remaining</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
