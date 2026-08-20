import { CASE_TYPES } from '../data/mockCases';

export default function CaseTypeSelector({ value, onChange }) {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto 32px', padding: '0 20px' }}>
      <div
        style={{
          color: '#64748b',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '.1em',
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        SELECT COMPLAINT TYPE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 12 }}>
        {CASE_TYPES.map((ct) => (
          <button
            type="button"
            key={ct.type}
            className={`ctype-btn ${value === ct.type ? 'active' : ''}`}
            onClick={() => onChange(ct.type)}
          >
            <span style={{ fontSize: 26 }}>{ct.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 12, color: '#f1f5f9' }}>{ct.label}</span>
            <span style={{ fontSize: 10, color: '#64748b' }}>{ct.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
