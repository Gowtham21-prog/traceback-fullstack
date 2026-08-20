import { useState } from 'react';
import Icon from '../Icon';

export default function StepReporter({ data, onChange, onBack, onSubmit, submitting }) {
  const [terms, setTerms] = useState(false);
  const set = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  return (
    <div className="fstep on" data-step="4">
      <div className="fsh">
        <div className="fsh-num">04 / 04</div>
        <div className="fsh-title">Your Contact Details</div>
        <div className="fsh-sub">Police will contact you with updates and for follow-up</div>
      </div>

      <div className="callout">
        <Icon name="info" style={{ fontSize: 20, color: 'var(--blue)', flexShrink: 0 }} />
        <p>
          <strong>How submission works:</strong> Clicking Submit opens your email app with a fully formatted missing
          person complaint for the selected police station. <strong>On mobile</strong>, this opens instantly.{' '}
          <strong>On desktop</strong>, use "Copy Complaint" to copy and paste manually. You'll also receive a unique
          case number to track this report.
        </p>
      </div>

      <div className="fg">
        <div className="fi full">
          <label>
            YOUR FULL NAME <span className="req">*</span>
          </label>
          <input type="text" value={data.name || ''} onChange={set('name')} placeholder="Your full name" required />
        </div>
        <div className="fi">
          <label>
            YOUR PHONE <span className="req">*</span>
          </label>
          <input type="tel" value={data.phone || ''} onChange={set('phone')} placeholder="10-digit mobile number" required />
        </div>
        <div className="fi">
          <label>ALTERNATE PHONE</label>
          <input type="tel" value={data.phone2 || ''} onChange={set('phone2')} placeholder="Another number police can reach" />
        </div>
        <div className="fi">
          <label>YOUR EMAIL</label>
          <input type="email" value={data.email || ''} onChange={set('email')} placeholder="your@email.com" />
        </div>
        <div className="fi">
          <label>RELATION TO MISSING PERSON</label>
          <select value={data.relation || ''} onChange={set('relation')}>
            <option value="">Select</option>
            {['Parent', 'Spouse', 'Sibling', 'Child', 'Relative', 'Friend', 'Neighbour', 'Guardian', 'Other'].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="fi full">
          <label>YOUR ADDRESS</label>
          <textarea rows="2" value={data.address || ''} onChange={set('address')} placeholder="Your full address for correspondence"></textarea>
        </div>
      </div>

      <div className="callout warn" style={{ marginTop: 20 }}>
        <Icon name="warning_amber" style={{ fontSize: 20, color: 'var(--amber)', flexShrink: 0 }} />
        <p>
          <strong>Also share via WhatsApp:</strong> After filing, use the "Share on WhatsApp" button to broadcast this
          case to your contacts — wider sharing increases chances of finding the person.
        </p>
      </div>

      <div className="decl">
        <label className="decl-row">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          <div className="dbox"></div>
          <div className="decl-txt">
            I declare that the information provided is true and accurate to the best of my knowledge. I understand
            that filing a false report is punishable under <strong>Section 182 IPC</strong>.
          </div>
        </label>
      </div>

      <div className="sn">
        <button type="button" className="btn-prev" onClick={onBack}>
          <Icon name="arrow_back" />
          BACK
        </button>
        <button type="button" className="btn-submit" disabled={submitting} onClick={() => onSubmit(data, terms)}>
          <Icon name="send" style={{ fontSize: 18 }} />
          {submitting ? 'SENDING...' : 'SEND COMPLAINT'}
        </button>
      </div>
    </div>
  );
}
