import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="foot-brand">
          <div className="logo" onClick={() => navigate('/')} style={{ gap: 9 }}>
            <div className="logo-mark" style={{ width: 30, height: 30 }}>
              <svg viewBox="0 0 38 38" fill="none">
                <polygon
                  points="19,2 34,10.5 34,27.5 19,36 4,27.5 4,10.5"
                  stroke="#1a90f5"
                  strokeWidth="1.5"
                  fill="rgba(26,144,245,0.06)"
                />
                <circle cx="19" cy="19" r="4.5" fill="#1a90f5" />
              </svg>
            </div>
            <span className="logo-name" style={{ fontSize: 17 }}>
              TRACE<span>BACK</span>
            </span>
          </div>
          <p>
            Helping reunite families across Tamil Nadu and India. Built for humanitarian purposes. All information
            handled with strict confidentiality.
          </p>
        </div>

        <div className="foot-col">
          <h4>Portal</h4>
          <a onClick={() => navigate('/report')} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="assignment_add" style={{ fontSize: 14 }} />
            File a Report
          </a>
          <a onClick={() => navigate('/search')} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="manage_search" style={{ fontSize: 14 }} />
            Search Cases
          </a>
          <a onClick={() => navigate('/tracker')} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="track_changes" style={{ fontSize: 14 }} />
            Track Your Case
          </a>
          <a onClick={() => navigate('/bookmarks')} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="bookmarks" style={{ fontSize: 14 }} />
            Bookmarks
          </a>
        </div>

        <div className="foot-col">
          <h4>Emergency Lines</h4>
          <a href="tel:100" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="local_police" style={{ fontSize: 14 }} />
            Police — 100
          </a>
          <a href="tel:1098" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="child_care" style={{ fontSize: 14 }} />
            Child Helpline — 1098
          </a>
          <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="emergency" style={{ fontSize: 14 }} />
            Emergency — 112
          </a>
          <a href="tel:1091" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="woman" style={{ fontSize: 14 }} />
            Women — 1091
          </a>
          <a href="tel:181" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="support_agent" style={{ fontSize: 14 }} />
            Women Helpline — 181
          </a>
        </div>
      </div>

      <div className="foot-bot">
        <p>© 2025 TraceBack Portal · All data handled confidentially · Humanitarian use only</p>
        <p>Section 154 CrPC Compliant · Tamil Nadu Coverage</p>
      </div>
    </footer>
  );
}
