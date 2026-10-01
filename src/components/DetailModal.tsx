import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HistoryItem } from '../types';
import {
  X,
  Printer,
  ExternalLink,
  Sparkles,
  Home,
  PartyPopper,
  Gem,
  Palette,
  CheckCircle2,
  Table,
  MapPin
} from 'lucide-react';

interface DetailModalProps {
  item: HistoryItem | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  const { formatPrice } = useAuth();

  if (!item) return null;

  const result: any = item.full_result;

  const handlePrint = () => {
    window.print();
  };

  const getPlatformChipStyle = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('swiggy')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (p.includes('zomato')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (p.includes('tanishq')) return 'bg-amber-50 text-amber-900 border-amber-300';
    if (p.includes('caratlane')) return 'bg-purple-50 text-purple-800 border-purple-300';
    if (p.includes('ikea')) return 'bg-yellow-50 text-yellow-900 border-yellow-300';
    if (p.includes('amazon')) return 'bg-amber-50 text-amber-800 border-amber-300';
    if (p.includes('flipkart')) return 'bg-sky-50 text-sky-800 border-sky-300';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              {item.type === 'home' && <Home className="w-4 h-4" />}
              {item.type === 'party' && <PartyPopper className="w-4 h-4" />}
              {item.type === 'jewelry' && <Gem className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">{item.title}</h3>
              <p className="text-[11px] text-slate-400">{item.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-3 text-center">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Total Budget</span>
              <span className="text-base sm:text-lg font-bold text-slate-900">{formatPrice(item.total_budget)}</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Allocated Cost</span>
              <span className="text-base sm:text-lg font-bold text-blue-600">
                {formatPrice(result?.allocated_budget || item.total_budget - item.remaining_budget)}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Remaining Buffer</span>
              <span className="text-base sm:text-lg font-bold text-emerald-600">{formatPrice(item.remaining_budget)}</span>
            </div>
          </div>

          {/* Outfit Analysis if Jewelry */}
          {result?.outfit_analysis && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>Outfit Analysis</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Colors: </span>
                  <span className="font-semibold text-slate-800">
                    {result.outfit_analysis.colors?.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Style: </span>
                  <span className="font-semibold text-slate-800">{result.outfit_analysis.style}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Formality: </span>
                  <span className="font-semibold text-slate-800">{result.outfit_analysis.formality}</span>
                </div>
              </div>
            </div>
          )}

          {/* Category Breakdown (Home & Party) */}
          {result?.budget_breakdown && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Allocated Categories</h4>
              {result.budget_breakdown.map((cat: any, idx: number) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                    <span className="font-bold text-xs text-slate-800 capitalize">{cat.category}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {formatPrice(cat.allocation)}
                    </span>
                  </div>

                  <div className="p-4 divide-y divide-slate-100 space-y-3">
                    {cat.items?.map((it: any, iIdx: number) => (
                      <div key={iIdx} className={iIdx > 0 ? 'pt-3' : ''}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-xs text-slate-800">{it.name}</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{it.description}</p>
                          </div>
                          <div className="text-xs font-bold text-slate-900 whitespace-nowrap">
                            {formatPrice(it.estimated_price)}
                          </div>
                        </div>

                        {it.shopping_links && (
                          <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] text-slate-400 font-medium">Direct Links:</span>
                            {Object.entries(it.shopping_links).map(([platform, url]: any) => (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border transition-all hover:shadow-xs ${getPlatformChipStyle(
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
          )}

          {/* Jewelry Recommendations */}
          {result?.jewelry_recommendations && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Recommended Jewelry Pieces</h4>
              <div className="space-y-3">
                {result.jewelry_recommendations.map((it: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block capitalize">{it.item_type || it.name}</span>
                        <p className="text-xs text-slate-600 mt-0.5">{it.description}</p>
                        <span className="text-[10px] text-slate-500 font-medium">Style: {it.style}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-xs whitespace-nowrap">
                        {formatPrice(it.estimated_price)}
                      </span>
                    </div>

                    {it.shopping_links && (
                      <div className="pt-2 flex flex-wrap gap-1.5 items-center border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-medium">Shop on:</span>
                        {Object.entries(it.shopping_links).map(([platform, url]: any) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${getPlatformChipStyle(
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
          )}

          {/* Venue suggestions if Party */}
          {result?.venue_suggestions && result.venue_suggestions.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Venue Suggestions</span>
              </div>
              {result.venue_suggestions.map((v: any, idx: number) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{v.name}</span>
                    <span>{formatPrice(v.estimated_cost)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Type: {v.type} • Capacity: {v.capacity || 'Flexible'} • Location: {v.location || 'Local'}
                  </div>
                  {v.search_links && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {Object.entries(v.search_links).map(([p, u]: any) => (
                        <a
                          key={p}
                          href={u}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold border border-slate-300"
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Suggestions or Tips */}
          {(result?.additional_suggestions || result?.styling_tips) && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
              <span className="font-bold text-xs text-blue-900 uppercase tracking-wider block">
                Smart Suggestions & Tips
              </span>
              <div className="space-y-1.5">
                {(result.additional_suggestions || result.styling_tips).map((tip: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
