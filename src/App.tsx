import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { HomePlanner } from './components/HomePlanner';
import { PartyPlanner } from './components/PartyPlanner';
import { JewelryPlanner } from './components/JewelryPlanner';
import { HistoryPage } from './components/HistoryPage';
import { DetailModal } from './components/DetailModal';
import { AuthModal } from './components/AuthModal';
import { HistoryItem } from './types';

function MainContent() {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>(() => {
    // If authenticated (e.g. default demo user 'sai'), open dashboard, otherwise landing
    return 'dashboard';
  });

  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const handleSelectPlanner = (planner: string) => {
    setCurrentTab(planner);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1">
        {currentTab === 'home-landing' && (
          <LandingPage onSelectPlanner={handleSelectPlanner} />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            onSelectPlanner={handleSelectPlanner}
            onViewHistoryItem={handleViewDetails}
          />
        )}

        {currentTab === 'home-planner' && (
          <HomePlanner onPlanCreated={() => {}} />
        )}

        {currentTab === 'party-planner' && (
          <PartyPlanner onPlanCreated={() => {}} />
        )}

        {currentTab === 'jewelry-planner' && (
          <JewelryPlanner onPlanCreated={() => {}} />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            onViewDetails={handleViewDetails}
            onNavigateToPlanner={handleSelectPlanner}
          />
        )}
      </main>

      <Footer onNavigate={handleSelectPlanner} />

      {/* Full Detail Modal */}
      <DetailModal
        item={selectedHistoryItem}
        onClose={() => setSelectedHistoryItem(null)}
      />

      {/* Login & Register Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
