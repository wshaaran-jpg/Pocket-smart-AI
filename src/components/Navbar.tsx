import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  PartyPopper,
  Sparkles,
  History,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Coins,
  Menu,
  X,
  WalletCards,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, isAuthenticated, logout, currency, setCurrency, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    ...(isAuthenticated
      ? [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
      : [{ id: 'home-landing', label: 'Overview', icon: LayoutDashboard }]),
    { id: 'home-planner', label: 'Home Planner', icon: Home },
    { id: 'party-planner', label: 'Party Planner', icon: PartyPopper },
    { id: 'jewelry-planner', label: 'Jewelry Planner', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#1e293b] text-white shadow-md sticky top-0 z-40 border-b border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'home-landing')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <WalletCards className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1">
                  PocketSmart<span className="text-blue-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-400/30">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">Smart Budget Assistant</span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-300" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                  currency === 'INR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Indian Rupee"
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                  currency === 'USD' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="US Dollar"
              >
                $ USD
              </button>
            </div>

            {/* Auth Button or User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-700">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-2 text-left cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold text-xs group-hover:border-blue-400">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block leading-tight">
                    <span className="text-xs font-medium text-slate-200 block capitalize">{user?.username}</span>
                    <span className="text-[10px] text-slate-400 block">Verified Planner</span>
                  </div>
                </button>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-xs shadow-blue-500/40 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              className="px-2 py-1 bg-slate-800 text-xs font-semibold rounded text-slate-200 border border-slate-700"
            >
              {currency === 'INR' ? '₹ INR' : '$ USD'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left cursor-pointer ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-slate-300">Signed in as <b className="text-white capitalize">{user?.username}</b></span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-slate-200 bg-slate-800 rounded-md"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold bg-blue-600 text-white rounded-md"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
