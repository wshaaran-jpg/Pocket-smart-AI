import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generatePartyBudget } from '../services/api';
import { PartyBudgetInput, PartyPlanResult } from '../types';
import {
  PartyPopper,
  Users,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  Music,
  Camera,
  Coins,
  Printer,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Building,
  HeartHandshake
} from 'lucide-react';

interface PartyPlannerProps {
  onPlanCreated?: () => void;
}

export const PartyPlanner: React.FC<PartyPlannerProps> = ({ onPlanCreated }) => {
  const { currency, formatPrice } = useAuth();

  // Form State (matching page 34 screenshot defaults: budget 5000, 3 guests, Wedding, Home, Catering+Decoration+Entertainment)
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [numGuests, setNumGuests] = useState<number>(3);
  const [partyType, setPartyType] = useState<string>('Wedding');
  const [venueType, setVenueType] = useState<string>('Home');
  const [needsCatering, setNeedsCatering] = useState<boolean>(true);
  const [needsDecoration, setNeedsDecoration] = useState<boolean>(true);
  const [needsEntertainment, setNeedsEntertainment] = useState<boolean>(true);
  const [needsPhotography, setNeedsPhotography] = useState<boolean>(false);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');

  // Status
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PartyPlanResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: PartyBudgetInput = {
        total_budget: Number(totalBudget),
        num_guests: Number(numGuests),
        party_type: partyType,
        venue_type: venueType,
        needs_catering: needsCatering,
        needs_decoration: needsDecoration,
        needs_entertainment: needsEntertainment,
        needs_photography: needsPhotography,
        additional_requirements: additionalRequirements,
        currency,
      };

      const res = await generatePartyBudget(payload);
      setResult(res);
      if (onPlanCreated) onPlanCreated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate party recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getPlatformChipStyle = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('swiggy')) return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
    if (p.includes('zomato')) return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
    if (p.includes('oyo')) return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
    if (p.includes('makemytrip')) return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    if (p.includes('bookmyshow')) return 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100';
    if (p.includes('amazon')) return 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100';
    if (p.includes('flipkart')) return 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100';
    return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header (matching page 34) */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Party Budget Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Plan your perfect event with AI-powered budget recommendations
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Form View (page 34) */}
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                $
              </div>
              <span>Basic Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>Number of Guests</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={numGuests}
                  onChange={(e) => setNumGuests(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  placeholder="3"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Event Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <PartyPopper className="w-4 h-4 text-blue-600" />
              <span>Event Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Party Type
                </label>
                <select
                  value={partyType}
                  onChange={(e) => setPartyType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
                >
                  <option value="Wedding">Wedding / Intimate Reception</option>
                  <option value="Birthday">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary Party</option>
                  <option value="Corporate">Corporate / Team Social</option>
                  <option value="House Party">Casual House Party</option>
                  <option value="Cocktail">Cocktail & Dinner</option>
                  <option value="Graduation">Graduation / Milestone</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Venue Type
                </label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
                >
                  <option value="Home">Home / Residential Living Room</option>
                  <option value="Banquet Hall">Banquet Hall</option>
                  <option value="Resort / Farmhouse">Resort / Farmhouse</option>
                  <option value="Outdoor Lawn">Outdoor Lawn / Terrace</option>
                  <option value="Restaurant">Restaurant Private Room</option>
                  <option value="Hotel">Hotel Conference / Suite</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Party Needs (matching page 34 checkboxes with icons) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Party Needs</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <label
                className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  needsCatering
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={needsCatering}
                  onChange={(e) => setNeedsCatering(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <UtensilsCrossed className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Catering</span>
              </label>

              <label
                className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  needsDecoration
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={needsDecoration}
                  onChange={(e) => setNeedsDecoration(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Decoration</span>
              </label>

              <label
                className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  needsEntertainment
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={needsEntertainment}
                  onChange={(e) => setNeedsEntertainment(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <Music className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Entertainment</span>
              </label>

              <label
                className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  needsPhotography
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={needsPhotography}
                  onChange={(e) => setNeedsPhotography(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <Camera className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Photography</span>
              </label>
            </div>
          </div>

          {/* Section 4: Additional Requirements */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Additional Requirements</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Special requests, themes, dietary restrictions, etc.
              </label>
              <textarea
                rows={3}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="E.g., Vegetarian menu, Bollywood music theme, intimate ambient lighting, gluten-free dessert..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Optimizing Event Allocations across Swiggy, OYO & Amazon...</span>
                </>
              ) : (
                <>
                  <PartyPopper className="w-4 h-4" />
                  <span>Generate Budget Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Results View (matching page 35) */
        <div className="space-y-6 animate-fade-in print:m-0 print:p-0">
          {/* Header Action Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Your Party Budget Plan
              </h2>
              <div className="text-sm font-bold text-blue-600 mt-1">
                Budget: {formatPrice(result.total_budget)}
              </div>
            </div>

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
                <span>Print/Save</span>
              </button>
            </div>
          </div>

          {/* Breakdown Sections (matching page 35: Venue, Catering, Entertainment, Contingency) */}
          <div className="space-y-4">
            {result.budget_breakdown.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <h3 className="font-bold text-sm text-slate-900">{cat.category}</h3>
                  </div>
                  <span className="font-bold text-sm text-slate-900">{formatPrice(cat.allocation)}</span>
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  {cat.items.map((item, iIdx) => (
                    <div key={iIdx} className={iIdx > 0 ? 'pt-3' : ''}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold text-xs text-slate-800">{item.name}</div>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-xs font-bold text-slate-900 whitespace-nowrap">
                          {formatPrice(item.estimated_price)}
                        </div>
                      </div>

                      {/* Shopping Platform Links */}
                      {item.shopping_links && Object.keys(item.shopping_links).length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400 font-medium">Shop on:</span>
                          {Object.entries(item.shopping_links).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${getPlatformChipStyle(
                                platform
                              )}`}
                            >
                              <span>{platform}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Total Budget Summary Table (matching page 35) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Total Budget</span>
                <span className="font-bold text-slate-900">{formatPrice(result.total_budget)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Allocated</span>
                <span className="font-bold text-blue-600">{formatPrice(result.allocated_budget)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-600">Remaining</span>
                <span className="font-bold text-emerald-600">{formatPrice(result.remaining_budget)}</span>
              </div>
            </div>
          </div>

          {/* Venue Suggestions (matching page 35) */}
          {result.venue_suggestions && result.venue_suggestions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-800 text-white px-5 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Venue Suggestions</span>
              </div>
              <div className="p-5 space-y-4">
                {result.venue_suggestions.map((venue, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">{venue.name}</h4>
                      <span className="font-bold text-xs text-slate-900">{formatPrice(venue.estimated_cost)}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-1">
                      <div>Type: <span className="font-medium text-slate-700">{venue.type}</span></div>
                      <div>Capacity: <span className="font-medium text-slate-700">{venue.capacity || 'Flexible'} guests</span></div>
                      <div>Location: <span className="font-medium text-slate-700">{venue.location || 'Local Area'}</span></div>
                    </div>

                    {venue.search_links && (
                      <div className="pt-2 flex flex-wrap gap-2 items-center text-[11px]">
                        <span className="text-slate-400 font-medium">Explore on:</span>
                        {Object.entries(venue.search_links).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-300 transition-colors"
                          >
                            <span>{platform}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Suggestions (matching page 35) */}
          {result.additional_suggestions && result.additional_suggestions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Additional Suggestions</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                {result.additional_suggestions.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
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
