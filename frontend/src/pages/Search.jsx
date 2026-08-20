import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import CaseListItem from '../components/CaseListItem';
import CaseDetailModal from '../components/CaseDetailModal';
import PosterModal from '../components/PosterModal';
import { fetchCases } from '../lib/api';
import { useBookmarks } from '../hooks/useBookmarks';
import { matchesAgeFilter } from '../lib/format';
import { whatsappShareForCase } from '../lib/complaint';

export default function Search() {
  const navigate = useNavigate();
  const [allCases, setAllCases] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selected, setSelected] = useState(null);
  const [posterCase, setPosterCase] = useState(null);

  const { isBookmarked, toggle } = useBookmarks();

  useEffect(() => {
    fetchCases().then((res) => res?.success && setAllCases(res.data));
  }, []);

  const filtered = useMemo(() => {
    let f = allCases.filter((c) => {
      const qq = q.toLowerCase().trim();
      const mq =
        !qq ||
        c.full_name.toLowerCase().includes(qq) ||
        (c.last_seen_location || '').toLowerCase().includes(qq) ||
        c.report_number.toLowerCase().includes(qq) ||
        (c.reporter_name || '').toLowerCase().includes(qq);
      const ms = !status || c.status === status;
      const mg = !gender || c.gender === gender;
      const ma = matchesAgeFilter(c.age, ageFilter);
      return mq && ms && mg && ma;
    });
    f = [...f].sort((a, b) =>
      sortBy === 'oldest' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at)
    );
    return f;
  }, [allCases, q, status, gender, ageFilter, sortBy]);

  return (
    <div className="page-offset">
      <div className="search-header">
        <div className="sh-inner">
          <button className="back-btn" onClick={() => navigate('/')}>
            <Icon name="arrow_back" style={{ fontSize: 14 }} />
            BACK
          </button>
          <div className="sec-eyebrow" style={{ marginBottom: 10 }}>
            CASE DATABASE
          </div>
          <h1 className="rp-h" style={{ marginBottom: 8 }}>
            SEARCH MISSING <em>PERSONS</em>
          </h1>
          <p className="rp-sub">Browse all filed missing person reports. Use filters to narrow your search.</p>
        </div>
      </div>

      <div className="search-ctrl">
        <div className="sbar">
          <div className="siw">
            <Icon name="search" style={{ fontSize: 20, color: 'var(--text3)' }} />
            <input className="s-in" type="text" placeholder="Search by name, location, or case number..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="sbar2">
          <select className="s-sel" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">ALL STATUS</option>
            <option value="missing">MISSING</option>
            <option value="found">FOUND SAFE</option>
            <option value="investigating">INVESTIGATING</option>
          </select>
          <select className="s-sel" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">ALL GENDERS</option>
            <option value="Male">MALE</option>
            <option value="Female">FEMALE</option>
          </select>
          <select className="s-sel" value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
            <option value="">ALL AGES</option>
            <option value="child">CHILD (0-12)</option>
            <option value="teen">TEEN (13-17)</option>
            <option value="adult">ADULT (18-60)</option>
            <option value="senior">SENIOR (60+)</option>
          </select>
          <button className={`sort-btn ${sortBy === 'newest' ? 'on' : ''}`} onClick={() => setSortBy('newest')}>
            NEWEST FIRST
          </button>
          <button className={`sort-btn ${sortBy === 'oldest' ? 'on' : ''}`} onClick={() => setSortBy('oldest')}>
            OLDEST FIRST
          </button>
        </div>
      </div>

      <div className="s-meta">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="manage_search" style={{ fontSize: 14, color: 'var(--blue)' }} />
          {filtered.length} CASE{filtered.length !== 1 ? 'S' : ''} FOUND
        </span>
      </div>

      <div className="s-results">
        {filtered.length ? (
          filtered.map((c) => (
            <CaseListItem
              key={c.id}
              c={c}
              isBookmarked={isBookmarked(c.id)}
              onOpen={() => setSelected(c)}
              onToggleBookmark={toggle}
              onShare={whatsappShareForCase}
              onPoster={setPosterCase}
            />
          ))
        ) : (
          <div style={{ padding: 70, textAlign: 'center', color: 'var(--text3)' }}>
            <Icon name="search_off" style={{ fontSize: 56, display: 'block', marginBottom: 14, opacity: 0.3 }} />
            <div style={{ fontFamily: 'var(--fm)', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              NO CASES MATCH YOUR SEARCH
            </div>
          </div>
        )}
      </div>

      <CaseDetailModal caseData={selected} open={!!selected} onClose={() => setSelected(null)} />
      <PosterModal open={!!posterCase} onClose={() => setPosterCase(null)} caseData={posterCase} />
    </div>
  );
}
