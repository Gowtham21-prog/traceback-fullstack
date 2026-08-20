export default function Icon({ name, className = '', style, glow }) {
  const glowClass = glow ? `mi-glow-${glow}` : '';
  return (
    <span className={`material-icons-round ${glowClass} ${className}`.trim()} style={style}>
      {name}
    </span>
  );
}
