import { useState, useEffect } from 'react';
import { getLeads, createLead, updateLeadStatus } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DashboardPage({ user, onLogout }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [newLead, setNewLead] = useState({ name: '', phone: '', source: 'facebook' });
  const [activeFilter, setActiveFilter] = useState('tous');

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

  const filteredLeads = leads.filter(l => {
    if (activeFilter === 'tous') return true;
    if (activeFilter === 'nouveaux') return l.status === 'new';
    if (activeFilter === 'qualifies') return l.status === 'qualified';
    return true;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
  };

  const pieData = [
    { name: 'Nouveaux', value: stats.new || 0, color: '#6366f1' },
    { name: 'Contactés', value: stats.contacted || 0, color: '#f59e0b' },
    { name: 'Qualifiés', value: stats.qualified || 0, color: '#10b981' },
    { name: 'Perdus', value: leads.filter(l => l.status === 'lost').length || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const statusConfig = {
    new: { label: 'Nouveau', bg: '#eef2ff', color: '#6366f1' },
    contacted: { label: 'Contacté', bg: '#fef9c3', color: '#a16207' },
    qualified: { label: 'Qualifié', bg: '#dcfce7', color: '#16a34a' },
    lost: { label: 'Perdu', bg: '#fee2e2', color: '#dc2626' },
  };

  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'leads', icon: '👥', label: 'Leads' },
    { id: 'conversations', icon: '💬', label: 'Conversations' },
    { id: 'appointments', icon: '📅', label: 'Rendez-vous' },
    { id: 'settings', icon: '⚙️', label: 'Paramètres' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fc' }}>

      {/* Sidebar */}
      <div style={{
        width: '72px', background: '#1a1d2e', display: 'flex',
        flexDirection: 'column', alignItems: 'center', padding: '20px 0',
        position: 'fixed', height: '100vh', zIndex: 100,
      }}>
        <div style={{
          width: '36px', height: '36px', background: '#6366f1',
          borderRadius: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '18px', marginBottom: '32px',
        }}>🚀</div>

        {navItems.map(item => (
          <div key={item.id} onClick={() => setActivePage(item.id)} style={{
            width: '44px', height: '44px', borderRadius: '12px', marginBottom: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', cursor: 'pointer',
            background: activePage === item.id ? '#6366f1' : 'transparent',
            transition: 'all 0.2s',
          }} title={item.label}>
            {item.icon}
          </div>
        ))}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', cursor: 'pointer', color: '#ef4444',
          }} onClick={onLogout} title="Déconnexion">🚪</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: '72px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{
          background: 'white', padding: '0 28px', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1d2e' }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: '#f5f5f5', borderRadius: '8px', padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: '8px', color: '#999', fontSize: '13px',
            }}>
              🔍 Rechercher...
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#6366f1', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '600',
            }}>
              {getInitials(user.email.split('@')[0])}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* Overview title */}
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1a1d2e' }}>
            Vue d'ensemble
          </h2>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Leads', value: stats.total, icon: '👥', color: '#6366f1', bg: '#eef2ff', change: '+12%' },
              { label: 'Nouveaux', value: stats.new, icon: '🆕', color: '#6366f1', bg: '#eef2ff', change: 'En attente' },
              { label: 'Contactés', value: stats.contacted, icon: '📞', color: '#f59e0b', bg: '#fef9c3', change: 'Ce mois' },
              { label: 'Qualifiés', value: stats.qualified, icon: '✅', color: '#10b981', bg: '#dcfce7', change: '+25%' },
            ].map(card => (
              <div key={card.label} style={{
                background: 'white', borderRadius: '14px', padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>{card.label}</span>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: card.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '16px',
                  }}>{card.icon}</div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1d2e', marginBottom: '6px' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '12px', color: card.color, fontWeight: '500' }}>
                  ↑ {card.change} cette semaine
                </div>
              </div>
            ))}
          </div>

          {/* Charts + Table Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '24px' }}>

            {/* Pie Chart */}
            <div style={{
              background: 'white', borderRadius: '14px', padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#1a1d2e' }}>
                Répartition des leads
              </h3>
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                    {pieData.map(d => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }} />
                          <span style={{ color: '#666' }}>{d.name}</span>
                        </div>
                        <span style={{ fontWeight: '600', color: '#1a1d2e' }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '40px 0' }}>
                  Aucune donnée
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div style={{
              background: 'white', borderRadius: '14px', padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1d2e' }}>Leads récents</h3>
                <button onClick={() => setShowForm(!showForm)} style={{
                  background: '#6366f1', color: 'white', border: 'none',
                  padding: '7px 14px', borderRadius: '8px', fontSize: '12px',
                  fontWeight: '600', cursor: 'pointer',
                }}>+ Ajouter</button>
              </div>

              {showForm && (
                <form onSubmit={handleCreateLead} style={{
                  display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap',
                  padding: '12px', background: '#f8f9fc', borderRadius: '10px',
                }}>
                  <input placeholder="Nom" value={newLead.name}
                    onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    required style={inputStyle} />
                  <input placeholder="Téléphone" value={newLead.phone}
                    onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                    required style={inputStyle} />
                  <select value={newLead.source}
                    onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                    style={inputStyle}>
                    <option value="facebook">Facebook</option>
                    <option value="manual">Manuel</option>
                  </select>
                  <button type="submit" style={{
                    background: '#10b981', color: 'white', border: 'none',
                    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
                  }}>Créer</button>
                </form>
              )}

              {loading ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Chargement...</p>
              ) : leads.slice(0, 4).map(lead => (
                <div key={lead.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid #f5f5f5',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: '#eef2ff', color: '#6366f1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '600',
                    }}>{getInitials(lead.name)}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1d2e' }}>{lead.name}</div>
                      <div style={{ fontSize: '11px', color: '#999' }}>{lead.phone}</div>
                    </div>
                  </div>
                  <select value={lead.status} onChange={e => handleStatusChange(lead.id, e.target.value)}
                    style={{
                      padding: '4px 8px', borderRadius: '20px', border: 'none', fontSize: '11px',
                      fontWeight: '600', cursor: 'pointer',
                      background: statusConfig[lead.status]?.bg || '#f5f5f5',
                      color: statusConfig[lead.status]?.color || '#666',
                    }}>
                    <option value="new">Nouveau</option>
                    <option value="contacted">Contacté</option>
                    <option value="qualified">Qualifié</option>
                    <option value="lost">Perdu</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Full Leads Table */}
          <div style={{
            background: 'white', borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid #f5f5f5',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1d2e' }}>Tous les leads</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['tous', 'nouveaux', 'qualifies'].map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)} style={{
                    padding: '5px 12px', borderRadius: '8px', border: '1px solid',
                    fontSize: '12px', cursor: 'pointer', fontWeight: '500',
                    borderColor: activeFilter === f ? '#6366f1' : '#e5e7eb',
                    background: activeFilter === f ? '#eef2ff' : 'white',
                    color: activeFilter === f ? '#6366f1' : '#666',
                  }}>
                    {f === 'tous' ? 'Tous' : f === 'nouveaux' ? 'Nouveaux' : 'Qualifiés'}
                  </button>
                ))}
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Nom', 'Téléphone', 'Source', 'Statut', 'Date'].map(h => (
                    <th key={h} style={{
                      padding: '10px 20px', textAlign: 'left',
                      fontSize: '11px', color: '#999', fontWeight: '600',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '1px solid #f0f0f0',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#999', fontSize: '13px' }}>
                    Aucun lead
                  </td></tr>
                ) : filteredLeads.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #f9f9f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '50%',
                          background: '#eef2ff', color: '#6366f1',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: '600',
                        }}>{getInitials(lead.name)}</div>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#1a1d2e' }}>{lead.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: '13px', color: '#666' }}>{lead.phone}</td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                        background: lead.source === 'facebook' ? '#dbeafe' : '#f3f4f6',
                        color: lead.source === 'facebook' ? '#1d4ed8' : '#666',
                      }}>{lead.source}</span>
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <select value={lead.status} onChange={e => handleStatusChange(lead.id, e.target.value)}
                        style={{
                          padding: '4px 10px', borderRadius: '20px', border: 'none',
                          fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                          background: statusConfig[lead.status]?.bg || '#f5f5f5',
                          color: statusConfig[lead.status]?.color || '#666',
                        }}>
                        <option value="new">Nouveau</option>
                        <option value="contacted">Contacté</option>
                        <option value="qualified">Qualifié</option>
                        <option value="lost">Perdu</option>
                      </select>
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: '13px', color: '#999' }}>
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px',
  fontSize: '13px', flex: 1, minWidth: '120px', outline: 'none',
};