import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Printer } from 'lucide-react';

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

const pecaStatusLabel = { aprovado: 'Aprovado', em_teste: 'Em Teste', pendente: 'Pendente', reprovado: 'Reprovado' };
const testeResLabel = { aprovado: 'Aprovado', reprovado: 'Reprovado', pendente: 'Pendente' };

export default function Relatorio() {
  const { aeronaves, funcionarios } = useApp();
  const [filterAeronave, setFilterAeronave] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [incluirPecas, setIncluirPecas] = useState(true);
  const [incluirTestes, setIncluirTestes] = useState(true);
  const [incluirEtapas, setIncluirEtapas] = useState(true);

  const aeronavesFiltradas = aeronaves.filter(a => {
    if (filterAeronave !== 'all' && a.id !== parseInt(filterAeronave)) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const totalPecas = aeronavesFiltradas.reduce((s, a) => s + a.pecas.length, 0);
  const totalTestes = aeronavesFiltradas.reduce((s, a) => s + a.testes.length, 0);
  const testesAprovados = aeronavesFiltradas.reduce((s, a) => s + a.testes.filter(t => t.resultado === 'aprovado').length, 0);
  const testesReprovados = aeronavesFiltradas.reduce((s, a) => s + a.testes.filter(t => t.resultado === 'reprovado').length, 0);

  const handlePrint = () => window.print();

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Geração de Relatório</h1>
          <p className="page-subtitle">Configure e exporte o relatório de produção</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={handlePrint}>
            <Printer size={16} /> Imprimir
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Filtros */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            Filtros do Relatório
          </h2>

          <div className="form-group">
            <label className="form-label">Aeronave</label>
            <select className="form-select" value={filterAeronave} onChange={e => setFilterAeronave(e.target.value)}>
              <option value="all">Todas as aeronaves</option>
              {aeronaves.map(a => <option key={a.id} value={a.id}>{a.modelo} — {a.matricula}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status da Aeronave</label>
            <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">Todos os status</option>
              <option value="em_producao">Em Produção</option>
              <option value="concluida">Concluída</option>
              <option value="aguardando">Aguardando</option>
            </select>
          </div>

          <hr className="divider" />

          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--navy-800)' }}>
            Incluir no Relatório
          </div>

          {[
            { label: 'Peças e Componentes', state: incluirPecas, set: setIncluirPecas },
            { label: 'Testes Realizados', state: incluirTestes, set: setIncluirTestes },
            { label: 'Etapas de Produção', state: incluirEtapas, set: setIncluirEtapas },
          ].map(({ label, state, set }) => (
            <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 10, fontSize: 14, color: 'var(--gray-800)' }}>
              <input type="checkbox" checked={state} onChange={e => set(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--navy-700)' }} />
              {label}
            </label>
          ))}
        </div>

        {/* Resumo */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            Resumo do Relatório
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Aeronaves', value: aeronavesFiltradas.length },
              { label: 'Total de Peças', value: totalPecas },
              { label: 'Total de Testes', value: totalTestes },
              { label: 'Testes Aprovados', value: testesAprovados },
              { label: 'Testes Reprovados', value: testesReprovados },
              { label: 'Funcionários', value: funcionarios.length },
            ].map(({ label, value }) => (
              <div key={label} className="card-sm" style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--navy-800)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="card" id="report-preview">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <FileText size={20} color="var(--navy-700)" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--navy-800)' }}>
            Relatório de Produção Aeronáutica
          </h2>
        </div>
        <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 24 }}>
          Gerado em: {new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}
        </div>

        {aeronavesFiltradas.length === 0 ? (
          <div className="empty-state"><p>Nenhuma aeronave corresponde aos filtros selecionados.</p></div>
        ) : aeronavesFiltradas.map(aeronave => (
          <div key={aeronave.id} className="report-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--navy-800)' }}>
                    {aeronave.modelo}
                  </h3>
                  <span className={`badge ${statusBadge[aeronave.status] || 'badge-gray'}`}>
                    {statusLabel[aeronave.status]}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
                  Matrícula: {aeronave.matricula} · Fabricante: {aeronave.fabricante} · Ano: {aeronave.anoFabricacao}
                  {aeronave.responsavel && ` · Responsável: ${aeronave.responsavel}`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--navy-800)' }}>{aeronave.progresso}%</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Progresso</div>
              </div>
            </div>

            {/* Peças */}
            {incluirPecas && aeronave.pecas.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="report-section-title" style={{ fontSize: 13 }}>Peças ({aeronave.pecas.length})</div>
                <table style={{ fontSize: 13 }}>
                  <thead>
                    <tr><th>Nome</th><th>Nº</th><th>Qtd</th><th>Fornecedor</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {aeronave.pecas.map(p => (
                      <tr key={p.id}>
                        <td>{p.nome}</td>
                        <td style={{ fontFamily: 'monospace' }}>{p.numero}</td>
                        <td>{p.quantidade}</td>
                        <td>{p.fornecedor || '—'}</td>
                        <td>{pecaStatusLabel[p.status] || p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Testes */}
            {incluirTestes && aeronave.testes.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="report-section-title" style={{ fontSize: 13 }}>Testes ({aeronave.testes.length})</div>
                <table style={{ fontSize: 13 }}>
                  <thead>
                    <tr><th>Nome</th><th>Tipo</th><th>Resultado</th><th>Data</th><th>Responsável</th></tr>
                  </thead>
                  <tbody>
                    {aeronave.testes.map(t => (
                      <tr key={t.id}>
                        <td>{t.nome}</td>
                        <td style={{ textTransform: 'capitalize' }}>{t.tipo}</td>
                        <td>{testeResLabel[t.resultado]}</td>
                        <td>{t.dataRealizacao ? new Date(t.dataRealizacao + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                        <td>{t.responsavel || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Etapas */}
            {incluirEtapas && aeronave.etapas.length > 0 && (
              <div>
                <div className="report-section-title" style={{ fontSize: 13 }}>Etapas de Produção</div>
                <table style={{ fontSize: 13 }}>
                  <thead>
                    <tr><th>#</th><th>Nome</th><th>Status</th><th>Início</th><th>Conclusão</th><th>Responsável</th></tr>
                  </thead>
                  <tbody>
                    {[...aeronave.etapas].sort((a, b) => a.ordem - b.ordem).map(e => (
                      <tr key={e.id}>
                        <td>{e.ordem}</td>
                        <td>{e.nome}</td>
                        <td>{e.status === 'concluida' ? 'Concluída' : e.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}</td>
                        <td>{e.dataInicio ? new Date(e.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                        <td>{e.dataFim ? new Date(e.dataFim + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                        <td>{e.responsavel || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <hr className="divider" />
          </div>
        ))}
      </div>
    </div>
  );
}