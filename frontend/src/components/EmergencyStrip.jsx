import Icon from './Icon';

export default function EmergencyStrip() {
  return (
    <div className="emg rv">
      <div className="emg-l">
        <div className="emg-tag">
          <Icon name="fiber_manual_record" style={{ fontSize: 13, color: 'var(--red)', animation: 'pip 1.5s infinite' }} />
          EMERGENCY
        </div>
        <h2 className="emg-h">
          SOMEONE MISSING
          <br />
          RIGHT NOW?
        </h2>
        <p className="emg-p">
          Call Police immediately for an active emergency. Use this portal to file a formal complaint and receive an
          official case number under Section 154 CrPC.
        </p>
      </div>
      <div className="emg-btns">
        <a href="tel:100" className="btn-call" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <Icon name="call" style={{ fontSize: 16 }} />
          POLICE — 100
        </a>
        <a href="tel:1098" className="btn-call" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <Icon name="child_care" style={{ fontSize: 16 }} />
          CHILD — 1098
        </a>
        <a href="tel:112" className="btn-call bl" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <Icon name="emergency" style={{ fontSize: 16 }} />
          EMERGENCY — 112
        </a>
        <a href="tel:1091" className="btn-call" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <Icon name="support_agent" style={{ fontSize: 16 }} />
          WOMEN — 1091
        </a>
        <button
          className="btn-call wh"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
          onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent('TraceBack SOS — please help spread the word.'), '_blank')}
        >
          <Icon name="send" style={{ fontSize: 16 }} />
          WHATSAPP SOS
        </button>
      </div>
    </div>
  );
}
