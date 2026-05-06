const MOCK_APPOINTMENTS = [
  { id: 1, name: 'Ahmed Benali',  phone: '0712345678', date: '2026-05-15', time: '10:00', status: 'confirmed', notes: 'Intéressé par offre premium' },
  { id: 2, name: 'Sara Tazi',     phone: '0662345678', date: '2026-05-16', time: '14:30', status: 'confirmed', notes: 'Rappel envoyé via WhatsApp' },
  { id: 3, name: 'Karim Alaoui',  phone: '0622345678', date: '2026-05-18', time: '09:00', status: 'pending',   notes: 'En attente de confirmation' },
  { id: 4, name: 'Leila Mansouri',phone: '0632345678', date: '2026-05-20', time: '16:00', status: 'cancelled', notes: 'A annulé, à recontacter' },
];

export function AppointmentsPage() {
  const [filter, setFilter] = useState('tous');

  const statusCfg = {
    confirmed: { label: 'Confirmé',  bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0' },
    pending:   { label: 'En attente',bg: '#fffbeb', color: '#f59e0b', border: '#fde68a' },
    cancelled: { label: 'Annulé',    bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
  };

  const filtered = MOCK_APPOINTMENTS.filter(a => filter === 'tous' || a.status === filter);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Rendez-vous</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>Gérez les rendez-vous pris par l'agent IA</p>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: 4, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
          {['tous', 'confirmed', 'pending', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: filter === f ? '#0f172a' : 'transparent',
              color: filter === f ? '#fff' : '#64748b',
              transition: 'all 0.15s',
            }}>
              {f === 'tous' ? 'Tous' : f === 'confirmed' ? 'Confirmés' : f === 'pending' ? 'En attente' : 'Annulés'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total RDV',   value: MOCK_APPOINTMENTS.length,                                          color: '#6366f1', bg: '#eff6ff', icon: '📅' },
          { label: 'Confirmés',   value: MOCK_APPOINTMENTS.filter(a => a.status === 'confirmed').length,    color: '#10b981', bg: '#ecfdf5', icon: '✅' },
          { label: 'En attente',  value: MOCK_APPOINTMENTS.filter(a => a.status === 'pending').length,      color: '#f59e0b', bg: '#fffbeb', icon: '⏳' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Client', 'Date', 'Heure', 'Statut', 'Notes'].map(h => (
                <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const sc = statusCfg[a.status];
              return (
                <tr key={a.id}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        color: '#fff', fontSize: 11, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{a.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>
                    {new Date(a.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 8, background: '#f1f5f9', fontSize: 12, fontWeight: 600, color: '#475569' }}>
                      {a.time}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {sc.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 12, color: '#64748b' }}>{a.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
