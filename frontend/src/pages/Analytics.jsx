import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import Icon from '../components/Icon';
import { fetchCases, fetchCaseStats } from '../lib/api';
import { ageGroupLabel } from '../lib/format';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const chartOpts = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.05)' } },
    y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.05)' }, beginAtZero: true },
  },
};

export default function Analytics() {
  const [stats, setStats] = useState({ total: 0, missing: 0, found: 0, investigating: 0 });
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetchCaseStats().then((res) => res?.success && setStats(res.data));
    fetchCases().then((res) => res?.success && setCases(res.data));
  }, []);

  // Monthly trend
  const monthCounts = {};
  cases.forEach((c) => {
    const d = new Date(c.created_at);
    const key = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });
  const monthlyData = {
    labels: Object.keys(monthCounts),
    datasets: [{ label: 'Cases', data: Object.values(monthCounts), backgroundColor: '#1a90f5', borderRadius: 4 }],
  };

  // Age groups
  const ageGroups = { Child: 0, Teen: 0, Adult: 0, Senior: 0 };
  cases.forEach((c) => {
    ageGroups[ageGroupLabel(c.age)]++;
  });
  const ageData = {
    labels: Object.keys(ageGroups),
    datasets: [{ label: 'Cases', data: Object.values(ageGroups), backgroundColor: ['#00d9ff', '#1a90f5', '#7c3aed', '#f59e0b'], borderRadius: 4 }],
  };

  // Top locations
  const locCounts = {};
  cases.forEach((c) => {
    if (!c.last_seen_location) return;
    const key = c.last_seen_location.split(',').pop().trim();
    locCounts[key] = (locCounts[key] || 0) + 1;
  });
  const topLocations = Object.entries(locCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const locData = {
    labels: topLocations.map(([l]) => l),
    datasets: [{ label: 'Cases', data: topLocations.map(([, v]) => v), backgroundColor: '#00e0a0', borderRadius: 4 }],
  };

  const statCards = [
    { label: 'Total Reports', val: stats.total, icon: 'folder_open', color: 'var(--blue)' },
    { label: 'Found Safe', val: stats.found, icon: 'how_to_reg', color: 'var(--green)' },
    { label: 'Missing', val: stats.missing, icon: 'person_search', color: 'var(--red)' },
    { label: 'Investigating', val: stats.investigating, icon: 'policy', color: 'var(--amber)' },
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '80px 20px 40px' }}>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="icon-badge blue" style={{ width: 56, height: 56, borderRadius: 16, flexShrink: 0 }}>
          <Icon name="insights" glow="blue" style={{ fontSize: 28 }} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-.5px' }}>
            ANALYTICS DASHBOARD
          </h2>
          <p style={{ color: 'var(--text3)', fontFamily: 'var(--fm)', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 4 }}>
            District-wise stats · Age groups · Monthly trends
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: 'rgba(15,23,42,.8)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 18 }}>
            <Icon name={s.icon} style={{ fontSize: 22, color: s.color, marginBottom: 8 }} />
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--fh)' }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'rgba(15,23,42,.8)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: '.08em', marginBottom: 16 }}>MONTHLY TREND</h3>
          {cases.length ? <Line data={monthlyData} options={chartOpts} height={200} /> : <ChartEmpty />}
        </div>
        <div style={{ background: 'rgba(15,23,42,.8)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: '.08em', marginBottom: 16 }}>AGE GROUPS</h3>
          {cases.length ? <Bar data={ageData} options={chartOpts} height={200} /> : <ChartEmpty />}
        </div>
      </div>

      <div style={{ background: 'rgba(15,23,42,.8)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: '.08em', marginBottom: 16 }}>TOP LOCATIONS</h3>
        {topLocations.length ? <Bar data={locData} options={{ ...chartOpts, indexAxis: 'y' }} height={120} /> : <ChartEmpty />}
      </div>
    </div>
  );
}

function ChartEmpty() {
  return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)', fontSize: 12 }}>No data yet</div>;
}
