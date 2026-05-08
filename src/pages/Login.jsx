import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, Plane } from 'lucide-react';

export default function Login() {
  const { login, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    login(email, senha);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow" />

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Plane size={28} color="#C4B5FD" />
          </div>
          <h1 className="login-title">AeroDash</h1>
          <p className="login-sub">Sistema de Gestão Aeronáutica</p>
        </div>

        <form onSubmit={handleSubmit}>
          {loginError && (
            <div className="alert-error">
              <AlertCircle size={16} />
              {loginError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                className={`form-input ${loginError ? 'input-error' : ''}`}
                style={{ paddingLeft: 38 }}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                className={`form-input ${loginError ? 'input-error' : ''}`}
                style={{ paddingLeft: 38 }}
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, height: 44 }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-hint">
          <strong>Contas de teste:</strong><br />
          Admin: admin@aerotech.com / 1234<br />
          Engenheiro: engenheiro@aerotech.com / 1234<br />
          Operador: operador@aerotech.com / 1234
        </div>
      </div>
    </div>
  );
}