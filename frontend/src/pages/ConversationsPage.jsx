import { useState } from 'react';

const MOCK_CONVS = [
  { id: 1, name: 'Ikraam Test',    phone: '0612345678', status: 'active',   lastMsg: 'Bonjour, je suis intéressé par vos services.', time: 'Il y a 2 min',    unread: 2 },
  { id: 2, name: 'Ahmed Benali',   phone: '0712345678', status: 'active',   lastMsg: 'Pouvez-vous me rappeler demain matin ?',        time: 'Il y a 15 min',   unread: 0 },
  { id: 3, name: 'Sara Tazi',      phone: '0662345678', status: 'closed',   lastMsg: 'Rendez-vous confirmé pour le 25 mai.',          time: 'Il y a 1 heure',  unread: 0 },
  { id: 4, name: 'Karim Alaoui',   phone: '0622345678', status: 'active',   lastMsg: 'Quel est le tarif de votre offre premium ?',    time: 'Il y a 3 heures', unread: 1 },
];

const MOCK_MESSAGES = {
  1: [
    { role: 'assistant', content: 'Bonjour ! Je suis l\'agent IA de LeadFlow. Comment puis-je vous aider aujourd\'hui ?', time: '14:30' },
    { role: 'user',      content: 'Bonjour, je suis intéressé par vos services.',                                          time: '14:31' },
    { role: 'assistant', content: 'Parfait ! Puis-je vous poser quelques questions pour mieux comprendre vos besoins ?',   time: '14:31' },
  ],
};

export function ConversationsPage() {
  const [selected, setSelected] = useState(MOCK_CONVS[0]);
  const [msg, setMsg] = useState('');

  const messages = MOCK_MESSAGES[selected.id] || [];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: '#f0f2f7', gap: 0 }}>

      {/* List */}
      <div style={{ width: 320, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Conversations</h2>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{MOCK_CONVS.filter(c => c.status === 'active').length} actives</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {MOCK_CONVS.map(c => (
            <div key={c.id} onClick={() => setSelected(c)} style={{
              padding: '14px 18px', cursor: 'pointer', borderBottom: '1px solid #f8fafc',
              background: selected.id === c.id ? '#eff6ff' : '#fff',
              borderLeft: selected.id === c.id ? '3px solid #6366f1' : '3px solid transparent',
              transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 12, fontWeight: 700,
                  }}>{c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{c.phone}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{c.time}</span>
                  {c.unread > 0 && (
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.unread}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 44 }}>
                {c.lastMsg}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Chat header */}
        <div style={{ background: '#fff', padding: '14px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 700,
            }}>{selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selected.name}</div>
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

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.length > 0 ? messages.map((m, i) => (
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
                  maxWidth: 400, padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#0f172a',
                  fontSize: 13, lineHeight: 1.5,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                }}>
                  {m.content}
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.time}</div>
              </div>
            </div>
          )) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>Aucun message</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Les conversations WhatsApp apparaîtront ici</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ background: '#fff', padding: '14px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10 }}>
          <input value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Écrire un message…"
            style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', background: '#f8fafc' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          <button style={{
            padding: '10px 18px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}