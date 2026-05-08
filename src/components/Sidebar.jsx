import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Plane, Users, ClipboardList,
  FileText, LogOut
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'aeronaves', label: 'Aeronaves', icon: Plane },
  { id: 'etapas', label: 'Etapas de Produção', icon: ClipboardList },
  { id: 'relatorio', label: 'Relatórios', icon: FileText },
];

const adminItems = [
  { id: 'funcionarios', label: 'Funcionários', icon: Users },
];

export default function Sidebar({ currentPage, onNavigate }) {
  const { currentUser, logout, canSeeEmployees } = useAuth();

  const initials = currentUser?.nome
    ? currentUser.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const roleLabel = {
    admin: 'Administrador',
    engenheiro: 'Engenheiro',
    operador: 'Operador',
  }[currentUser?.role] || '';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Plane size={20} color="#1E2749" />
        </div>
        <div>
          <div className="sidebar-logo-text">Aerocode</div>
          <div className="sidebar-logo-sub">Gestão Aeronáutica</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Principal</div>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item${currentPage === item.id ? ' active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}

        {canSeeEmployees && (
          <>
            <div className="nav-section-label">Administração</div>
            {adminItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item${currentPage === item.id ? ' active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{currentUser?.nome}</div>
            <div className="user-role">{roleLabel}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sair">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}