import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Aeronaves from './pages/Aeronaves';
import AeronaveDetalhe from './pages/Aeronavedetalhe';
import EtapasProducao from './pages/Etapasproducao';
import Funcionarios from './pages/Funcionarios';
import Relatorio from './pages/Relatorio';
import Pecas from './pages/Pecas';
import Testes from './pages/Testes';
import './style/index.css';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedAeronaveId, setSelectedAeronaveId] = useState(null);

  if (!currentUser) return <Login />;

  const handleViewDetail = (id) => {
    setSelectedAeronaveId(id);
    setCurrentPage('aeronave-detalhe');
  };

  const handleBack = () => {
    setSelectedAeronaveId(null);
    setCurrentPage('aeronaves');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':       return <Dashboard onNavigate={setCurrentPage} />;
      case 'aeronaves':       return <Aeronaves onViewDetail={handleViewDetail} />;
      case 'aeronave-detalhe':return <AeronaveDetalhe aeronaveId={selectedAeronaveId} onBack={handleBack} />;
      case 'etapas':          return <EtapasProducao onViewAeronave={handleViewDetail} />;
      case 'funcionarios':    return <Funcionarios />;
      case 'relatorio':       return <Relatorio />;
      case 'pecas':           return <Pecas />;
      case 'testes':          return <Testes />;
      default:                return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}