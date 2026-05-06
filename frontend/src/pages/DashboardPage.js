import { useState, useEffect, useMemo } from 'react';
import { getLeads, createLead, updateLeadStatus } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ConversationsPage, AppointmentsPage, SettingsPage } from './OtherPages';

const COLORS = {
  primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  dark: '#0f172a', sidebar: '#0d1117', bg: '#f0f2f7', card: '#ffffff',
  border: '#e2e8f0', text: '#0f172a', muted: '#64748b', light: '#f8fafc',
};

const statusConfig = {
  new:       { label: 'Nouveau',  bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
  contacted: { label: 'Contacté', bg: '#fffbeb', color: '#f59e0b', border: '#fde68a' },
  qualified: { label: 'Qualifié', bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0' },
  lost:      { label: 'Perdu',    bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
};

const getInitials = (name) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

function buildChartData(leads) {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('fr-FR', { weekday: 'short' });
    const dayLeads = leads.filter(l => new Date(l.createdAt).toDateString() === d.toDateString());
    return {
      name: label,
      leads: dayLeads.length,
      qualifiés: dayLeads.filter(l => l.status === 'qualified').length,
    };
  });
}

const NAV = [
  { id: 'dashboard',     label: 'Tableau de bord', path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'leads',         label: 'Leads',            path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'conversations', label: 'Conversations',    path: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { id: 'appointments',  label: 'Rendez-vous',      path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'settings',      label: 'Paramètres',       path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function DashboardPage({ user, onLogout }) {
  const [leads, setLeads]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [activePage, setActivePage]     = useState('dashboard');
  const [newLead, setNewLead]           = useState({ name: '', phone: '', source: 'facebook' });
  const [activeFilter, setActiveFilter] = useState('tous');
  const [searchTerm, setSearchTerm]     = useState('');
  const [collapsed, setCollapsed]       = useState(false);
  const [hoveredNav, setHoveredNav]     = useState(null);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const res = await getLeads();
      setLeads(res.data.leads);
    } catch (err) { console.error(err); }
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
    try {
      await updateLeadStatus(id, status);
      fetchLeads();
    } catch (err) { console.error(err); }
  };

  const stats = useMemo(() => ({
    total:          leads.length,
    new:            leads.filter(l => l.status === 'new').length,
    qualified:      leads.filter(l => l.status === 'qualified').length,
    contacted:      leads.filter(l => l.status === 'contacted').length,
    lost:           leads.filter(l => l.status === 'lost').length,
    conversionRate: leads.length > 0
      ? ((leads.filter(l => l.status === 'qualified').length / leads.length) * 100).toFixed(1)
      : '0.0',
  }), [leads]);

  const chartData  = useMemo(() => buildChartData(leads), [leads]);
  const pieData    = useMemo(() => [
    { name: 'Nouveaux',  value: stats.new,      color: '#3b82f6' },
    { name: 'Contactés', value: stats.contacted, color: '#f59e0b' },
    { name: 'Qualifiés', value: stats.qualified, color: '#10b981' },
    { name: 'Perdus',    value: stats.lost,      color: '#ef4444' },
  ].filter(d => d.value > 0), [stats]);

  const filteredLeads = useMemo(() => leads
    .filter(l => {
      if (activeFilter === 'nouveaux') return l.status === 'new';
      if (activeFilter === 'qualifies') return l.status === 'qualified';
      return true;
    })
    .filter(l =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm)
    ), [leads, activeFilter, searchTerm]);

  const sw = collapsed ? 72 : 240;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: sw, minWidth: sw, background: COLORS.sidebar,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', zIndex: 100,
        transition: 'width 0.25s ease',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          padding: collapsed ? '22px 0' : '22px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>⚡</div>
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>LeadFlow</div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>AI Platform</div>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points={collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
            </svg>
          </button>
        </div>

        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => {
            const active = activePage === item.id;
            const hov    = hoveredNav === item.id;
            return (
              <div key={item.id}
                onClick={() => setActivePage(item.id)}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                title={collapsed ? item.label : ''}
                style={{
                  padding: collapsed ? '10px 0' : '10px 12px', borderRadius: 10,
                  display: 'flex', alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: 10, cursor: 'pointer',
                  background: active ? 'rgba(99,102,241,0.18)' : hov ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: active ? '#818cf8' : '#64748b',
                  transition: 'all 0.15s',
                  borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d={item.path} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{item.label}</span>}
              </div>
            );
          })}
        </nav>

        {!collapsed && (
          <div style={{ margin: '0 10px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981' }}>Agent IA Actif</span>
            </div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>Traitement en temps réel</div>
          </div>
        )}

        <div onClick={onLogout} style={{
          margin: '0 10px 16px', padding: collapsed ? '10px 0' : '10px 12px',
          borderRadius: 10, display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10, cursor: 'pointer', color: '#ef4444',
          background: 'rgba(239,68,68,0.08)', transition: 'all 0.15s',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>Déconnexion</span>}
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: sw, flex: 1, transition: 'margin-left 0.25s ease', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{
          background: '#fff', padding: '0 28px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${COLORS.border}`, position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: COLORS.dark, letterSpacing: '-0.3px' }}>
              {NAV.find(n => n.id === activePage)?.label || 'Tableau de bord'}
            </h1>
            <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
              Bienvenue, <strong>{user.email.split('@')[0]}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: COLORS.light, borderRadius: 10, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${COLORS.border}` }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input placeholder="Rechercher un lead…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 13, background: 'transparent', width: 180, color: COLORS.dark }} />
            </div>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              {getInitials(user.email.split('@')[0])}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ padding: '28px 28px', flex: 1 }}>

          {/* ── Routed pages ── */}
          {activePage === 'conversations' && <ConversationsPage />}
          {activePage === 'appointments'  && <AppointmentsPage />}
          {activePage === 'settings'      && <SettingsPage user={user} />}

          {/* ── Dashboard + Leads ── */}
          {(activePage === 'dashboard' || activePage === 'leads') && (
            <>
              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Total Leads',     value: stats.total,                sub: 'tous statuts',    color: '#6366f1', bg: '#eff6ff', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
                  { label: 'Nouveaux',         value: stats.new,                  sub: 'en attente',      color: '#3b82f6', bg: '#eff6ff', icon: 'M12 4v16m8-8H4' },
                  { label: 'Contactés',        value: stats.contacted,            sub: 'en cours',        color: '#f59e0b', bg: '#fffbeb', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                  { label: 'Taux conversion',  value: `${stats.conversionRate}%`, sub: 'qualifiés/total', color: '#10b981', bg: '#ecfdf5', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                ].map(c => (
                  <div key={c.label} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: `1px solid ${COLORS.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="1.8">
                        <path d={c.icon} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.muted, fontWeight: 500, marginBottom: 6 }}>{c.label}</div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.dark, lineHeight: 1 }}>{c.value}</div>
                    <div style={{ fontSize: 11, color: c.color, marginTop: 6, fontWeight: 500 }}>{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: '20px 20px 12px', border: `1px solid ${COLORS.border}` }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, marginBottom: 4 }}>Évolution des leads — 7 jours</h3>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 16 }}>Basé sur les dates de création réelles</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                      <Area type="monotone" dataKey="leads"     stroke="#6366f1" fill="url(#gl)" strokeWidth={2} dot={{ r: 3 }} name="Leads" />
                      <Area type="monotone" dataKey="qualifiés" stroke="#10b981" fill="url(#gq)" strokeWidth={2} dot={{ r: 3 }} name="Qualifiés" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${COLORS.border}` }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, marginBottom: 4 }}>Répartition</h3>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 12 }}>Par statut</p>
                  {pieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                            {pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="#fff" strokeWidth={2} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v, n) => [v, n]} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                        {pieData.map(d => (
                          <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                              <span style={{ color: COLORS.muted }}>{d.name}</span>
                            </div>
                            <span style={{ fontWeight: 700, color: COLORS.dark }}>{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: COLORS.muted, padding: '40px 0', fontSize: 13 }}>Aucune donnée</div>
                  )}
                </div>
              </div>

              {/* Leads Table */}
              <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.border}` }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark }}>Base de données leads</h3>
                    <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} trouvé{filteredLeads.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {['tous', 'nouveaux', 'qualifies'].map(f => (
                      <button key={f} onClick={() => setActiveFilter(f)} style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 500, border: 'none',
                        background: activeFilter === f ? COLORS.dark : COLORS.light,
                        color: activeFilter === f ? '#fff' : COLORS.muted, transition: 'all 0.15s',
                      }}>
                        {f === 'tous' ? 'Tous' : f === 'nouveaux' ? 'Nouveaux' : 'Qualifiés'}
                      </button>
                    ))}
                    <button onClick={() => setShowForm(!showForm)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600, border: 'none', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Ajouter
                    </button>
                  </div>
                </div>

                {showForm && (
                  <form onSubmit={handleCreateLead} style={{ display: 'flex', gap: 10, padding: '14px 20px', flexWrap: 'wrap', background: COLORS.light, borderBottom: `1px solid ${COLORS.border}` }}>
                    {[{ placeholder: 'Nom complet', key: 'name' }, { placeholder: 'Téléphone', key: 'phone' }].map(f => (
                      <input key={f.key} placeholder={f.placeholder} value={newLead[f.key]} required
                        onChange={e => setNewLead({ ...newLead, [f.key]: e.target.value })}
                        style={{ padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, flex: 1, minWidth: 140, outline: 'none', background: '#fff' }} />
                    ))}
                    <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                      style={{ padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option value="facebook">Facebook Ads</option>
                      <option value="manual">Manuel</option>
                    </select>
                    <button type="submit" style={{ padding: '8px 18px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Créer</button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 14px', borderRadius: 8, background: COLORS.border, color: COLORS.muted, border: 'none', fontSize: 13, cursor: 'pointer' }}>Annuler</button>
                  </form>
                )}

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: COLORS.light, borderBottom: `1px solid ${COLORS.border}` }}>
                        {['Lead', 'Téléphone', 'Source', 'Statut', 'Date', ''].map(h => (
                          <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 10, color: COLORS.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: COLORS.muted, fontSize: 13 }}>Chargement…</td></tr>
                      ) : filteredLeads.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: 50, color: COLORS.muted, fontSize: 13 }}>Aucun lead trouvé</td></tr>
                      ) : filteredLeads.map(lead => {
                        const sc = statusConfig[lead.status] || statusConfig.new;
                        return (
                          <tr key={lead.id}
                            onMouseEnter={e => e.currentTarget.style.background = COLORS.light}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.15s' }}>
                            <td style={{ padding: '13px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                  {getInitials(lead.name)}
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark }}>{lead.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '13px 18px', fontSize: 13, color: COLORS.muted }}>{lead.phone}</td>
                            <td style={{ padding: '13px 18px' }}>
                              <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: lead.source === 'facebook' ? '#eff6ff' : '#f1f5f9', color: lead.source === 'facebook' ? '#3b82f6' : '#64748b' }}>
                                {lead.source === 'facebook' ? 'Facebook Ads' : 'Manuel'}
                              </span>
                            </td>
                            <td style={{ padding: '13px 18px' }}>
                              <select value={lead.status} onChange={e => handleStatusChange(lead.id, e.target.value)}
                                style={{ padding: '4px 10px', borderRadius: 8, border: `1px solid ${sc.border}`, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: sc.bg, color: sc.color }}>
                                <option value="new">Nouveau</option>
                                <option value="contacted">Contacté</option>
                                <option value="qualified">Qualifié</option>
                                <option value="lost">Perdu</option>
                              </select>
                            </td>
                            <td style={{ padding: '13px 18px', fontSize: 12, color: COLORS.muted }}>
                              {new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '13px 18px' }}>
                              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: 4, borderRadius: 6, display: 'flex' }}>
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