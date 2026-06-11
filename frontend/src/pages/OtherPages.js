import { useState, useEffect } from 'react';
import API from '../services/api';

function Icon({ d, size = 16, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const initials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'NN';

// ─── ConversationsPage ────────────────────────────────────────────────────────
export function ConversationsPage() {
  const [selected, setSelected]           = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages]           = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    API.get('/conversations')
      .then(res => { setConversations(res.data); if (res.data.length > 0) setSelected(res.data[0]); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    API.get(`/conversations/${selected.id}/messages`).then(res => setMessages(res.data)).catch(console.error);
  }, [selected]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', gap: 0, margin: '-28px -32px', background: '#f1f5f9' }}>
      {/* List */}
      <div style={{ width: 320, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Conversations</p>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{conversations.filter(c => c.status === 'active').length} actives</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 28, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Chargement...</div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.2" style={{ margin: '0 auto 10px', display: 'block' }}>
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p style={{ fontSize: 13 }}>Aucune conversation</p>
            </div>
          ) : conversations.map(c => (
            <div key={c.id} onClick={() => setSelected(c)} style={{
              padding: '14px 18px', cursor: 'pointer', borderBottom: '1px solid #f8fafc',
              background: selected?.id === c.id ? '#eff6ff' : '#fff',
              borderLeft: `3px solid ${selected?.id === c.id ? '#3b82f6' : 'transparent'}`,
              transition: 'all 0.13s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 36, flexShrink: 0, background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    {initials(c.lead?.name)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{c.lead?.name || 'Inconnu'}</p>
                    <p style={{ fontSize: 10, color: '#94a3b8' }}>{c.lead?.phone || ''}</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 45 }}>
                {c.messages?.[0]?.content || 'Aucun message'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.2" style={{ margin: '0 auto 12px', display: 'block' }}>
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p style={{ fontSize: 14, color: '#64748b' }}>Selectionnez une conversation</p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ background: '#fff', padding: '13px 22px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 38, height: 38, borderRadius: 38, background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                  {initials(selected.lead?.name)}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selected.lead?.name || 'Inconnu'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: 11, color: '#15803d', fontWeight: 500 }}>Agent IA actif</span>
                  </div>
                </div>
              </div>
              <span style={{ padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: selected.status === 'active' ? '#f0fdf4' : '#f8fafc', color: selected.status === 'active' ? '#15803d' : '#64748b', border: `1px solid ${selected.status === 'active' ? '#bbf7d0' : '#e2e8f0'}` }}>
                {selected.status === 'active' ? 'Active' : 'Fermee'}
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: 13, color: '#94a3b8' }}>Aucun message</p>
                </div>
              ) : messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.role === 'assistant' && (
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0, alignSelf: 'flex-end' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <div style={{
                      maxWidth: 400, padding: '10px 14px',
                      borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                      background: m.role === 'user' ? '#3b82f6' : '#fff',
                      color: m.role === 'user' ? '#fff' : '#0f172a',
                      fontSize: 13, lineHeight: 1.55,
                      border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                    }}>
                      {m.content}
                    </div>
                    <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                      {new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
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

// ─── AppointmentsPage ─────────────────────────────────────────────────────────
export function AppointmentsPage() {
  const [filter, setFilter]           = useState('tous');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    API.get('/appointments').then(res => setAppointments(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statusCfg = {
    scheduled: { label: 'Confirme',   bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    pending:   { label: 'En attente', bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    cancelled: { label: 'Annule',     bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  };

  const filtered = filter === 'tous' ? appointments : appointments.filter(a => a.status === filter);

  const kpis = [
    { label: 'Total RDV',  value: appointments.length,                                      iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: '#3b82f6' },
    { label: 'Confirmes',  value: appointments.filter(a => a.status === 'scheduled').length, iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: '#10b981' },
    { label: 'En attente', value: appointments.filter(a => a.status === 'pending').length,   iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: '#f59e0b' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Rendez-vous</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Gerez les rendez-vous pris par l'agent IA</p>
        </div>
        <div style={{ display: 'flex', gap: 3, background: '#f8fafc', borderRadius: 40, padding: 3, border: '1px solid #e2e8f0' }}>
          {['tous', 'scheduled', 'pending', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 40, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer', background: filter === f ? '#0f172a' : 'transparent', color: filter === f ? '#fff' : '#64748b', transition: 'all 0.13s' }}>
              {f === 'tous' ? 'Tous' : f === 'scheduled' ? 'Confirmes' : f === 'pending' ? 'En attente' : 'Annules'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon d={k.iconPath} size={17} color={k.color} />
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>{k.value}</p>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{k.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 44, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.2" style={{ margin: '0 auto 12px', display: 'block' }}>
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>Aucun rendez-vous</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Les RDV crees par l'agent IA apparaitront ici</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Client', 'Date', 'Heure', 'Statut', 'Google Calendar'].map(h => (
                  <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const sc = statusCfg[a.status] || statusCfg.scheduled;
                const dt = new Date(a.scheduledAt);
                return (
                  <tr key={a.id} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = '#fff'} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.12s' }}>
                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 32, background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {initials(a.lead?.name)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{a.lead?.name || 'Inconnu'}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8' }}>{a.lead?.phone || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 18px', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{ padding: '4px 9px', borderRadius: 7, background: '#f8fafc', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                        {dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{ padding: '4px 11px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      {a.googleEventId
                        ? <span style={{ fontSize: 11, color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Synchronise
                          </span>
                        : <span style={{ fontSize: 11, color: '#94a3b8' }}>—</span>
                      }
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

// ─── SettingsPage ─────────────────────────────────────────────────────────────
export function SettingsPage({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved]         = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const integrations = [
    { name: 'Facebook Lead Ads',  desc: 'Webhook configure et actif',         status: 'connected', accent: '#3b82f6', iconPath: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
    { name: 'WhatsApp Business',  desc: 'Via Twilio — sandbox actif',         status: 'connected', accent: '#10b981', iconPath: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { name: 'Google Calendar',    desc: 'Synchronisation des rendez-vous',    status: 'connected', accent: '#f59e0b', iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'OpenAI GPT-4o-mini', desc: 'Agent conversationnel IA actif',     status: 'connected', accent: '#8b5cf6', iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2' },
  ];

  const tabs = [
    { id: 'profile',       label: 'Profil' },
    { id: 'integrations',  label: 'Integrations' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security',      label: 'Securite' },
  ];

  const inputStyle = { width: '100%', padding: '9px 13px', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a' };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: 760 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Parametres</h2>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Gerez votre compte et vos integrations</p>
      </div>

      <div style={{ display: 'flex', gap: 3, marginBottom: 20, padding: 3, background: '#f8fafc', borderRadius: 40, border: '1px solid #e2e8f0', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '7px 18px', borderRadius: 40, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: activeTab === t.id ? '#0f172a' : 'transparent', color: activeTab === t.id ? '#fff' : '#64748b', transition: 'all 0.13s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 26, border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>Informations du compte</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22, padding: 14, background: '#f8fafc', borderRadius: 10 }}>
            <div style={{ width: 50, height: 50, borderRadius: 50, background: '#3b82f6', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initials(user?.email?.split('@')[0] || '')}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{user?.email?.split('@')[0]}</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{user?.email}</p>
              <p style={{ fontSize: 11, color: '#15803d', marginTop: 3, fontWeight: 600 }}>Administrateur</p>
            </div>
          </div>
          {[
            { label: 'Nom complet',           placeholder: user?.email?.split('@')[0] || 'Votre nom', type: 'text' },
            { label: 'Email',                 placeholder: user?.email || 'email@exemple.com',        type: 'email' },
            { label: "Nom de l'entreprise",   placeholder: 'Mon Entreprise',                          type: 'text' },
            { label: 'Telephone',             placeholder: '+212 6XX XXX XXX',                        type: 'tel' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          ))}
          <button onClick={handleSave} style={{ marginTop: 8, padding: '9px 22px', borderRadius: 40, border: 'none', background: saved ? '#10b981' : '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
            {saved ? 'Sauvegarde' : 'Sauvegarder les modifications'}
          </button>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {integrations.map(int => (
            <div key={int.name} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={int.iconPath} size={17} color={int.accent} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{int.name}</p>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{int.desc}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: int.status === 'connected' ? '#f0fdf4' : '#f8fafc', color: int.status === 'connected' ? '#15803d' : '#64748b', border: `1px solid ${int.status === 'connected' ? '#bbf7d0' : '#e2e8f0'}` }}>
                  {int.status === 'connected' ? 'Connecte' : 'Non configure'}
                </span>
                <button style={{ padding: '6px 13px', borderRadius: 40, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 500, cursor: 'pointer', background: '#fff', color: '#0f172a' }}>
                  Configurer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 26, border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>Preferences de notifications</p>
          {[
            { label: 'Nouveau lead Facebook',  desc: 'Notifier a chaque nouveau lead recu', on: true },
            { label: 'Rendez-vous confirme',   desc: "Alerte quand un RDV est pris par l'IA", on: true },
            { label: 'Conversation terminee',  desc: 'Resume apres chaque conversation IA', on: false },
            { label: 'Rapport hebdomadaire',   desc: 'Recapitulatif des performances chaque lundi', on: false },
          ].map(n => (
            <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{n.label}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{n.desc}</p>
              </div>
              <div style={{ width: 42, height: 22, borderRadius: 11, background: n.on ? '#3b82f6' : '#e2e8f0', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                <div style={{ position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: '#fff', top: 3, left: n.on ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 26, border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>Securite du compte</p>
          {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le mot de passe'].map(f => (
            <div key={f} style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{f}</label>
              <input type="password" placeholder="••••••••" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          ))}
          <button onClick={handleSave} style={{ marginTop: 8, padding: '9px 22px', borderRadius: 40, border: 'none', background: saved ? '#10b981' : '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
            {saved ? 'Modifie' : 'Changer le mot de passe'}
          </button>
        </div>
      )}
    </div>
  );
}