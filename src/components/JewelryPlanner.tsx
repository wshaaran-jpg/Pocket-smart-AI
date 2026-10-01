import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateJewelryBudget } from '../services/api';
import { JewelryBudgetInput, JewelryPlanResult } from '../types';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  Printer,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Watch,
  Gem,
  Palette,
  Check,
  Eye
} from 'lucide-react';

interface JewelryPlannerProps {
  onPlanCreated?: () => void;
}

// Preset sample outfit images (data URIs or clean SVG illustrations matching the page 36 screenshot)
const SAMPLE_OUTFITS = [
  {
    id: 'blue-shirt',
    name: 'Casual Blue Shirt (As in Demo)',
    description: 'Crisp light-blue casual button-up shirt',
    colorHex: '#3b82f6',
    previewUrl:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'royal-saree',
    name: 'Maroon & Gold Silk Saree',
    description: 'Festive traditional Indian silk saree with gold border',
    colorHex: '#991b1b',
    previewUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'emerald-gown',
    name: 'Emerald Evening Gown',
    description: 'Formal cocktail satin gown with V-neckline',
    colorHex: '#047857',
    previewUrl:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=80',
  },
];

export const JewelryPlanner: React.FC<JewelryPlannerProps> = ({ onPlanCreated }) => {
  const { currency, formatPrice } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State (matching page 36 screenshot defaults: budget 5000, Birthday, Casual preferences, with blue shirt image)
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [occasion, setOccasion] = useState<string>('Birthday');
  const [preferences, setPreferences] = useState<string>('Describe your style preferences, materials, colors, etc.');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  // Execution state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JewelryPlanResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result as string;
      setImageBase64(base64Str);
      setImagePreview(base64Str);
      setImageName(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sample: typeof SAMPLE_OUTFITS[0]) => {
    setImageName(sample.name);
    setImagePreview(sample.previewUrl);
    try {
      // Fetch image and convert to base64 for Gemini multimodal analysis
      const resp = await fetch(sample.previewUrl);
      const blob = await resp.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback
      setImageBase64(sample.previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageBase64(null);
    setImagePreview(null);
    setImageName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: JewelryBudgetInput = {
        total_budget: Number(totalBudget),
        occasion,
        preferences,
        image_base64: imageBase64 || undefined,
        image_name: imageName || undefined,
        currency,
      };

      const res = await generateJewelryBudget(payload);
      setResult(res);
      if (onPlanCreated) onPlanCreated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate jewelry recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getPlatformChipStyle = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('tanishq')) return 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100';
    if (p.includes('caratlane')) return 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100';
    if (p.includes('bluestone')) return 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100';
    if (p.includes('melorra')) return 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100';
    if (p.includes('meesho')) return 'bg-pink-50 text-pink-800 border-pink-300 hover:bg-pink-100';
    if (p.includes('amazon')) return 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';
    if (p.includes('flipkart')) return 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100';
    return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header (matching page 36) */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Jewelry Budget Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Get AI-powered jewelry recommendations within your budget for any occasion
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Form View (page 36) */}
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
                  className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Occasion & Preferences */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <Gem className="w-4 h-4 text-blue-600" />
              <span>Occasion & Preferences</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Occasion
                </label>
                <input
                  type="text"
                  required
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="Birthday, Wedding, Anniversary, Cocktail..."
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Style Preferences</span>
                </label>
                <textarea
                  rows={3}
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="Describe your style preferences, materials, colors, metal finishes..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Upload Outfit Image (matching page 36) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Upload Outfit Image</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Multimodal AI Vision</span>
            </div>

            {/* Quick Sample Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">Quick Test with Sample Outfits:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_OUTFITS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2 border border-slate-200 rounded-lg flex items-center gap-2.5 text-left hover:border-blue-500 hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <img
                      src={sample.previewUrl}
                      alt={sample.name}
                      className="w-10 h-10 rounded-md object-cover border border-slate-200"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600">
                        {sample.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{sample.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area / Image Preview (matching page 36) */}
            {imagePreview ? (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center space-y-3">
                <div className="relative max-w-sm rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-white">
                  <img
                    src={imagePreview}
                    alt="Uploaded Outfit"
                    className="max-h-64 w-auto object-contain mx-auto"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur-xs">
                    {imageName || 'Outfit Image'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-4 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50/20 transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-600 hover:underline">
                    Click to upload outfit photo
                  </span>
                  <span className="text-xs text-slate-500"> or drag and drop</span>
                </div>
                <p className="text-[11px] text-slate-400">PNG, JPG, or WebP up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Submit Button (matching page 36) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Outfit Colors & Matching Jewelry with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Get Recommendations</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Results View (matching page 37) */
        <div className="space-y-6 animate-fade-in print:m-0 print:p-0">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Your Personalized Jewelry Recommendations
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
                <span>Print/Save</span>
              </button>
            </div>
          </div>

          {/* Budget Summary Card (matching page 37) */}
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

          {/* Outfit Analysis (matching page 37) */}
          {result.outfit_analysis && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>Outfit Analysis</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Colors:</span>
                  <div className="flex items-center gap-1.5">
                    {result.outfit_analysis.colors.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-800 border border-slate-200"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
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
              {result.outfit_analysis.key_notes && (
                <p className="text-[11px] text-slate-500 italic pt-1">
                  Stylist Note: {result.outfit_analysis.key_notes}
                </p>
              )}
            </div>
          )}

          {/* Jewelry Recommendations (matching page 37) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-blue-600 text-white px-5 py-3 font-bold text-sm flex items-center gap-2">
              <Gem className="w-4 h-4 text-blue-200" />
              <span>Jewelry Recommendations</span>
            </div>

            <div className="p-5 divide-y divide-slate-100 space-y-6">
              {result.jewelry_recommendations.map((item, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <h4 className="font-bold text-sm text-slate-900 capitalize">
                          {item.item_type || item.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                        <span className="font-medium text-slate-700">Description: </span>
                        {item.description}
                      </p>
                      <div className="text-xs text-slate-500">
                        <span className="font-medium text-slate-700">Style: </span>
                        {item.style}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-3 py-1 rounded bg-blue-600 text-white font-bold text-xs inline-block shadow-xs">
                        {formatPrice(item.estimated_price)}
                      </span>
                    </div>
                  </div>

                  {/* Shopping Platform Links (matching page 37) */}
                  {item.shopping_links && Object.keys(item.shopping_links).length > 0 && (
                    <div className="mt-3">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                        Shop For This:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(item.shopping_links).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${getPlatformChipStyle(
                              platform
                            )}`}
                          >
                            <span>{platform}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Styling Tips (matching page 37) */}
          {result.styling_tips && result.styling_tips.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-blue-600 text-white px-5 py-3 font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Styling Tips</span>
              </div>
              <div className="p-5 space-y-3">
                {result.styling_tips.map((tip, idx) => (
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
