import { useState } from 'react';
import { login } from '../services/api';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login({ email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            onLogin(res.data.user);
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(135deg, #1a1d2e 0%, #2d3561 50%, #1a1d2e 100%)',
        }}>
            {/* Left side */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '60px',
                color: 'white',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                    <div style={{
                        width: '44px', height: '44px', background: '#6366f1',
                        borderRadius: '12px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '22px',
                    }}>🚀</div>
                    <span style={{ fontSize: '22px', fontWeight: '700' }}>SaaS Leads</span>
                </div>
                <h1 style={{ fontSize: '42px', fontWeight: '700', lineHeight: 1.2, marginBottom: '20px' }}>
                    Automatisez vos leads<br />
                    <span style={{ color: '#818cf8' }}>WhatsApp & Facebook</span>
                </h1>
                <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '400px' }}>
                    Capturez, qualifiez et convertissez vos leads automatiquement grâce à l'IA.
                </p>
                <div style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
                    {[
                        { icon: '⚡', label: 'Réponse en 60s' },
                        { icon: '🤖', label: 'Agent IA' },
                        { icon: '📅', label: 'Auto RDV' },
                    ].map(f => (
                        <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>{f.icon}</span>
                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{f.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side - Login form */}
            <div style={{
                width: '460px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '40px',
                background: 'rgba(255,255,255,0.03)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}>
                <div style={{
                    background: 'white', borderRadius: '20px',
                    padding: '40px', width: '100%',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1d2e', marginBottom: '6px' }}>
                        Connexion
                    </h2>
                    <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '28px' }}>
                        Accédez à votre dashboard
                    </p>

                    {error && (
                        <div style={{
                            background: '#fee2e2', color: '#dc2626', padding: '12px 14px',
                            borderRadius: '10px', fontSize: '13px', marginBottom: '20px',
                            border: '1px solid #fecaca',
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                                Email
                            </label>
                            <input
                                type="email" value={email} required
                                onChange={e => setEmail(e.target.value)}
                                placeholder="vous@exemple.com"
                                style={{
                                    width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                                    borderRadius: '10px', fontSize: '14px', outline: 'none',
                                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                                Mot de passe
                            </label>
                            <input
                                type="password" value={password} required
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
                                    borderRadius: '10px', fontSize: '14px', outline: 'none',
                                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '13px', background: loading ? '#a5b4fc' : '#6366f1',
                            color: 'white', border: 'none', borderRadius: '10px',
                            fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                        }}>
                            {loading ? 'Connexion...' : 'Se connecter →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '20px' }}>
                        Pas encore de compte ?{' '}
                        <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: '600' }}>
                            Contactez-nous
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}