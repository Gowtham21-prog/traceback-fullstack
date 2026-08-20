export default function StatusBadge({ status }) {
  return <span className={`cc-badge b-${status}`}>{status?.toUpperCase()}</span>;
}
