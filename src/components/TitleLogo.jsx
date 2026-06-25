export function TitleLogo() {
  const letters = 'SEQUENCE'.split('')
  const opacities = [0.22, 0.36, 0.49, 0.61, 0.72, 0.82, 0.92, 1.0]

  return (
    <svg
      viewBox="0 0 176 40"
      height="34"
      aria-label="Sequence"
      style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}
    >
      <text y="34" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="32">
        {letters.map((l, i) => (
          <tspan key={i} fill="#ff6b4a" fillOpacity={opacities[i]}>{l}</tspan>
        ))}
      </text>
    </svg>
  )
}
