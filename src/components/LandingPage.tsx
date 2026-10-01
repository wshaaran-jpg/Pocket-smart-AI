import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, PartyPopper, Sparkles, ArrowRight, CheckCircle2, Star, ShieldCheck, Zap, TrendingDown } from 'lucide-react';

interface LandingPageProps {
  onSelectPlanner: (planner: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectPlanner }) => {
  const { openAuthModal } = useAuth();

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1e293b] via-[#1e3a8a]/90 to-[#0f172a] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 text-center shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            GenAI Powered Cross-Platform Budgeting
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            PocketSmart
            <span className="block mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-200 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              AI-Powered Budget Planning for Everyday Needs
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Make smarter financial decisions with personalized budget recommendations for home interiors, parties, and jewelry purchases. Our AI helps you get the most value for your money.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onSelectPlanner('home-planner')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('planners-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-600/60 transition-colors cursor-pointer text-sm"
            >
              Learn More
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-10 grid grid-cols-3 max-w-xl mx-auto border-t border-slate-700/60 text-center gap-4 text-slate-300">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">30% Avg</div>
              <div className="text-xs text-slate-400">Budget Savings</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">8+ Stores</div>
              <div className="text-xs text-slate-400">Amazon, IKEA, Zomato</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">Multimodal</div>
              <div className="text-xs text-slate-400">Outfit Image Vision</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Smart Budget Planners Section */}
      <section id="planners-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Smart Budget Planners
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Discover how PocketSmart helps you make better financial decisions across different areas of your life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Home Interior */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-blue-500/20">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Home Interior Budget Planner</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Get personalized recommendations for furniture, lighting, and decor that fit your style preferences and budget constraints. Our AI helps you create a beautiful space without overspending.
              </p>
              <div className="space-y-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Room-by-room lighting & fan allocation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Direct links to IKEA, Amazon & Flipkart</span>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectPlanner('home-planner')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer text-center block"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Card 2: Party Planner */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-indigo-500/20">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Party Budget Planner</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Plan your perfect event with smart budget allocations for venue, catering, decorations, and entertainment. Our AI suggests the best ways to create memorable events while staying within your budget.
              </p>
              <div className="space-y-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Guest count based meal & snack combos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Links to Swiggy, Zomato, OYO & MakeMyTrip</span>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectPlanner('party-planner')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer text-center block"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Card 3: Jewelry Planner */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-sky-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-sky-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Jewelry Budget Planner</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Find the ideal jewelry pieces for any occasion that match your outfit and budget. Our AI recommends options based on your style preferences, occasion, and available budget.
              </p>
              <div className="space-y-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Multimodal AI analyzes uploaded outfit photo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Links to Tanishq, CaratLane, BlueStone & Melorra</span>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectPlanner('jewelry-planner')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer text-center block"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What Our Users Say
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Real experiences from people who have transformed their financial planning with PocketSmart
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
              "PocketSmart helped me furnish my new apartment without breaking the bank. The recommendations were spot on and I saved nearly 30% of my original budget!"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                SK
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Sarah K.</div>
                <div className="text-[11px] text-slate-500">Home Owner</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
              "Planning my daughter's birthday party was so much easier with PocketSmart's budget breakdown. The AI suggestions for affordable decorations and catering options were fantastic."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                MR
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Michael R.</div>
                <div className="text-[11px] text-slate-500">Parent</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
              "The jewelry recommendations perfectly matched my outfit for the wedding. Saved me hours of searching and I received so many compliments on my accessories!"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                PM
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Priya M.</div>
                <div className="text-[11px] text-slate-500">Fashion Enthusiast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Optimize CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Optimize Your Budget?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Join PocketSmart today and start making smarter financial decisions across all areas of your life.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-2.5 bg-white text-blue-900 hover:bg-slate-100 font-semibold rounded-lg text-sm transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm shadow-md transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
