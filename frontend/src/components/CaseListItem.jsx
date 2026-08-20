import Icon from './Icon';
import StatusBadge from './StatusBadge';
import { initials, timeAgo, formatDate } from '../lib/format';

export default function CaseListItem({ c, isBookmarked, onOpen, onToggleBookmark, onShare, onPoster }) {
  return (
    <div className={`li ${c.status}`} onClick={() => onOpen(c.id)}>
      <div className="li-av">{initials(c.full_name)}</div>
      <div className="li-body">
        <div className="li-name">{c.full_name}</div>
        <div className="li-metas">
          {c.age && (
            <span className="li-meta">
              <Icon name="person" style={{ fontSize: 12, verticalAlign: 'middle', color: 'var(--text3)' }} />
              {c.age} yrs
            </span>
          )}
          {c.gender && <span className="li-meta">{c.gender}</span>}
          {c.blood_group && <span className="li-meta">{c.blood_group}</span>}
          {c.last_seen_location && (
            <span className="li-meta">
              <Icon name="location_on" style={{ fontSize: 12, verticalAlign: 'middle', color: 'var(--text3)' }} />
              {c.last_seen_location}
            </span>
          )}
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusBadge status={c.status} />
          {c.blood_group && (
            <span className="li-meta" style={{ fontSize: 10 }}>
              <Icon name="bloodtype" style={{ fontSize: 11, verticalAlign: 'middle', color: 'var(--red)' }} /> {c.blood_group}
            </span>
          )}
        </div>
        <div className="li-actions">
          <button
            className="li-act"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(c.id);
            }}
          >
            <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} style={{ fontSize: 13 }} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
          <button
            className="li-act wh"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
            onClick={(e) => {
              e.stopPropagation();
              onShare(c);
            }}
          >
            <Icon name="share" style={{ fontSize: 13 }} />
            WhatsApp
          </button>
          <button
            className="li-act"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
            onClick={(e) => {
              e.stopPropagation();
              onPoster(c);
            }}
          >
            <Icon name="campaign" style={{ fontSize: 13 }} />
            Poster
          </button>
        </div>
      </div>
      <div className="li-r">
        <div className="li-date">{formatDate(c.created_at)}</div>
        <div style={{ fontFamily: 'var(--fm)', fontSize: 9.5, color: 'var(--text3)', marginTop: 4 }}>{c.report_number}</div>
        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--text3)', marginTop: 4 }}>{timeAgo(c.created_at)}</div>
      </div>
    </div>
  );
}
