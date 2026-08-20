import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';
import CaseDetailModal from '../components/CaseDetailModal';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { fetchCases, updateCaseStatus, deleteCase } from '../lib/api';
import { CASE_TYPES } from '../data/mockCases';
import { initials, formatDate } from '../lib/format';

const selectStyle = {
  width: '100%',
  padding: '8px 10px',
  background: '#0f172a',
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 8,
  color: '#94a3b8',
  fontSize: 12,
  cursor: 'pointer',
  outline: 'none',
};

const labelStyle = { display: 'block', color: '#64748b', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', marginBottom: 6 };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isPolice, signOut } = useAuth();
  const { showToast } = useToast();

  const [cases, setCases] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!isPolice) {
      navigate('/login');
      return;
    }
    loadCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolice]);

  const loadCases = () => {
    fetchCases().then((res) => res?.success && setCases(res.data));
  };

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const mt = !typeFilter || c.case_type === typeFilter;
      const ms = !statusFilter || c.status === statusFilter;
      return mt && ms;
    });
  }, [cases, typeFilter, statusFilter]);

  const clearFilters = () => {
    setTypeFilter('');
    setStatusFilter('');
  };

  const handleStatusChange = async (id, status) => {
    await updateCaseStatus(id, status);
    showToast('Status updated', 'success');
    loadCases();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this case permanently?')) return;
    await deleteCase(id);
    showToast('Case deleted', 'success');
    loadCases();
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  if (!isPolice) return null;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '80px 20px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="icon-badge blue" style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0 }}>
            <Icon name="local_police" glow="blue" style={{ fontSize: 26 }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--fh)', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-.5px' }}>
              POLICE DASHBOARD
            </h2>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 2 }}>Welcome back, {user?.name || 'Officer'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '9px 18px',
            background: 'rgba(255,63,92,.1)',
            border: '1px solid rgba(255,63,92,.25)',
            borderRadius: 9,
            color: 'var(--red)',
            fontFamily: 'var(--fm)',
            fontSize: 11,
            letterSpacing: 1,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <Icon name="logout" style={{ fontSize: 16 }} />
          LOGOUT
        </button>
      </div>

      <div
        style={{
          background: 'rgba(15,23,42,.7)',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'flex-end',
        }}
      >
        <div style={{ flex: 1, minWidth: 150 }}>
          <label style={labelStyle}>COMPLAINT TYPE</label>
          <select style={selectStyle} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            {CASE_TYPES.map((ct) => (
              <option key={ct.type} value={ct.type}>
                {ct.icon} {ct.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 110 }}>
          <label style={labelStyle}>STATUS</label>
          <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="missing">Missing</option>
            <option value="investigating">Investigating</option>
            <option value="found">Found</option>
          </select>
        </div>
        <button
          onClick={clearFilters}
          style={{
            padding: '8px 14px',
            background: 'rgba(239,68,68,.1)',
            border: '1px solid rgba(239,68,68,.25)',
            borderRadius: 8,
            color: '#ef4444',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ✕ CLEAR
        </button>
      </div>

      <div style={{ background: 'rgba(15,23,42,.8)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, overflow: 'hidden' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,.07)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color: 'var(--text3)',
              fontFamily: 'var(--fm)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.08em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon name="view_list" style={{ fontSize: 14, color: 'var(--blue)' }} />
            ALL CASES — LIVE <span style={{ color: 'var(--blue)', marginLeft: 6 }}>({filtered.length})</span>
          </span>
          <button
            onClick={loadCases}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: 'rgba(26,144,245,.1)',
              border: '1px solid rgba(26,144,245,.25)',
              borderRadius: 7,
              color: 'var(--blue)',
              fontFamily: 'var(--fm)',
              fontSize: 11,
              letterSpacing: '.5px',
              cursor: 'pointer',
            }}
          >
            <Icon name="refresh" style={{ fontSize: 15 }} />
            REFRESH
          </button>
        </div>

        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          {filtered.length ? (
            filtered.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,.05)',
                }}
              >
                <div className="li-av" style={{ width: 40, height: 40, fontSize: 13, cursor: 'pointer' }} onClick={() => setSelected(c)}>
                  {initials(c.full_name || '?')}
                </div>
                <div style={{ flex: 1, minWidth: 140, cursor: 'pointer' }} onClick={() => setSelected(c)}>
                  <div style={{ color: 'var(--text)', fontSize: 13.5, fontWeight: 600 }}>{c.full_name}</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: 9.5, color: 'var(--text3)', marginTop: 2 }}>
                    {c.report_number} · {formatDate(c.created_at)}
                  </div>
                </div>
                <StatusBadge status={c.status} />
                <select
                  value={c.status}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  style={{ ...selectStyle, width: 130 }}
                >
                  <option value="missing">Missing</option>
                  <option value="investigating">Investigating</option>
                  <option value="found">Found</option>
                </select>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={{
                    background: 'rgba(255,63,92,.1)',
                    border: '1px solid rgba(255,63,92,.2)',
                    borderRadius: 7,
                    color: 'var(--red)',
                    padding: '7px 9px',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                  title="Delete case"
                >
                  <Icon name="delete_outline" style={{ fontSize: 16 }} />
                </button>
              </div>
            ))
          ) : (
            <div style={{ padding: 50, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>No cases match these filters.</div>
          )}
        </div>
      </div>

      <CaseDetailModal caseData={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
