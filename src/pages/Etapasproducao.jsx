import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plane } from 'lucide-react';

const etapaStatusMap = {
  concluida: { badge: 'badge-green', label: 'Concluída', cls: 'concluida' },
  em_andamento: { badge: 'badge-blue', label: 'Em Andamento', cls: 'em_andamento' },
  pendente: { badge: 'badge-gray', label: 'Pendente', cls: 'pendente' },
};

export default function EtapasProducao({ onViewAeronave }) {
  const { aeronaves } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const aeronavesFiltradas = aeronaves.filter(a =>
    a.modelo.toLowerCase().includes(search.toLowerCase()) ||
    a.matricula.toLowerCase().includes(search.toLowerCase())
  );

  // Flatten all etapas with aeronave info
  const allEtapas = aeronavesFiltradas.flatMap(a =>
    a.etapas
      .filter(e => filterStatus === 'all' || e.status === filterStatus)
      .map(e => ({ ...e, aeronave: a }))
  ).sort((a, b) => a.ordem - b.ordem);

  const totalConcluidas = allEtapas.filter(e => e.status === 'concluida').length;
  const totalAndamento = allEtapas.filter(e => e.status === 'em_andamento').length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Etapas de Produção</h1>
          <p className="page-subtitle">{totalConcluidas} concluídas · {totalAndamento} em andamento</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar aeronave..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <button className={`chip${filterStatus === 'all' ? ' active' : ''}`} onClick={() => setFilterStatus('all')}>Todas</button>
        <button className={`chip${filterStatus === 'em_andamento' ? ' active' : ''}`} onClick={() => setFilterStatus('em_andamento')}>Em Andamento</button>
        <button className={`chip${filterStatus === 'pendente' ? ' active' : ''}`} onClick={() => setFilterStatus('pendente')}>Pendentes</button>
        <button className={`chip${filterStatus === 'concluida' ? ' active' : ''}`} onClick={() => setFilterStatus('concluida')}>Concluídas</button>
      </div>

      {aeronavesFiltradas.length === 0 ? (
        <div className="empty-state"><p>Nenhuma aeronave encontrada.</p></div>
      ) : (
        aeronavesFiltradas.map(aeronave => {
          const etapas = aeronave.etapas
            .filter(e => filterStatus === 'all' || e.status === filterStatus)
            .sort((a, b) => a.ordem - b.ordem);

          if (etapas.length === 0) return null;

          return (
            <div key={aeronave.id} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: 'var(--lavender-200)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plane size={16} color="var(--navy-700)" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--navy-800)' }}>
                      {aeronave.modelo}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{aeronave.matricula} · {etapas.length} etapa(s)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="progress-bar" style={{ width: 100 }}>
                    <div className="progress-fill" style={{ width: `${aeronave.progresso}%` }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-700)' }}>{aeronave.progresso}%</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => onViewAeronave(aeronave.id)}>
                    Ver detalhes
                  </button>
                </div>
              </div>

              <div className="etapas-list">
                {etapas.map(e => {
                  const info = etapaStatusMap[e.status] || { badge: 'badge-gray', label: e.status, cls: 'pendente' };
                  return (
                    <div key={e.id} className="etapa-card">
                      <div className={`etapa-step ${info.cls}`}>{e.ordem}</div>
                      <div className="etapa-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div className="etapa-name">{e.nome}</div>
                            {e.descricao && <div className="etapa-desc">{e.descricao}</div>}
                            <div className="etapa-meta">
                              {e.responsavel && <span>👤 {e.responsavel}</span>}
                              {e.dataInicio && <span style={{ marginLeft: 12 }}>📅 {new Date(e.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
                              {e.dataFim && <span style={{ marginLeft: 12 }}>→ {new Date(e.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
                            </div>
                          </div>
                          <span className={`badge ${info.badge}`}>{info.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}