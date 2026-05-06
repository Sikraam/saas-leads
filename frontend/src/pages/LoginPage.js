import { useState } from 'react';
import { login } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#0d1117',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* background glow */}
        <div style={{
          position: 'absolute', top: -100, left: -100,
          width: 500, height: 500, borderRadius: '50%',
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
            width: 42, height: 42,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            borderRadius: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20,
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}>⚡</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>LeadFlow</div>
            <div style={{ fontSize: 10, color: '#4b5563', marginTop: 1 }}>AI Automation Platform</div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px' }}>
            Automatisez vos leads<br />
            <span style={{
              background: 'linear-gradient(90deg,#818cf8,#c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              WhatsApp & Facebook
            </span>
          </h1>
          <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, maxWidth: 420, marginBottom: 52 }}>
            Capturez, qualifiez et convertissez vos leads automatiquement grâce à l'intelligence artificielle.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '⚡', title: 'Réponse en moins de 60s',  desc: 'Agent IA contacte chaque lead instantanément' },
              { icon: '🤖', title: 'Qualification automatique', desc: 'GPT-4o qualifie et prend les rendez-vous' },
              { icon: '📅', title: 'Sync Google Calendar',     desc: 'RDV automatiquement créés dans votre agenda' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: '#4b5563', marginTop: 1 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        width: 480, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 48px',
        background: 'rgba(255,255,255,0.02)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ width: '100%' }}>
          {/* Card */}
          <div style={{
            background: '#fff', borderRadius: 24, padding: '40px 36px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
                Connexion
              </h2>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                Accédez à votre tableau de bord
              </p>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2', color: '#dc2626', padding: '11px 14px',
                borderRadius: 10, fontSize: 13, marginBottom: 20,
                border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Email
                </label>
                <input
                  type="email" value={email} required
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1.5px solid #e2e8f0', borderRadius: 10,
                    fontSize: 14, outline: 'none', boxSizing: 'border-box',
                    color: '#0f172a', transition: 'border-color 0.2s',
                    background: '#f8fafc',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Mot de passe
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'} value={password} required
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '11px 42px 11px 14px',
                      border: '1.5px solid #e2e8f0', borderRadius: 10,
                      fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      color: '#0f172a', transition: 'border-color 0.2s',
                      background: '#f8fafc',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}>
                    {showPwd
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', letterSpacing: '-0.2px',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(99,102,241,0.4)',
              }}
                onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.target.style.transform = 'none'; }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Connexion…
                  </span>
                ) : 'Se connecter →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Pas encore de compte ? </span>
              <span style={{ fontSize: 12, color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>Contactez-nous</span>
            </div>
          </div>

          {/* Trust badge */}
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