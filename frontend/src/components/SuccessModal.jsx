import Modal from './Modal';
import Icon from './Icon';
import { useToast } from '../hooks/useToast';
import { printComplaint } from '../lib/complaint';

export default function SuccessModal({ open, onClose, caseNo, complaintText, onViewCases, onGoHome, onMakePoster, onWhatsApp }) {
  const { showToast } = useToast();

  const copyCaseNumber = () => {
    navigator.clipboard
      .writeText(caseNo)
      .then(() => showToast('Case number copied!', 'success'))
      .catch(() => {});
  };

  const copyFullComplaint = () => {
    if (!complaintText) return showToast('No complaint data available.', 'warn');
    navigator.clipboard
      .writeText(complaintText)
      .then(() => showToast('📋 Complaint copied! Paste into email or WhatsApp.', 'success'))
      .catch(() => {});
  };

  return (
    <Modal open={open} onClose={onClose} showClose={false}>
      <div className="modal-ico">
        <Icon name="task_alt" style={{ fontSize: 36, color: 'var(--green)', filter: 'drop-shadow(0 0 16px rgba(0,224,160,.6))' }} />
      </div>
      <div className="modal-title">REPORT FILED ✓</div>
      <p className="modal-sub">
        Your complaint has been prepared. Your email app should have opened — if not, use the "Copy Complaint" button to
        paste it manually.
      </p>
      <div className="modal-code" style={{ cursor: 'pointer' }} onClick={copyCaseNumber} title="Click to copy">
        {caseNo}
      </div>
      <p className="modal-note" style={{ marginBottom: 16 }}>
        ↑ Click case number to copy · Save it to track your case
      </p>
      <div className="modal-btns">
        <button
          className="btn-pri"
          style={{
            padding: '12px 18px',
            fontSize: 11,
            background: 'rgba(0,217,255,.12)',
            color: 'var(--cyan)',
            boxShadow: 'none',
            border: '1px solid rgba(0,217,255,.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
          }}
          onClick={copyFullComplaint}
        >
          <Icon name="content_copy" style={{ fontSize: 16 }} />
          COPY COMPLAINT
        </button>
        <button
          className="btn-pri"
          style={{
            padding: '12px 18px',
            fontSize: 11,
            background: 'rgba(37,211,102,.12)',
            color: '#25d366',
            boxShadow: 'none',
            border: '1px solid rgba(37,211,102,.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
          }}
          onClick={onWhatsApp}
        >
          <Icon name="share" style={{ fontSize: 16 }} />
          WHATSAPP
        </button>
        <button
          className="btn-pri"
          style={{
            padding: '12px 18px',
            fontSize: 11,
            background: 'rgba(26,144,245,.1)',
            color: 'var(--blue)',
            boxShadow: 'none',
            border: '1px solid rgba(26,144,245,.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
          }}
          onClick={() => printComplaint(caseNo, complaintText)}
        >
          <Icon name="print" style={{ fontSize: 16 }} />
          PRINT
        </button>
        <button
          className="btn-pri"
          style={{
            padding: '12px 18px',
            fontSize: 11,
            background: 'rgba(168,85,247,.1)',
            color: 'var(--purple)',
            boxShadow: 'none',
            border: '1px solid rgba(168,85,247,.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
          }}
          onClick={onMakePoster}
        >
          <Icon name="campaign" style={{ fontSize: 16 }} />
          MAKE POSTER
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
        <button className="btn-sec" style={{ padding: '10px 18px', fontSize: 10 }} onClick={onViewCases}>
          VIEW CASES
        </button>
        <button className="btn-sec" style={{ padding: '10px 18px', fontSize: 10 }} onClick={onGoHome}>
          HOME
        </button>
      </div>
    </Modal>
  );
}
