export function SettingsPage({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const integrations = [
    { name: 'Facebook Lead Ads', desc: 'Webhook configuré et actif', icon: '📘', status: 'connected',    color: '#3b82f6' },
    { name: 'WhatsApp Business', desc: 'Via Twilio — configuration requise', icon: '💬', status: 'pending', color: '#10b981' },
    { name: 'Google Calendar',   desc: 'Synchronisation des rendez-vous',    icon: '📅', status: 'pending', color: '#f59e0b' },
    { name: 'OpenAI GPT-4o',     desc: 'Agent conversationnel IA',           icon: '🤖', status: 'pending', color: '#8b5cf6' },
  ];

  const tabs = ['profile', 'integrations', 'notifications', 'security'];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Paramètres</h2>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>Gérez votre compte et vos intégrations</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, padding: 4, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            background: activeTab === t ? '#0f172a' : 'transparent',
            color: activeTab === t ? '#fff' : '#64748b',
            transition: 'all 0.15s', textTransform: 'capitalize',
          }}>
            {t === 'profile' ? 'Profil' : t === 'integrations' ? 'Intégrations' : t === 'notifications' ? 'Notifications' : 'Sécurité'}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Informations du compte</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', fontSize: 20, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{user?.email?.split('@')[0]?.slice(0, 2)?.toUpperCase()}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{user?.email?.split('@')[0]}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{user?.email}</div>
              <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, fontWeight: 600 }}>● Administrateur</div>
            </div>
          </div>
          {[
            { label: 'Nom complet',      placeholder: user?.email?.split('@')[0] || 'Votre nom', type: 'text' },
            { label: 'Email',            placeholder: user?.email || 'email@exemple.com',        type: 'email' },
            { label: 'Nom de l\'entreprise', placeholder: 'Test Company',                        type: 'text' },
            { label: 'Téléphone',        placeholder: '+212 6XX XXX XXX',                        type: 'tel' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10,
                fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a',
              }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          ))}
          <button onClick={handleSave} style={{
            marginTop: 8, padding: '10px 24px', borderRadius: 10, border: 'none',
            background: saved ? '#10b981' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s',
          }}>
            {saved ? '✓ Sauvegardé !' : 'Sauvegarder les modifications'}
          </button>
        </div>
      )}

      {/* INTEGRATIONS TAB */}
      {activeTab === 'integrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {integrations.map(int => (
            <div key={int.name} style={{ background: '#fff', borderRadius: 16, padding: '18px 22px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${int.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {int.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{int.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{int.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: int.status === 'connected' ? '#ecfdf5' : '#f8fafc',
                  color: int.status === 'connected' ? '#10b981' : '#94a3b8',
                  border: `1px solid ${int.status === 'connected' ? '#a7f3d0' : '#e2e8f0'}`,
                }}>
                  {int.status === 'connected' ? '● Connecté' : '○ Non configuré'}
                </span>
                <button style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer', background: '#fff', color: '#0f172a',
                }}>
                  {int.status === 'connected' ? 'Configurer' : 'Connecter'}
                </button>
              </div>
            </div>
          ))}
          <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))', borderRadius: 16, padding: '18px 22px', border: '1px solid rgba(99,102,241,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 600 }}>🔗 S4-S9 : WhatsApp + Google Calendar + OpenAI seront configurés dans les prochaines semaines</div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Préférences de notifications</h3>
          {[
            { label: 'Nouveau lead Facebook',         desc: 'Notifier à chaque nouveau lead reçu' },
            { label: 'Rendez-vous confirmé',           desc: 'Alerte quand un RDV est pris par l\'IA' },
            { label: 'Conversation terminée',          desc: 'Résumé après chaque conversation IA' },
            { label: 'Rapport hebdomadaire',           desc: 'Récapitulatif des performances chaque lundi' },
          ].map((n, i) => (
            <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{n.label}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{n.desc}</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={i < 2} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: i < 2 ? '#6366f1' : '#e2e8f0',
                  borderRadius: 12, transition: '0.3s',
                }}>
                  <span style={{
                    position: 'absolute', height: 18, width: 18, left: i < 2 ? 23 : 3, bottom: 3,
                    background: '#fff', borderRadius: '50%', transition: '0.3s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Sécurité du compte</h3>
          {[
            { label: 'Mot de passe actuel', placeholder: '••••••••', type: 'password' },
            { label: 'Nouveau mot de passe', placeholder: '••••••••', type: 'password' },
            { label: 'Confirmer le mot de passe', placeholder: '••••••••', type: 'password' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10,
                fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#f8fafc',
              }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          ))}
          <button onClick={handleSave} style={{
            marginTop: 8, padding: '10px 24px', borderRadius: 10, border: 'none',
            background: saved ? '#10b981' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            {saved ? '✓ Modifié !' : 'Changer le mot de passe'}
          </button>
        </div>
      )}
    </div>
  );
}
