import React, { useState } from 'react';
import { AuthProvider, ToastProvider, useAuth } from './lib.jsx';
import HeroAuth from './components/HeroAuth';
import Navbar from './components/Navbar';
import OverviewTab from './components/OverviewTab';
import PredictTab from './components/PredictTab';
import TradeTab from './components/TradeTab';
import EquitiesTab from './components/EquitiesTab';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) return <HeroAuth />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flex: 1, padding: '24px 20px', maxWidth: 1440, width: '100%', margin: '0 auto' }}>
        {activeTab === 'overview'  && <OverviewTab />}
        {activeTab === 'predict'   && <PredictTab />}
        {activeTab === 'trade'     && <TradeTab />}
        {activeTab === 'equities'  && <EquitiesTab />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        {/* Background orbs */}
        <div className="bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
