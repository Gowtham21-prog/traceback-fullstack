export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

export function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ageGroupLabel(age) {
  const a = parseInt(age, 10) || 0;
  if (a <= 12) return 'Child';
  if (a <= 17) return 'Teen';
  if (a <= 60) return 'Adult';
  return 'Senior';
}

export function matchesAgeFilter(age, filter) {
  if (!filter) return true;
  const a = parseInt(age, 10) || 0;
  if (filter === 'child') return a <= 12;
  if (filter === 'teen') return a >= 13 && a <= 17;
  if (filter === 'adult') return a >= 18 && a <= 60;
  if (filter === 'senior') return a > 60;
  return true;
}
