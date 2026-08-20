import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';
import CaseDetailModal from '../components/CaseDetailModal';
import { fetchCases } from '../lib/api';
import { initials, formatDate, timeAgo } from '../lib/format';

const RECENT_KEY = 'tb_recent_tracked';

export default function Tracker() {
  const navigate = useNavigate();
  const [allCases, setAllCases] = useState([]);
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null); // null = no search yet
  const [selected, setSelected] = useState(null);
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchCases().then((res) => res?.success && setAllCases(res.data));
  }, []);

  useEffect(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) {
      setResults(null);
      return;
    }
    const matches = allCases.filter(
      (c) => c.report_number.toLowerCase().includes(qq) || c.full_name.toLowerCase().includes(qq)
    );
    setResults(matches);
  }, [q, allCases]);

  const openCase = (c) => {
    setSelected(c);
    setRecent((prev) => {
      const next = [c.report_number, ...prev.filter((r) => r !== c.report_number)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const recentCases = recent.map((rn) => allCases.find((c) => c.report_number === rn)).filter(Boolean);

  const timelineFor = (c) => {
    const steps = [
      { key: 'filed', label: 'Report Filed', done: true, date: c.created_at },
      { key: 'investigating', label: 'Under Investigation', done: c.status === 'investigating' || c.status === 'found' },
      { key: 'found', label: c.status === 'found' ? 'Person Found Safe' : 'Case Resolution', done: c.status === 'found' },
    ];
    return steps;
  };

  return (
    <div className="page-offset">
      <div className="tracker-header">
        <div className="rp-inner">
          <button className="back-btn" onClick={() => navigate('/')}>
            <Icon name="arrow_back" style={{ fontSize: 14 }} />
            BACK
          </button>
          <div className="sec-eyebrow" style={{ marginBottom: 10, color: 'var(--purple)' }}>
            CASE TRACKER
          </div>
          <h1 className="rp-h" style={{ marginBottom: 8 }}>
            TRACK YOUR <em style={{ color: 'var(--purple)' }}>CASE</em>
          </h1>
          <p className="rp-sub">Enter your case number or the missing person's name to view status and updates.</p>
        </div>
      </div>

      <div className="tracker-inner">
        <div className="track-box">
          <div className="fsh-title" style={{ marginBottom: 8 }}>
            Search Your Case
          </div>
          <div className="fsh-sub" style={{ marginBottom: 20 }}>
            Enter the case number (e.g. TB-2025-1234) or the missing person's name
          </div>
          <div className="track-input-row">
            <input
              className="track-input"
              type="text"
              placeholder="TB-2025-XXXX or Person's Name..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn-track" onClick={() => setQ((v) => v)}>
              <Icon name="my_location" style={{ fontSize: 18 }} />
              TRACK
            </button>
          </div>

          {results !== null && (
            <div style={{ marginTop: 24 }}>
              {results.length === 0 ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text3)' }}>
                  <Icon name="search_off" style={{ fontSize: 40, display: 'block', margin: '0 auto 10px', opacity: 0.4 }} />
                  No case found matching "{q}"
                </div>
              ) : (
                results.map((c) => (
                  <div key={c.id} className="track-result" onClick={() => openCase(c)} style={{ cursor: 'pointer', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
                      <div className="li-av">{initials(c.full_name)}</div>
                      <div style={{ flex: 1 }}>
                        <div className="cd-name">{c.full_name}</div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 10.5, color: 'var(--text3)', marginTop: 3 }}>{c.report_number}</div>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>

                    <div className="timeline" style={{ position: 'relative', paddingLeft: 21 }}>
                      {timelineFor(c).map((step, i) => (
                        <div className="tl-item" key={step.key}>
                          <div className={`tl-dot ${step.done ? 'green' : ''}`}></div>
                          {i === 0 && <div className="tl-date">{formatDate(step.date)} · {timeAgo(step.date)}</div>}
                          <div className="tl-text" style={{ color: step.done ? 'var(--text)' : 'var(--text3)', fontSize: 13 }}>
                            {step.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {recentCases.length > 0 && (
          <div className="track-box">
            <div className="fsh-title" style={{ marginBottom: 16, fontSize: 16 }}>
              Recent Cases
            </div>
            {recentCases.map((c) => (
              <div
                key={c.id}
                onClick={() => openCase(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,.05)',
                  cursor: 'pointer',
                }}
              >
                <div className="li-av" style={{ width: 38, height: 38, fontSize: 13 }}>
                  {initials(c.full_name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{c.full_name}</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: 9.5, color: 'var(--text3)' }}>{c.report_number}</div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <CaseDetailModal caseData={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
