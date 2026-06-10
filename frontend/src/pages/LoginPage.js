import { useState } from 'react';
import { login, register } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
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

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#0d1117',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* LEFT PANEL */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -100, left: -100,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64, position: 'relative' }}>
          <div style={{
            width: 46, height: 46,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            borderRadius: 14, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22,
            boxShadow: '0 0 24px rgba(99,102,241,0.5)',
          }}>⚡</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>LeadFlow</div>
            <div style={{ fontSize: 11, color: '#4b5563', marginTop: 1 }}>AI Automation Platform</div>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px' }}>
          Automatisez vos leads<br />
          <span style={{
            background: 'linear-gradient(90deg,#818cf8,#c084fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            WhatsApp & Facebook
          </span>
        </h1>
        <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.7, maxWidth: 440, marginBottom: 56 }}>
          Capturez, qualifiez et convertissez vos leads automatiquement grâce à l'intelligence artificielle.
        </p>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            { icon: '⚡', title: 'Réponse en moins de 60s', desc: 'Agent IA contacte chaque lead instantanément' },
            { icon: '🤖', title: 'Qualification automatique', desc: 'GPT-4o qualifie et prend les rendez-vous' },
            { icon: '📅', title: 'Sync Google Calendar', desc: 'RDV automatiquement créés dans votre agenda' },
            { icon: '📊', title: 'Dashboard en temps réel', desc: 'Suivez vos leads et conversions live' },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: 520, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 52px',
        background: 'rgba(255,255,255,0.02)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ width: '100%' }}>
          <div style={{
            background: '#fff', borderRadius: 28, padding: '44px 40px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 16,
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}>⚡</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
                {isRegister ? 'Créer un compte' : 'Bon retour !'}
              </h2>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>
                {isRegister ? 'Rejoignez LeadFlow et automatisez vos leads' : 'Connectez-vous à votre espace LeadFlow'}
              </p>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2', color: '#dc2626', padding: '12px 16px',
                borderRadius: 12, fontSize: 13, marginBottom: 24,
                border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {isRegister && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Nom complet
                  </label>
                  <input
                    type="text" value={name} required={isRegister}
                    onChange={e => setName(e.target.value)}
                    placeholder="Votre nom complet"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Email
                </label>
                <input
                  type="email" value={email} required
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Mot de passe
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'} value={password} required
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}>
                    {showPwd
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', border: 'none', borderRadius: 14,
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', marginTop: 8,
                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
              }}
                onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 24px rgba(99,102,241,0.5)'; }}}
                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}
              >
                {loading ? '...' : isRegister ? 'Créer mon compte →' : 'Se connecter →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>
                {isRegister ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
              </span>
              <span
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                style={{ fontSize: 13, color: '#6366f1', cursor: 'pointer', fontWeight: 700 }}
              >
                {isRegister ? 'Se connecter' : "S'inscrire"}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
            {['🔒 Sécurisé SSL', '🇲🇦 Maroc & MENA', '⚡ 99.9% uptime'].map(t => (
              <span key={t} style={{ fontSize: 11, color: '#374151' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}