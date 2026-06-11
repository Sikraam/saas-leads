import { useState, useEffect, useMemo } from 'react';
import { getLeads, createLead, updateLeadStatus } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ConversationsPage, AppointmentsPage, SettingsPage } from './OtherPages';

const COLORS = {
  primary: '#3b82f6', primaryDark: '#2563eb', success: '#10b981',
  warning: '#f59e0b', danger: '#ef4444', purple: '#8b5cf6',
  dark: '#0f172a', sidebar: '#ffffff', bg: '#f1f5f9', card: '#ffffff',
  border: '#e2e8f0', text: '#334155', textLight: '#64748b', textDark: '#0f172a',
};

const statusConfig = {
  new:       { label: 'Nouveau',  bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
  contacted: { label: 'Contacté', bg: '#fffbeb', color: '#f59e0b', border: '#fde68a' },
  qualified: { label: 'Qualifié', bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0' },
  lost:      { label: 'Perdu',    bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
};

const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

function buildChartData(leads) {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('fr-FR', { weekday: 'short' });
    const dayLeads = leads.filter(l => new Date(l.createdAt).toDateString() === d.toDateString());
    return { name: label, leads: dayLeads.length, qualifiés: dayLeads.filter(l => l.status === 'qualified').length };
  });
}

const NAV = [
  { id: 'dashboard',     label: 'Tableau de bord', path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'leads',         label: 'Leads',            path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'conversations', label: 'Conversations',    path: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { id: 'appointments',  label: 'Rendez-vous',      path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'settings',      label: 'Paramètres',       path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

function Icon({ d, size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="#3b82f6" />
      <path d="M18 6L26 16H22V24H14V16H10Z" fill="white" />
    </svg>
  );
}

export default function DashboardPage({ user, onLogout }) {
  const [leads, setLeads]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [activePage, setActivePage]     = useState('dashboard');
  const [newLead, setNewLead]           = useState({ name: '', phone: '', source: 'facebook' });
  const [activeFilter, setActiveFilter] = useState('tous');
  const [searchTerm, setSearchTerm]     = useState('');
  const [collapsed, setCollapsed]       = useState(false);
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bonjour' : currentHour < 18 ? 'Bon après-midi' : 'Bonsoir';

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try { const res = await getLeads(); setLeads(res.data.leads); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await createLead(newLead);
      setNewLead({ name: '', phone: '', source: 'facebook' });
      setShowForm(false);
      fetchLeads();
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateLeadStatus(id, status); fetchLeads(); }
    catch (err) { console.error(err); }
  };

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    lost: leads.filter(l => l.status === 'lost').length,
    conversionRate: leads.length > 0 ? ((leads.filter(l => l.status === 'qualified').length / leads.length) * 100).toFixed(1) : '0.0',
  }), [leads]);

  const chartData = useMemo(() => buildChartData(leads), [leads]);
  const pieData   = useMemo(() => [
    { name: 'Nouveaux',  value: stats.new,       color: '#3b82f6' },
    { name: 'Contactés', value: stats.contacted,  color: '#f59e0b' },
    { name: 'Qualifiés', value: stats.qualified,  color: '#10b981' },
    { name: 'Perdus',    value: stats.lost,       color: '#ef4444' },
  ].filter(d => d.value > 0), [stats]);

  const filteredLeads = useMemo(() => leads
    .filter(l => {
      if (activeFilter === 'nouveaux') return l.status === 'new';
      if (activeFilter === 'qualifies') return l.status === 'qualified';
      return true;
    })
    .filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm)),
  [leads, activeFilter, searchTerm]);

  const sw = collapsed ? 80 : 260;

  const kpis = [
    { label: 'Total Leads',    value: stats.total,               sub: 'Tous statuts',       color: '#3b82f6', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Nouveaux',       value: stats.new,                 sub: 'A contacter',         color: '#f59e0b', iconPath: 'M12 4v16m8-8H4' },
    { label: 'Qualifies',      value: stats.qualified,           sub: 'Prets pour conversion',color: '#10b981', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Taux conversion',value: `${stats.conversionRate}%`,sub: 'Qualifies / Total',   color: '#8b5cf6', iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg, fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: sw, minWidth: sw, background: COLORS.sidebar,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', zIndex: 100,
        transition: 'width 0.3s ease',
        borderRight: `1px solid ${COLORS.border}`,
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '22px 0' : '22px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
            <Logo />
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.textDark, letterSpacing: '-0.3px' }}>LeadFlow</div>
                <div style={{ fontSize: 10, color: COLORS.textLight, marginTop: 1 }}>AI Platform</div>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, width: 28, height: 28, cursor: 'pointer', color: COLORS.textLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points={collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(item => {
            const active = activePage === item.id;
            return (
              <div key={item.id} onClick={() => setActivePage(item.id)}
                style={{
                  padding: collapsed ? '11px 0' : '11px 14px', borderRadius: 10,
                  display: 'flex', alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: 11, cursor: 'pointer',
                  background: active ? '#eff6ff' : 'transparent',
                  color: active ? COLORS.primary : COLORS.textLight,
                  transition: 'all 0.15s', fontWeight: active ? 600 : 500,
                  borderLeft: `3px solid ${active ? COLORS.primary : 'transparent'}`,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = COLORS.bg; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon d={item.path} size={17} />
                {!collapsed && <span style={{ fontSize: 13 }}>{item.label}</span>}
              </div>
            );
          })}
        </nav>

        {/* Agent status */}
        {!collapsed && (
          <div style={{ margin: '0 12px 12px', background: '#f0fdf4', borderRadius: 10, padding: '10px 14px', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#15803d' }}>Agent IA actif</span>
            </div>
            <div style={{ fontSize: 10, color: COLORS.textLight, marginTop: 3 }}>Traitement en temps réel</div>
          </div>
        )}

        {/* Logout */}
        <div onClick={onLogout} style={{
          margin: '0 12px 16px', padding: collapsed ? '11px 0' : '11px 14px',
          borderRadius: 10, display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 11, cursor: 'pointer', color: '#ef4444',
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>Déconnexion</span>}
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: sw, flex: 1, transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{ background: COLORS.card, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${COLORS.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.textDark, letterSpacing: '-0.3px' }}>
              {NAV.find(n => n.id === activePage)?.label || 'Tableau de bord'}
            </h1>
            <p style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>
              {greeting}, <strong style={{ color: COLORS.primary }}>{user.email.split('@')[0]}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: COLORS.bg, borderRadius: 40, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 9, border: `1px solid ${COLORS.border}` }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input placeholder="Rechercher un lead..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 13, background: 'transparent', width: 190, color: COLORS.textDark }} />
            </div>
            <div style={{ width: 38, height: 38, borderRadius: 38, background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              {getInitials(user.email.split('@')[0])}
            </div>
          </div>
        </header>

        <div style={{ padding: '28px 32px', flex: 1 }}>
          {activePage === 'conversations' && <ConversationsPage />}
          {activePage === 'appointments'  && <AppointmentsPage />}
          {activePage === 'settings'      && <SettingsPage user={user} />}

          {(activePage === 'dashboard' || activePage === 'leads') && (
            <>
              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}>
                {kpis.map(c => (
                  <div key={c.label} style={{ background: COLORS.card, borderRadius: 18, padding: '20px 22px', border: `1px solid ${COLORS.border}`, transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.07)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 13, background: `${c.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <Icon d={c.iconPath} size={20} color={c.color} />
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.textLight, fontWeight: 500, marginBottom: 5 }}>{c.label}</div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.textDark, lineHeight: 1 }}>{c.value}</div>
                    <div style={{ fontSize: 11, color: c.color, marginTop: 7, fontWeight: 500 }}>{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginBottom: 28 }}>
                <div style={{ background: COLORS.card, borderRadius: 18, padding: '20px 22px 14px', border: `1px solid ${COLORS.border}` }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.textDark }}>Evolution des leads — 7 jours</p>
                  <p style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 14, marginTop: 3 }}>Base sur les dates de creation reelles</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gq" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                      <Area type="monotone" dataKey="leads"     stroke="#3b82f6" fill="url(#gl)" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} name="Leads" />
                      <Area type="monotone" dataKey="qualifiés" stroke="#10b981" fill="url(#gq)" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} name="Qualifies" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: COLORS.card, borderRadius: 18, padding: 20, border: `1px solid ${COLORS.border}` }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.textDark }}>Repartition</p>
                  <p style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 14, marginTop: 3 }}>Par statut</p>
                  {pieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3}>
                            {pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="#fff" strokeWidth={2} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v, n) => [v, n]} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
                        {pieData.map(d => (
                          <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                              <span style={{ color: COLORS.textLight }}>{d.name}</span>
                            </div>
                            <span style={{ fontWeight: 700, color: COLORS.textDark }}>{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: COLORS.textLight, padding: '40px 0', fontSize: 13 }}>Aucune donnee</div>
                  )}
                </div>
              </div>

              {/* Leads Table */}
              <div style={{ background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
                <div style={{ padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.border}` }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.textDark }}>Base de donnees leads</p>
                    <p style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>{filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} trouve{filteredLeads.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 3, background: COLORS.bg, borderRadius: 40, padding: 3, border: `1px solid ${COLORS.border}` }}>
                      {['tous', 'nouveaux', 'qualifies'].map(f => (
                        <button key={f} onClick={() => setActiveFilter(f)} style={{
                          padding: '5px 14px', borderRadius: 40, fontSize: 12, cursor: 'pointer',
                          fontWeight: 500, border: 'none',
                          background: activeFilter === f ? COLORS.textDark : 'transparent',
                          color: activeFilter === f ? '#fff' : COLORS.textLight,
                          transition: 'all 0.15s',
                        }}>
                          {f === 'tous' ? 'Tous' : f === 'nouveaux' ? 'Nouveaux' : 'Qualifies'}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowForm(!showForm)} style={{
                      padding: '7px 18px', borderRadius: 40, fontSize: 12, cursor: 'pointer',
                      fontWeight: 600, border: 'none', background: COLORS.primary, color: '#fff',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Ajouter
                    </button>
                  </div>
                </div>

                {showForm && (
                  <form onSubmit={handleCreateLead} style={{ display: 'flex', gap: 10, padding: '14px 22px', flexWrap: 'wrap', background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
                    {[{ placeholder: 'Nom complet', key: 'name' }, { placeholder: 'Telephone', key: 'phone' }].map(f => (
                      <input key={f.key} placeholder={f.placeholder} value={newLead[f.key]} required
                        onChange={e => setNewLead({ ...newLead, [f.key]: e.target.value })}
                        style={{ padding: '8px 14px', border: `1px solid ${COLORS.border}`, borderRadius: 40, fontSize: 13, flex: 1, minWidth: 130, outline: 'none', background: '#fff' }} />
                    ))}
                    <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                      style={{ padding: '8px 14px', border: `1px solid ${COLORS.border}`, borderRadius: 40, fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option value="facebook">Facebook Ads</option>
                      <option value="manual">Manuel</option>
                    </select>
                    <button type="submit" style={{ padding: '8px 20px', borderRadius: 40, background: COLORS.success, color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Creer</button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: 40, background: COLORS.border, color: COLORS.textLight, border: 'none', fontSize: 13, cursor: 'pointer' }}>Annuler</button>
                  </form>
                )}

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
                        {['Lead', 'Telephone', 'Source', 'Statut', 'Date', ''].map(h => (
                          <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 10, color: COLORS.textLight, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: 44, color: COLORS.textLight, fontSize: 13 }}>Chargement...</td></tr>
                      ) : filteredLeads.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: 52, color: COLORS.textLight, fontSize: 13 }}>Aucun lead trouve</td></tr>
                      ) : filteredLeads.map(lead => {
                        const sc = statusConfig[lead.status] || statusConfig.new;
                        return (
                          <tr key={lead.id}
                            onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            style={{ borderBottom: `1px solid #f1f5f9`, transition: 'background 0.15s' }}>
                            <td style={{ padding: '13px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 36, background: COLORS.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                  {getInitials(lead.name)}
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textDark }}>{lead.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '13px 18px', fontSize: 13, color: COLORS.textLight }}>{lead.phone}</td>
                            <td style={{ padding: '13px 18px' }}>
                              <span style={{ padding: '3px 10px', borderRadius: 40, fontSize: 11, fontWeight: 600, background: lead.source === 'facebook' ? '#eff6ff' : '#f1f5f9', color: lead.source === 'facebook' ? '#3b82f6' : '#64748b' }}>
                                {lead.source === 'facebook' ? 'Facebook Ads' : 'Manuel'}
                              </span>
                            </td>
                            <td style={{ padding: '13px 18px' }}>
                              <select value={lead.status} onChange={e => handleStatusChange(lead.id, e.target.value)}
                                style={{ padding: '4px 10px', borderRadius: 40, border: `1px solid ${sc.border}`, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: sc.bg, color: sc.color, outline: 'none' }}>
                                <option value="new">Nouveau</option>
                                <option value="contacted">Contacte</option>
                                <option value="qualified">Qualifie</option>
                                <option value="lost">Perdu</option>
                              </select>
                            </td>
                            <td style={{ padding: '13px 18px', fontSize: 12, color: COLORS.textLight }}>
                              {new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '13px 18px' }}>
                              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, borderRadius: 6, display: 'flex' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}