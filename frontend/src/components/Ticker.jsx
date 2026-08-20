import Icon from './Icon';

const ITEMS = [
  { pip: 'red', text: 'ACTIVE · Amizthan — Rayapet, Chennai · Case TB-2025-0412' },
  { pip: '', text: 'SYSTEM OPERATIONAL · 24/7 MONITORING ACTIVE' },
  { pip: 'red', text: 'ACTIVE · Anbarasou (19M) — Koothapakkam, Cuddalore · Missing 3 days' },
  { pip: 'green', text: 'FOUND SAFE · Kadaamurugan — Reunited with family · Case Closed' },
  { pip: '', text: 'INSTANT EMAIL DISPATCH · SECTION 154 CrPC COMPLIANT' },
  { pip: 'red', text: 'ACTIVE · Mohamed Farook — Coimbatore · 5 days missing' },
  { pip: 'amber', text: 'INVESTIGATING · Devi — Madurai · Police searching' },
  { pip: 'green', text: 'FOUND SAFE · Kavitha — Madurai · Family informed' },
  { pip: '', text: 'ENCRYPTED & SECURE · GOVERNMENT COMPLIANT PORTAL' },
  { pip: 'red', text: 'ACTIVE · Dhanush (8M) — Coimbatore · Critical — Please share' },
];

export default function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-badge">
        <Icon name="fiber_manual_record" style={{ fontSize: 13, color: 'var(--red)', animation: 'pip 1.5s infinite' }} />
        LIVE ALERTS
      </div>
      <div className="ticker-scroll">
        <div className="ticker-inner" id="ticker">
          {ITEMS.map((item, i) => (
            <div className="t-item" key={i}>
              <span className={`t-pip ${item.pip}`}></span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
