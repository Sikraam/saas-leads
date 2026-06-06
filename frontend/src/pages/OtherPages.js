import { useState, useEffect } from 'react';
import API from '../services/api';
// ─────────────────────────────────────────────────────────────────────────────
// ConversationsPage.jsx
// ─────────────────────────────────────────────────────────────────────────────


export function ConversationsPage() {
  const [selected, setSelected] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/conversations')
      .then(res => {
        setConversations(res.data);
        if (res.data.length > 0) setSelected(res.data[0]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    API.get(`/conversations/${selected.id}/messages`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, [selected]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: '#f0f2f7', gap: 0 }}>
      <div style={{ width: 320, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Conversations</h2>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{conversations.filter(c => c.status === 'active').length} actives</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>Chargement...</div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              <div style={{ fontSize: 13 }}>Aucune conversation</div>
            </div>
          ) : conversations.map(c => (
            <div key={c.id} onClick={() => setSelected(c)} style={{
              padding: '14px 18px', cursor: 'pointer', borderBottom: '1px solid #f8fafc',
              background: selected?.id === c.id ? '#eff6ff' : '#fff',
              borderLeft: selected?.id === c.id ? '3px solid #6366f1' : '3px solid transparent',
              transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 12, fontWeight: 700,
                  }}>{c.lead?.name?.split(' ').map(n => n[0]).join('').slice(0,2) || 'NN'}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{c.lead?.name || 'Inconnu'}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{c.lead?.phone || ''}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>
                  {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 44 }}>
                {c.messages?.[0]?.content || 'Aucun message'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <div style={{ fontSize: 14 }}>Sélectionnez une conversation</div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ background: '#fff', padding: '14px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                }}>{selected.lead?.name?.split(' ').map(n => n[0]).join('').slice(0,2) || 'NN'}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selected.lead?.name || 'Inconnu'}</div>
                  <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                    Agent IA actif
                  </div>
                </div>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: selected.status === 'active' ? '#ecfdf5' : '#f1f5f9',
                color: selected.status === 'active' ? '#10b981' : '#64748b',
              }}>
                {selected.status === 'active' ? 'Active' : 'Fermée'}
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                    <div>Aucun message</div>
                  </div>
                </div>
              ) : messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.role === 'assistant' && (
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, background: '#6366f1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, marginRight: 8, flexShrink: 0, alignSelf: 'flex-end',
                    }}>🤖</div>
                  )}
                  <div>
                    <div style={{
                      maxWidth: 400, padding: '10px 14px',
                      borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: m.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff',
                      color: m.role === 'user' ? '#fff' : '#0f172a',
                      fontSize: 13, lineHeight: 1.5,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                    }}>
                      {m.content}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                      {new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// AppointmentsPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
export function AppointmentsPage() {
  const [filter, setFilter] = useState('tous');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/appointments')
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const statusCfg = {
    scheduled: { label: 'Confirmé', bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0' },
    pending: { label: 'En attente', bg: '#fffbeb', color: '#f59e0b', border: '#fde68a' },
    cancelled: { label: 'Annulé', bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
  };

  const filtered = filter === 'tous' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Rendez-vous</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>Gérez les rendez-vous pris par l'agent IA</p>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: 4, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
          {['tous', 'scheduled', 'pending', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: filter === f ? '#0f172a' : 'transparent',
              color: filter === f ? '#fff' : '#64748b',
              transition: 'all 0.15s',
            }}>
              {f === 'tous' ? 'Tous' : f === 'scheduled' ? 'Confirmés' : f === 'pending' ? 'En attente' : 'Annulés'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total RDV', value: appointments.length, icon: '📅' },
          { label: 'Confirmés', value: appointments.filter(a => a.status === 'scheduled').length, icon: '✅' },
          { label: 'En attente', value: appointments.filter(a => a.status === 'pending').length, icon: '⏳' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Aucun rendez-vous</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Les RDV créés par l'agent IA apparaîtront ici</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Client', 'Date', 'Heure', 'Statut', 'Google Calendar'].map(h => (
                  <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const sc = statusCfg[a.status] || statusCfg.scheduled;
                const dt = new Date(a.scheduledAt);
                return (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                          color: '#fff', fontSize: 11, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{a.lead?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'NN'}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{a.lead?.name || 'Inconnu'}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.lead?.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>
                      {dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 8, background: '#f1f5f9', fontSize: 12, fontWeight: 600, color: '#475569' }}>
                        {dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {sc.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {a.googleEventId ? (
                        <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>✅ Synchronisé</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SettingsPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
export function SettingsPage({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const integrations = [
    { name: 'Facebook Lead Ads', desc: 'Webhook configuré et actif', icon: '📘', status: 'connected', color: '#3b82f6' },
    { name: 'WhatsApp Business', desc: 'Via Twilio — configuration requise', icon: '💬', status: 'pending', color: '#10b981' },
    { name: 'Google Calendar', desc: 'Synchronisation des rendez-vous', icon: '📅', status: 'pending', color: '#f59e0b' },
    { name: 'OpenAI GPT-4o', desc: 'Agent conversationnel IA', icon: '🤖', status: 'pending', color: '#8b5cf6' },
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
            { label: 'Nom complet', placeholder: user?.email?.split('@')[0] || 'Votre nom', type: 'text' },
            { label: 'Email', placeholder: user?.email || 'email@exemple.com', type: 'email' },
            { label: 'Nom de l\'entreprise', placeholder: 'Test Company', type: 'text' },
            { label: 'Téléphone', placeholder: '+212 6XX XXX XXX', type: 'tel' },
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
            { label: 'Nouveau lead Facebook', desc: 'Notifier à chaque nouveau lead reçu' },
            { label: 'Rendez-vous confirmé', desc: 'Alerte quand un RDV est pris par l\'IA' },
            { label: 'Conversation terminée', desc: 'Résumé après chaque conversation IA' },
            { label: 'Rapport hebdomadaire', desc: 'Récapitulatif des performances chaque lundi' },
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
