import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import CaseListItem from '../components/CaseListItem';
import CaseDetailModal from '../components/CaseDetailModal';
import PosterModal from '../components/PosterModal';
import { fetchCases } from '../lib/api';
import { useBookmarks } from '../hooks/useBookmarks';
import { whatsappShareForCase } from '../lib/complaint';

export default function Bookmarks() {
  const navigate = useNavigate();
  const [allCases, setAllCases] = useState([]);
  const [selected, setSelected] = useState(null);
  const [posterCase, setPosterCase] = useState(null);
  const { bookmarks, isBookmarked, toggle } = useBookmarks();

  useEffect(() => {
    fetchCases().then((res) => res?.success && setAllCases(res.data));
  }, []);

  const saved = allCases.filter((c) => bookmarks.includes(c.id));

  return (
    <div className="page-offset">
      <div className="search-header">
        <div className="sh-inner">
          <button className="back-btn" onClick={() => navigate('/')}>
            <Icon name="arrow_back" style={{ fontSize: 14 }} />
            BACK
          </button>
          <div className="sec-eyebrow" style={{ marginBottom: 10, color: 'var(--amber)' }}>
            SAVED
          </div>
          <h1 className="rp-h" style={{ marginBottom: 8 }}>
            YOUR <em style={{ color: 'var(--amber)' }}>BOOKMARKS</em>
          </h1>
          <p className="rp-sub">Cases you've saved for quick access and monitoring.</p>
        </div>
      </div>

      <div className="s-results" style={{ marginTop: 24 }}>
        {saved.length ? (
          saved.map((c) => (
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
            <Icon name="bookmark_border" style={{ fontSize: 56, display: 'block', margin: '0 auto 14px', opacity: 0.3 }} />
            <div style={{ fontFamily: 'var(--fm)', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>
              NO BOOKMARKS YET
            </div>
            <button className="btn-sec" onClick={() => navigate('/search')}>
              BROWSE CASES
            </button>
          </div>
        )}
      </div>

      <CaseDetailModal caseData={selected} open={!!selected} onClose={() => setSelected(null)} />
      <PosterModal open={!!posterCase} onClose={() => setPosterCase(null)} caseData={posterCase} />
    </div>
  );
}
