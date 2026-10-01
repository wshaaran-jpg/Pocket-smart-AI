import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateHomeBudget } from '../services/api';
import { HomeBudgetInput, HomePlanResult } from '../types';
import {
  Home,
  Lightbulb,
  Fan,
  Armchair,
  Utensils,
  Check,
  Sparkles,
  ExternalLink,
  Printer,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Table,
  BadgePercent
} from 'lucide-react';

interface HomePlannerProps {
  onPlanCreated?: () => void;
}

export const HomePlanner: React.FC<HomePlannerProps> = ({ onPlanCreated }) => {
  const { currency, formatPrice } = useAuth();

  // Form State
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [numLights, setNumLights] = useState<number>(5);
  const [numFans, setNumFans] = useState<number>(4);
  const [numFurniture, setNumFurniture] = useState<number>(2);
  const [numDiningTables, setNumDiningTables] = useState<number>(1);
  const [rooms, setRooms] = useState({
    living_room: true,
    kitchen: true,
    bedroom: false,
    balcony: false,
    bathroom: false,
  });
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');

  // Execution state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HomePlanResult | null>(null);

  const handleRoomToggle = (key: keyof typeof rooms) => {
    setRooms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: HomeBudgetInput = {
        total_budget: Number(totalBudget),
        num_lights: Number(numLights),
        num_fans: Number(numFans),
        num_furniture: Number(numFurniture),
        num_dining_tables: Number(numDiningTables),
        rooms,
        additional_requirements: additionalRequirements,
        currency,
      };

      const res = await generateHomeBudget(payload);
      setResult(res);
      if (onPlanCreated) onPlanCreated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'amazon':
        return 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';
      case 'flipkart':
        return 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100';
      case 'ikea':
        return 'bg-yellow-50 text-yellow-900 border-yellow-300 hover:bg-yellow-100';
      case 'myntra':
        return 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100';
      case 'ajio':
        return 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header (matching page 32) */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Home Interior Budget Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Create a customized budget plan for your dream home interior
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* If No Result, Show Form (page 32) */}
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Budget Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                $
              </div>
              <span>Budget Details</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Budget ({currency === 'INR' ? '₹' : '$'})
              </label>
              <div className="relative rounded-md shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-semibold text-sm">
                  {currency === 'INR' ? '₹' : '$'}
                </span>
                <input
                  type="number"
                  min="500"
                  step="100"
                  required
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800"
                  placeholder="5000"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Recommended minimum ₹3,000 for standard room basics.</p>
            </div>
          </div>

          {/* Section 2: Fixtures & Furniture */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span>Fixtures & Furniture</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
                  <span>Number of Lights/Fixtures</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={numLights}
                  onChange={(e) => setNumLights(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Fan className="w-3.5 h-3.5 text-blue-500" />
                  <span>Number of Ceiling Fans</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={numFans}
                  onChange={(e) => setNumFans(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Armchair className="w-3.5 h-3.5 text-blue-500" />
                  <span>Number of Furniture Pieces</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={numFurniture}
                  onChange={(e) => setNumFurniture(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-blue-500" />
                  <span>Number of Dining Tables</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={numDiningTables}
                  onChange={(e) => setNumDiningTables(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Rooms to Include */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <Home className="w-4 h-4 text-blue-600" />
              <span>Rooms to Include</span>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 pt-1">
              {[
                { key: 'living_room', label: 'Living Room' },
                { key: 'kitchen', label: 'Kitchen' },
                { key: 'bedroom', label: 'Bedroom' },
                { key: 'balcony', label: 'Balcony' },
                { key: 'bathroom', label: 'Bathroom' },
              ].map((room) => {
                const checked = rooms[room.key as keyof typeof rooms];
                return (
                  <label
                    key={room.key}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleRoomToggle(room.key as keyof typeof rooms)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{room.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 4: Additional Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Additional Information</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Special Requirements or Preferences
              </label>
              <textarea
                rows={3}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Any specific requirements or preferences (e.g. minimalist scandinavian, warm wood tones, energy-saving 5-star BEE fans)..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          {/* Submit Button (matching page 32) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Market & Allocating Budget with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Recommendations</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Results View (matching page 33) */
        <div className="space-y-6 animate-fade-in print:m-0 print:p-0">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Your Personalized Budget Plan
            </h2>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => setResult(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Modify Inputs</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save</span>
              </button>
            </div>
          </div>

          {/* Budget Summary Card (matching page 33) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-blue-600 text-white px-5 py-3 font-bold text-sm flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                $
              </div>
              <span>Budget Summary</span>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Budget:</span>
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  {formatPrice(result.total_budget)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Allocated Spent:</span>
                <span className="text-base sm:text-lg font-bold text-blue-700">
                  {formatPrice(result.allocated_budget)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Remaining Budget:</span>
                <span className="text-base sm:text-lg font-bold text-emerald-600">
                  {formatPrice(result.remaining_budget)}
                </span>
              </div>
            </div>
          </div>

          {/* Categories & Product Recommendations (matching page 33) */}
          <div className="space-y-6">
            {result.budget_breakdown.map((category, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Category Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.category.toLowerCase().includes('light') && <Lightbulb className="w-4 h-4 text-amber-500" />}
                    {category.category.toLowerCase().includes('fan') && <Fan className="w-4 h-4 text-blue-500" />}
                    {category.category.toLowerCase().includes('furn') && <Armchair className="w-4 h-4 text-indigo-500" />}
                    <h3 className="font-bold text-sm text-slate-800 capitalize">{category.category}</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Allocation: {formatPrice(category.allocation)}
                  </span>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/60 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-2.5 px-4 w-1/4">Item</th>
                        <th className="py-2.5 px-4 w-2/5">Description</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-4">Shopping Links</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {category.items.map((item, iIdx) => (
                        <tr key={iIdx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-800 align-top">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-slate-600 leading-relaxed align-top">
                            {item.description}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900 align-top whitespace-nowrap">
                            {formatPrice(item.estimated_price)}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-slate-600 align-top">
                            {item.quantity || 1}
                          </td>
                          <td className="py-3 px-4 align-top">
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(item.shopping_links || {}).map(([platform, url]) => (
                                <a
                                  key={platform}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${getPlatformColor(
                                    platform
                                  )}`}
                                  title={`Search for "${item.search_terms}" on ${platform}`}
                                >
                                  <span>{platform}</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </a>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Calculation Table (as specified in page 12 & 33) */}
          {result.calculation_table && result.calculation_table.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-800 text-white px-5 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-400" />
                <span>Budget Allocation Breakdown Table</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                    <tr>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3 text-center">Items Count</th>
                      <th className="py-2 px-3">Total Cost</th>
                      <th className="py-2 px-3">% of Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.calculation_table.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800 capitalize">{row.category}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600 font-medium">{row.items_count}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{formatPrice(row.total_cost)}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${Math.min(100, row.percentage_of_budget)}%` }}
                              />
                            </div>
                            <span className="font-semibold text-slate-700">{row.percentage_of_budget}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Additional Suggestions (matching page 33) */}
          {result.additional_suggestions && result.additional_suggestions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-blue-600 text-white px-5 py-3 font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Additional Suggestions</span>
              </div>
              <div className="p-5 space-y-3">
                {result.additional_suggestions.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
