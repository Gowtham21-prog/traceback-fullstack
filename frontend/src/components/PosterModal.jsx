import { useRef } from 'react';
import Modal from './Modal';
import Icon from './Icon';
import { useToast } from '../hooks/useToast';
import { posterText, printPosterElement, whatsappShareForCase } from '../lib/complaint';
import { formatDate } from '../lib/format';

export default function PosterModal({ open, onClose, caseData }) {
  const posterRef = useRef(null);
  const { showToast } = useToast();
  if (!caseData) return null;

  const copyText = () => {
    navigator.clipboard
      .writeText(posterText(caseData))
      .then(() => showToast('Poster text copied!', 'success'))
      .catch(() => {});
  };

  return (
    <Modal open={open} onClose={onClose} large>
      <div className="cd-eye" style={{ marginBottom: 8 }}>
        AWARENESS TOOL
      </div>
      <div className="modal-title" style={{ fontSize: 20, marginBottom: 4 }}>
        Missing Person Poster
      </div>
      <p className="modal-sub" style={{ marginBottom: 20 }}>
        Shareable awareness poster for social media and community notice boards.
      </p>

      <div className="poster-preview" ref={posterRef}>
        <div className="poster-alert">⚠️ MISSING PERSON ⚠️</div>
        <div className="poster-img">
          {caseData.photo ? (
            <img src={caseData.photo} alt="missing person" />
          ) : (
            <Icon name="person" style={{ fontSize: 60, color: '#9ca3af' }} />
          )}
        </div>
        <div className="poster-name">{caseData.full_name}</div>
        <div className="poster-sub">
          {caseData.age ? `Age ${caseData.age}` : ''}
          {caseData.gender ? ` · ${caseData.gender}` : ''}
          {caseData.blood_group ? ` · Blood: ${caseData.blood_group}` : ''}
        </div>
        <div className="poster-details">
          {caseData.last_seen_date && (
            <div className="pd-item">
              <div className="pd-key">LAST SEEN DATE</div>
              <div className="pd-val">{caseData.last_seen_date}</div>
            </div>
          )}
          {caseData.last_seen_location && (
            <div className="pd-item" style={{ gridColumn: '1/-1' }}>
              <div className="pd-key">LAST SEEN LOCATION</div>
              <div className="pd-val">{caseData.last_seen_location}</div>
            </div>
          )}
          {caseData.last_seen_wearing && (
            <div className="pd-item" style={{ gridColumn: '1/-1' }}>
              <div className="pd-key">WAS WEARING</div>
              <div className="pd-val">{caseData.last_seen_wearing}</div>
            </div>
          )}
          {caseData.height && (
            <div className="pd-item">
              <div className="pd-key">HEIGHT</div>
              <div className="pd-val">{caseData.height}</div>
            </div>
          )}
          {caseData.complexion && (
            <div className="pd-item">
              <div className="pd-key">COMPLEXION</div>
              <div className="pd-val">{caseData.complexion}</div>
            </div>
          )}
          {caseData.identifying_marks && (
            <div className="pd-item" style={{ gridColumn: '1/-1' }}>
              <div className="pd-key">IDENTIFYING MARKS</div>
              <div className="pd-val">{caseData.identifying_marks}</div>
            </div>
          )}
        </div>
        <div className="poster-contact">
          <p>IF YOU HAVE INFORMATION, PLEASE CONTACT:</p>
          <strong>📞 {caseData.reporter_phone || 'Police: 100'}</strong>
          {caseData.reporter_name && (
            <p style={{ fontSize: 11, marginTop: 4 }}>
              {caseData.reporter_name} ({caseData.reporter_relation || 'Family'})
            </p>
          )}
          <p style={{ fontSize: 11, marginTop: 6, opacity: 0.8 }}>
            OR CALL POLICE: 100 | CHILD HELPLINE: 1098 | EMERGENCY: 112
          </p>
        </div>
        <div className="poster-case">
          Case: {caseData.report_number} · TraceBack Portal · Filed: {formatDate(caseData.created_at)}
        </div>
      </div>

      <div className="poster-btns" style={{ marginTop: 16 }}>
        <button
          className="btn-pri"
          style={{
            padding: '12px 20px',
            fontSize: 12,
            background: 'rgba(0,217,255,.12)',
            color: 'var(--cyan)',
            boxShadow: 'none',
            border: '1px solid rgba(0,217,255,.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
          }}
          onClick={copyText}
        >
          <Icon name="content_copy" style={{ fontSize: 16 }} />
          COPY TEXT
        </button>
        <button
          className="btn-pri"
          style={{
            padding: '12px 20px',
            fontSize: 12,
            background: 'rgba(37,211,102,.1)',
            color: '#25d366',
            boxShadow: 'none',
            border: '1px solid rgba(37,211,102,.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
          }}
          onClick={() => whatsappShareForCase(caseData)}
        >
          <Icon name="share" style={{ fontSize: 16 }} />
          SHARE VIA WHATSAPP
        </button>
        <button
          className="btn-pri"
          style={{
            padding: '12px 20px',
            fontSize: 12,
            background: 'rgba(168,85,247,.1)',
            color: 'var(--purple)',
            boxShadow: 'none',
            border: '1px solid rgba(168,85,247,.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
          }}
          onClick={() => printPosterElement(posterRef.current)}
        >
          <Icon name="print" style={{ fontSize: 16 }} />
          PRINT POSTER
        </button>
      </div>
    </Modal>
  );
}
