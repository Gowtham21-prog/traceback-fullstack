import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import ParticleCanvas from '../components/ParticleCanvas';
import EmergencyStrip from '../components/EmergencyStrip';
import Footer from '../components/Footer';
import CaseDetailModal from '../components/CaseDetailModal';
import { fetchCases, fetchCaseStats } from '../lib/api';
import { initials, formatDate } from '../lib/format';
import StatusBadge from '../components/StatusBadge';

const STEPS = [
  {
    num: '01',
    icon: 'edit_document',
    glow: 'blue',
    title: 'Fill the Form',
    desc: "Enter complete details — physical description, last seen location, and circumstances. Upload a recent photo for identification.",
  },
  {
    num: '02',
    icon: 'location_searching',
    glow: 'cyan',
    title: 'Select Station',
    desc: 'Detect your location to auto-find nearest police stations, or select manually. We map jurisdiction automatically.',
  },
  {
    num: '03',
    icon: 'send',
    glow: 'green',
    title: 'Complaint Dispatched',
    desc: 'A professionally formatted complaint under Section 154 CrPC is instantly emailed. You get a unique case number to track updates.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({ total: 0, missing: 0, found: 0, investigating: 0, today: 0 });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchCases().then((res) => res?.success && setCases(res.data.slice(0, 6)));
    fetchCaseStats().then((res) => res?.success && setStats(res.data));
  }, []);

  const barMax = Math.max(stats.missing, stats.found, stats.investigating, 1);
  const bars = [
    { label: 'Missing', val: stats.missing, color: 'var(--red)' },
    { label: 'Found', val: stats.found, color: 'var(--green)' },
    { label: 'Investigating', val: stats.investigating, color: 'var(--amber)' },
  ];

  return (
    <>
      <section className="hero">
        <ParticleCanvas />
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="grid-ov"></div>
        <div className="bracket bracket-tl"></div>
        <div className="bracket bracket-tr"></div>
        <div className="bracket bracket-bl"></div>
        <div className="bracket bracket-br"></div>

        <div className="hero-inner">
          <div>
            <div className="hero-tag">
              <span className="tag-chip">LIVE</span>
              <span className="tag-txt">National Missing Persons Registry · Tamil Nadu</span>
            </div>
            <h1 className="hero-h">
              <span className="h-w1">EVERY</span>
              <span className="h-w2">SECOND</span>
              <span className="h-w3">MATTERS.</span>
            </h1>
            <p className="hero-p">
              File a missing person complaint in minutes. Our system instantly dispatches a formal police complaint to
              the nearest station — because finding someone starts with a single report.
            </p>
            <div className="hero-ctas">
              <button className="btn-pri" onClick={() => navigate('/report')}>
                <Icon name="crisis_alert" style={{ fontSize: 18 }} />
                FILE A REPORT
              </button>
              <button className="btn-ghost" onClick={() => navigate('/search')}>
                <Icon name="manage_search" style={{ fontSize: 18 }} />
                SEARCH CASES
              </button>
              <button
                className="btn-ghost"
                style={{ borderColor: 'rgba(168,85,247,.3)', color: 'var(--purple)' }}
                onClick={() => navigate('/tracker')}
              >
                <Icon name="my_location" style={{ fontSize: 18 }} />
                TRACK CASE
              </button>
            </div>
            <div className="hero-stats">
              <div className="h-stat">
                <div className="hn">{stats.total}</div>
                <div className="hl">Total Reports</div>
              </div>
              <div className="h-stat">
                <div className="hn">{stats.found}</div>
                <div className="hl">Found Safe</div>
              </div>
              <div className="h-stat">
                <div className="hn">{stats.missing}</div>
                <div className="hl">Active Cases</div>
              </div>
              <div className="h-stat">
                <div className="hn">{stats.today}</div>
                <div className="hl">New Today</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="term-card">
              <div className="term-scan"></div>
              <div className="term-top">
                <div className="term-dots">
                  <div className="td"></div>
                  <div className="td"></div>
                  <div className="td"></div>
                </div>
                <div className="term-lbl">
                  SYSTEM MONITOR<span className="term-status">OPERATIONAL</span>
                </div>
              </div>
              <div className="term-body">
                <div className="t-row">
                  <span className="t-key">STATUS</span>
                  <span className="t-val g">
                    <div className="t-live">
                      <div className="tld tld-g"></div>ONLINE
                    </div>
                  </span>
                </div>
                <div className="t-row">
                  <span className="t-key">COVERAGE</span>
                  <span className="t-val">Tamil Nadu, India</span>
                </div>
                <div className="t-row">
                  <span className="t-key">ALERT LEVEL</span>
                  <span className="t-val r">
                    <div className="t-live">
                      <div className="tld tld-r"></div>ACTIVE
                    </div>
                  </span>
                </div>
                <div className="t-row">
                  <span className="t-key">STATIONS LINKED</span>
                  <span className="t-val c">8+ Connected</span>
                </div>
                <div className="t-row">
                  <span className="t-key">DISPATCH</span>
                  <span className="t-val">Instant Email + mailto</span>
                </div>
                <div className="t-row">
                  <span className="t-key">ENCRYPTION</span>
                  <span className="t-val g">
                    <div className="t-live">
                      <div className="tld tld-g"></div>SECURED
                    </div>
                  </span>
                </div>
                <div className="t-row">
                  <span className="t-key">ACTIVE CASES</span>
                  <span className="t-val a">{stats.missing || '—'}</span>
                </div>
                <div className="t-row">
                  <span className="t-key">LAST UPDATED</span>
                  <span className="t-val">{new Date().toLocaleTimeString('en-IN')}</span>
                </div>
              </div>
              <div className="term-foot">
                <span className="term-id">TB-PORTAL-v4.0 · 2025</span>
                <div className="t-live" style={{ fontFamily: 'var(--fm)', fontSize: 9.5, color: 'var(--green)' }}>
                  <div className="tld tld-g"></div>LIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS DASHBOARD */}
      <section className="sec">
        <div className="sec-wrap">
          <div className="sec-head rv">
            <div className="sec-eyebrow">LIVE STATISTICS</div>
            <h2 className="sec-h">
              PORTAL <em>DASHBOARD</em>
            </h2>
            <p className="sec-p">Real-time case statistics and activity monitoring across Tamil Nadu.</p>
          </div>
          <div className="stats-grid rv">
            <div className="stat-card blue rv">
              <div className="stat-icon">
                <Icon name="folder_open" />
              </div>
              <div className="stat-n">{stats.total}</div>
              <div className="stat-l">Total Reports Filed</div>
              <div className="stat-trend up">↑ Updated live</div>
            </div>
            <div className="stat-card green rv">
              <div className="stat-icon">
                <Icon name="how_to_reg" />
              </div>
              <div className="stat-n">{stats.found}</div>
              <div className="stat-l">Persons Found Safe</div>
              <div className="stat-trend">Recovery rate</div>
            </div>
            <div className="stat-card red rv">
              <div className="stat-icon">
                <Icon name="person_search" />
              </div>
              <div className="stat-n">{stats.missing}</div>
              <div className="stat-l">Active Missing Cases</div>
              <div className="stat-trend dn">Requires attention</div>
            </div>
            <div className="stat-card amber rv">
              <div className="stat-icon">
                <Icon name="policy" />
              </div>
              <div className="stat-n">{stats.investigating}</div>
              <div className="stat-l">Under Investigation</div>
              <div className="stat-trend">Police actively searching</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="rv">
            <div className="chart-wrap">
              <div className="chart-title">Cases by Status</div>
              <div className="bar-chart">
                {bars.map((b) => (
                  <div className="bar-item" key={b.label}>
                    <div className="bar-val">{b.val}</div>
                    <div
                      className="bar-col"
                      style={{
                        height: Math.max((b.val / barMax) * 90, 4),
                        background: `linear-gradient(180deg,${b.color},transparent)`,
                      }}
                    ></div>
                    <div className="bar-lbl">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-wrap">
              <div className="chart-title">Age Distribution of Missing Persons</div>
              <div className="bar-chart">
                {(() => {
                  const groups = { Child: 0, Teen: 0, Adult: 0, Senior: 0 };
                  cases.forEach((c) => {
                    const a = parseInt(c.age, 10) || 0;
                    if (a <= 12) groups.Child++;
                    else if (a <= 17) groups.Teen++;
                    else if (a <= 60) groups.Adult++;
                    else groups.Senior++;
                  });
                  const mx = Math.max(...Object.values(groups), 1);
                  return Object.entries(groups).map(([k, v]) => (
                    <div className="bar-item" key={k}>
                      <div className="bar-val">{v}</div>
                      <div className="bar-col" style={{ height: Math.max((v / mx) * 90, 4) }}></div>
                      <div className="bar-lbl">{k}</div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sec sec-alt" id="hiw">
        <div className="sec-wrap">
          <div className="sec-head rv">
            <div className="sec-eyebrow">PROCESS</div>
            <h2 className="sec-h">
              HOW IT <em>WORKS</em>
            </h2>
            <p className="sec-p">Three steps to file an official complaint with your nearest police station.</p>
          </div>
          <div className="steps-wrap rv">
            {STEPS.map((s) => (
              <div className="step-c" key={s.num}>
                <div className="step-bar"></div>
                <div className="step-ghost">{s.num}</div>
                <div className={`step-ico icon-badge ${s.glow}`}>
                  <Icon name={s.icon} glow={s.glow} style={{ fontSize: 28 }} />
                </div>
                <div className="step-num">STEP {s.num}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVE CASES */}
      <section className="sec">
        <div className="sec-wrap">
          <div className="sec-head rv">
            <div className="sec-eyebrow">DATABASE</div>
            <h2 className="sec-h">
              ACTIVE <em>CASES</em>
            </h2>
            <p className="sec-p">Recent missing person reports filed through our portal. Click any card to view full details.</p>
          </div>
          <div className="cards-grid">
            {cases.map((c) => (
              <div className={`cc ${c.status}`} key={c.id} onClick={() => setSelected(c)}>
                <div className="cc-top">
                  <div className="cc-av">{initials(c.full_name)}</div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="cc-name">{c.full_name}</div>
                <div className="cc-sub">
                  {c.age && `${c.age} yrs · `}
                  {c.gender}
                </div>
                <div className="cc-rows">
                  <div className="cc-row">
                    <Icon name="location_on" style={{ fontSize: 13, color: 'var(--text3)' }} />
                    {c.last_seen_location}
                  </div>
                </div>
                <div className="cc-foot">
                  <span className="cc-id">{c.report_number}</span>
                  <span className="cc-id">{formatDate(c.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="sec-cta rv">
            <button className="btn-sec" onClick={() => navigate('/search')}>
              VIEW ALL CASES
              <Icon name="arrow_forward" style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </section>

      <EmergencyStrip />
      <Footer />

      <CaseDetailModal caseData={selected} open={!!selected} onClose={() => setSelected(null)} />
    </>
  );
}
