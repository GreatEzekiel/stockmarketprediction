import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { HeroAuth } from './components/HeroAuth';
import { Navbar } from './components/Navbar';
import { OverviewTab } from './components/OverviewTab';
import { PredictTab } from './components/PredictTab';
import { TradeTab } from './components/TradeTab';
import { EquitiesTab } from './components/EquitiesTab';

const MainApp = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    return <HeroAuth />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'predict' && <PredictTab />}
        {activeTab === 'trade' && <TradeTab />}
        {activeTab === 'equities' && <EquitiesTab />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="bg-mesh">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
