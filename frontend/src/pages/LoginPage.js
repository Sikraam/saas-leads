import { useState } from 'react';
import { login, register } from '../services/api';

function Logo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#3b82f6" />
      <path d="M24 8L34 21H29V34H19V21H14Z" fill="white" />
    </svg>
  );
}

export default function LoginPage({ onLogin }) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [name, setName]             = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [showPwd, setShowPwd]       = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        const res = await register({ email, password, name });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin(res.data.user);
      } else {
        const res = await login({ email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin(res.data.user);
      }
    } catch {
      setError(isRegister ? "Erreur lors de l'inscription" : 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    border: '1.5px solid #e2e8f0', borderRadius: 12,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    color: '#0f172a', background: '#f8fafc', transition: 'all 0.2s',
  };

  const features = [
    { label: 'Reponse en moins de 60s',   desc: "L'agent IA contacte chaque lead instantanement",   iconPath: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Qualification automatique', desc: 'GPT-4o qualifie et prend les rendez-vous',           iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2' },
    { label: 'Sync Google Calendar',      desc: 'RDV automatiquement crees dans votre agenda',        iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Dashboard en temps reel',   desc: 'Suivez vos leads et conversions live',               iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0f172a', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* LEFT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 72px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div style={{ position: 'absolute', top: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 56 }}>
          <Logo size={44} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>LeadFlow</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>AI Automation Platform</div>
          </div>
        </div>

        <h1 style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1.18, marginBottom: 16, letterSpacing: '-1px' }}>
          Automatisez vos leads<br />
          <span style={{ color: '#60a5fa' }}>WhatsApp & Facebook</span>
        </h1>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.65, maxWidth: 420, marginBottom: 48 }}>
          Capturez, qualifiez et convertissez vos leads automatiquement grace a l'intelligence artificielle.
        </p>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {features.map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8">
                  <path d={f.iconPath} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{f.label}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 48 }}>
          {['SSL securise', 'Maroc & MENA', '99.9% uptime'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6' }} />
              <span style={{ fontSize: 11, color: '#475569' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ width: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: '100%' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
            <div style={{ marginBottom: 28 }}>
              <Logo size={40} />
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', marginTop: 14, marginBottom: 4 }}>
                {isRegister ? 'Creer un compte' : 'Bon retour !'}
              </h2>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>
                {isRegister ? 'Rejoignez LeadFlow et automatisez vos leads' : 'Connectez-vous a votre espace LeadFlow'}
              </p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: 9, fontSize: 13, marginBottom: 20, border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {isRegister && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Nom complet</label>
                  <input type="text" value={name} required={isRegister} onChange={e => setName(e.target.value)} placeholder="Votre nom"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </div>
              )}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Email</label>
                <input type="email" value={email} required onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={password} required onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: 42 }}
                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
                    {showPwd
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#3b82f6',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s', marginTop: 4,
              }}
                onMouseEnter={e => { if (!loading) e.target.style.background = '#2563eb'; }}
                onMouseLeave={e => { if (!loading) e.target.style.background = '#3b82f6'; }}
              >
                {loading ? '...' : isRegister ? 'Creer mon compte' : 'Se connecter'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>
                {isRegister ? 'Deja un compte ? ' : 'Pas encore de compte ? '}
              </span>
              <span onClick={() => { setIsRegister(!isRegister); setError(''); }}
                style={{ fontSize: 13, color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>
                {isRegister ? 'Se connecter' : "S'inscrire"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}