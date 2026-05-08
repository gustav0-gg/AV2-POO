import React, { createContext, useContext, useState } from 'react';
import { aeronavesMock, funcionariosIniciais } from './data/mockdata';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [aeronaves, setAeronaves] = useState(aeronavesMock);
  const [funcionarios, setFuncionarios] = useState(funcionariosIniciais);

  // ─── Aeronaves ────────────────────────────────────────────────────────────
  const addAeronave = (data) => {
    const nova = { ...data, id: Date.now(), pecas: [], testes: [], etapas: [], progresso: 0 };
    setAeronaves(prev => [...prev, nova]);
    return nova;
  };

  const updateAeronave = (id, data) => {
    setAeronaves(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteAeronave = (id) => {
    setAeronaves(prev => prev.filter(a => a.id !== id));
  };

  // ─── Peças ────────────────────────────────────────────────────────────────
  const addPeca = (aeronaveId, peca) => {
    setAeronaves(prev => prev.map(a =>
      a.id === aeronaveId
        ? { ...a, pecas: [...a.pecas, { ...peca, id: Date.now() }] }
        : a
    ));
  };

  const updatePeca = (aeronaveId, pecaId, data) => {
    setAeronaves(prev => prev.map(a =>
      a.id === aeronaveId
        ? { ...a, pecas: a.pecas.map(p => p.id === pecaId ? { ...p, ...data } : p) }
        : a
    ));
  };

  const deletePeca = (aeronaveId, pecaId) => {
    setAeronaves(prev => prev.map(a =>
      a.id === aeronaveId
        ? { ...a, pecas: a.pecas.filter(p => p.id !== pecaId) }
        : a
    ));
  };

  // ─── Testes ───────────────────────────────────────────────────────────────
  const addTeste = (aeronaveId, teste) => {
    setAeronaves(prev => prev.map(a =>
      a.id === aeronaveId
        ? { ...a, testes: [...a.testes, { ...teste, id: Date.now() }] }
        : a
    ));
  };

  const updateTeste = (aeronaveId, testeId, data) => {
    setAeronaves(prev => prev.map(a =>
      a.id === aeronaveId
        ? { ...a, testes: a.testes.map(t => t.id === testeId ? { ...t, ...data } : t) }
        : a
    ));
  };

  const deleteTeste = (aeronaveId, testeId) => {
    setAeronaves(prev => prev.map(a =>
      a.id === aeronaveId
        ? { ...a, testes: a.testes.filter(t => t.id !== testeId) }
        : a
    ));
  };

  // ─── Etapas ───────────────────────────────────────────────────────────────
  const addEtapa = (aeronaveId, etapa) => {
    setAeronaves(prev => prev.map(a =>
      a.id === aeronaveId
        ? { ...a, etapas: [...a.etapas, { ...etapa, id: Date.now() }] }
        : a
    ));
  };

  const updateEtapa = (aeronaveId, etapaId, data) => {
    setAeronaves(prev => prev.map(a =>
      a.id === aeronaveId
        ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? { ...e, ...data } : e) }
        : a
    ));
  };

  const deleteEtapa = (aeronaveId, etapaId) => {
    setAeronaves(prev => prev.map(a =>
      a.id === aeronaveId
        ? { ...a, etapas: a.etapas.filter(e => e.id !== etapaId) }
        : a
    ));
  };

  // ─── Funcionários ─────────────────────────────────────────────────────────
  const addFuncionario = (data) => {
    setFuncionarios(prev => [...prev, { ...data, id: Date.now(), status: 'ativo' }]);
  };

  const updateFuncionario = (id, data) => {
    setFuncionarios(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };

  const deleteFuncionario = (id) => {
    setFuncionarios(prev => prev.filter(f => f.id !== id));
  };

  return (
    <AppContext.Provider value={{
      aeronaves, addAeronave, updateAeronave, deleteAeronave,
      addPeca, updatePeca, deletePeca,
      addTeste, updateTeste, deleteTeste,
      addEtapa, updateEtapa, deleteEtapa,
      funcionarios, addFuncionario, updateFuncionario, deleteFuncionario,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);