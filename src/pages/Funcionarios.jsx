import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, ConfirmDialog } from '../components/Modal';
import { Plus, Search, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';

function FuncionarioModal({ func, onClose, onSave }) {
  const isEdit = !!func?.id;
  const [form, setForm] = useState({
    nome: func?.nome || '',
    email: func?.email || '',
    cargo: func?.cargo || '',
    departamento: func?.departamento || '',
    status: func?.status || 'ativo',
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Informe o nome.';
    if (!form.email.trim()) e.email = 'Informe o e-mail.';
    if (!form.cargo.trim()) e.cargo = 'Informe o cargo.';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <Modal
      title={isEdit ? 'Editar Funcionário' : 'Cadastrar Funcionário'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{isEdit ? 'Salvar' : 'Cadastrar'}</button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Nome Completo *</label>
        <input className={`form-input${errors.nome ? ' input-error' : ''}`} value={form.nome}
          onChange={e => set('nome', e.target.value)} placeholder="Nome do funcionário" />
        {errors.nome && <span className="form-error">{errors.nome}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">E-mail *</label>
        <input className={`form-input${errors.email ? ' input-error' : ''}`} type="email" value={form.email}
          onChange={e => set('email', e.target.value)} placeholder="email@empresa.com" />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Cargo *</label>
          <input className={`form-input${errors.cargo ? ' input-error' : ''}`} value={form.cargo}
            onChange={e => set('cargo', e.target.value)} placeholder="Ex: Engenheiro Aeronáutico" />
          {errors.cargo && <span className="form-error">{errors.cargo}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Departamento</label>
          <input className="form-input" value={form.departamento}
            onChange={e => set('departamento', e.target.value)} placeholder="Ex: Engenharia" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>
    </Modal>
  );
}

export default function Funcionarios() {
  const { funcionarios, addFuncionario, updateFuncionario, deleteFuncionario } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const filtered = funcionarios.filter(f => {
    const matchSearch = f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.cargo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || f.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = (data) => {
    if (editItem?.id) updateFuncionario(editItem.id, data);
    else addFuncionario(data);
    setModalOpen(false);
    setEditItem(null);
  };

  const openEdit = (f) => { setEditItem(f); setModalOpen(true); };
  const openNew = () => { setEditItem(null); setModalOpen(true); };

  const ativos = funcionarios.filter(f => f.status === 'ativo').length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Funcionários</h1>
          <p className="page-subtitle">{ativos} ativo(s) de {funcionarios.length} total</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Novo Funcionário
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar funcionário..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <button className={`chip${filterStatus === 'all' ? ' active' : ''}`} onClick={() => setFilterStatus('all')}>Todos</button>
        <button className={`chip${filterStatus === 'ativo' ? ' active' : ''}`} onClick={() => setFilterStatus('ativo')}>Ativos</button>
        <button className={`chip${filterStatus === 'inativo' ? ' active' : ''}`} onClick={() => setFilterStatus('inativo')}>Inativos</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>
                    Nenhum funcionário encontrado.
                  </td>
                </tr>
              ) : filtered.map(f => (
                <tr key={f.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34,
                        background: 'var(--lavender-200)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                        color: 'var(--navy-700)', flexShrink: 0,
                      }}>
                        {f.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{f.nome}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{f.email}</td>
                  <td>{f.cargo}</td>
                  <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{f.departamento || '—'}</td>
                  <td>
                    <span className={`badge ${f.status === 'ativo' ? 'badge-green' : 'badge-gray'}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {f.status === 'ativo' ? <UserCheck size={12} /> : <UserX size={12} />}
                      {f.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" title="Editar" onClick={() => openEdit(f)}><Pencil size={15} /></button>
                      <button className="btn-icon danger" title="Excluir" onClick={() => setDeleteItem(f)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <FuncionarioModal
          func={editItem}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}

      {deleteItem && (
        <ConfirmDialog
          title="Excluir Funcionário"
          message={`Tem certeza que deseja excluir "${deleteItem.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={() => { deleteFuncionario(deleteItem.id); setDeleteItem(null); }}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}