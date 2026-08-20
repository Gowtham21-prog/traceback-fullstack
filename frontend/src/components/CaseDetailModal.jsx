import Modal from './Modal';
import StatusBadge from './StatusBadge';
import Icon from './Icon';
import { initials, formatDate, timeAgo } from '../lib/format';

const FIELD_ROWS = [
  ['age', 'Age'],
  ['gender', 'Gender'],
  ['blood_group', 'Blood Group'],
  ['height', 'Height'],
  ['complexion', 'Complexion'],
  ['last_seen_location', 'Last Seen Location'],
  ['last_seen_date', 'Last Seen Date'],
  ['last_seen_wearing', 'Wearing'],
  ['police_station', 'Police Station'],
  ['reporter_name', 'Reported By'],
  ['reporter_phone', 'Reporter Phone'],
  ['reporter_relation', 'Relation'],
];

export default function CaseDetailModal({ caseData, open, onClose }) {
  if (!caseData) return null;
  const daysMissing = Math.floor((Date.now() - new Date(caseData.created_at)) / 86400000);

  return (
    <Modal open={open} onClose={onClose} large>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="li-av" style={{ width: 64, height: 64, fontSize: 22 }}>
          {initials(caseData.full_name)}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="modal-title" style={{ marginBottom: 6 }}>
            {caseData.full_name}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge status={caseData.status} />
            <span style={{ fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--text3)' }}>{caseData.report_number}</span>
            {caseData.status === 'missing' && (
              <span style={{ fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--red)' }}>{daysMissing}d missing</span>
            )}
          </div>
        </div>
      </div>

      <div className="fg" style={{ marginBottom: 12 }}>
        {FIELD_ROWS.filter(([key]) => caseData[key]).map(([key, label]) => (
          <div className="fi" key={key}>
            <label>{label}</label>
            <div style={{ color: 'var(--text)', fontSize: 14, padding: '4px 0' }}>
              {key === 'last_seen_date' ? formatDate(caseData[key]) : caseData[key]}
            </div>
          </div>
        ))}
      </div>

      {caseData.description && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', color: 'var(--text3)', fontSize: 11, marginBottom: 6 }}>ADDITIONAL DETAILS</label>
          <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.6 }}>{caseData.description}</p>
        </div>
      )}

      <div style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--text3)', marginTop: 8 }}>
        <Icon name="schedule" style={{ fontSize: 12, verticalAlign: 'middle' }} /> Filed {timeAgo(caseData.created_at)} ·{' '}
        {formatDate(caseData.created_at)}
      </div>
    </Modal>
  );
}
