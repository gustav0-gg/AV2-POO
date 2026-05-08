import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Plane, Users, Package, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

const statusLabel = {
  em_producao: 'Em Produção',
  concluida: 'Concluída',
  aguardando: 'Aguardando',
};

const statusBadge = {
  em_producao: 'badge-blue',
  concluida: 'badge-green',
  aguardando: 'badge-amber',
};

export default function Dashboard({ onNavigate }) {
  const { aeronaves, funcionarios } = useApp();
  const { currentUser } = useAuth();

  const emProducao = aeronaves.filter(a => a.status === 'em_producao').length;
  const concluidas = aeronaves.filter(a => a.status === 'concluida').length;
  const aguardando = aeronaves.filter(a => a.status === 'aguardando').length;
  const totalPecas = aeronaves.reduce((s, a) => s + a.pecas.length, 0);

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">{saudacao}, {currentUser?.nome?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Aqui está o resumo das operações de hoje.</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Total de Aeronaves" value={aeronaves.length} icon={Plane} color="var(--navy-700)" bg="var(--lavender-200)" />
        <StatCard label="Em Produção" value={emProducao} icon={TrendingUp} color="var(--blue-900)" bg="var(--blue-100)" />
        <StatCard label="Concluídas" value={concluidas} icon={CheckCircle} color="var(--green-900)" bg="var(--green-100)" />
        <StatCard label="Peças Cadastradas" value={totalPecas} icon={Package} color="var(--amber-900)" bg="var(--amber-100)" />
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Aeronaves recentes */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Aeronaves Recentes</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('aeronaves')}>Ver todas</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Modelo</th>
                  <th>Matrícula</th>
                  <th>Status</th>
                  <th>Progresso</th>
                </tr>
              </thead>
              <tbody>
                {aeronaves.slice(0, 5).map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.modelo}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{a.matricula}</td>
                    <td>
                      <span className={`badge ${statusBadge[a.status] || 'badge-gray'}`}>
                        {statusLabel[a.status] || a.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${a.progresso}%` }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.progresso}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status resumo */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Situação Geral</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="stat-icon" style={{ background: 'var(--blue-100)', width: 36, height: 36, borderRadius: 10 }}>
                <Clock size={18} color="var(--blue-900)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>Aguardando Início</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{aguardando} aeronave(s)</div>
              </div>
            </div>

            <div className="card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="stat-icon" style={{ background: 'var(--amber-100)', width: 36, height: 36, borderRadius: 10 }}>
                <AlertTriangle size={18} color="var(--amber-900)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>Testes Reprovados</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                  {aeronaves.reduce((s, a) => s + a.testes.filter(t => t.resultado === 'reprovado').length, 0)} teste(s) pendentes
                </div>
              </div>
            </div>

            <div className="card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="stat-icon" style={{ background: 'var(--green-100)', width: 36, height: 36, borderRadius: 10 }}>
                <Users size={18} color="var(--green-900)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>Funcionários Ativos</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                  {funcionarios.filter(f => f.status === 'ativo').length} de {funcionarios.length} funcionários
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}