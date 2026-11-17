// One SVG holds every status glyph; CSS shows the one matching the
// nearest [data-state] (queued, running, passed, waiting). The glyphs follow
// SF Symbols: circle, the system activity spinner, checkmark.circle.fill and
// pause.circle.fill.
const SPOKES = Array.from({ length: 12 }, (_, i) => i);

export function StageIcon() {
  return (
    <svg className="stage-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <circle className="i-ring" cx="12" cy="12" r="4" />
      <g className="i-spin">
        {SPOKES.map((i) => (
          <rect
            key={i}
            x="11.1"
            y="4.5"
            width="1.8"
            height="4.4"
            rx="0.9"
            transform={`rotate(${i * 30} 12 12)`}
            opacity={(0.18 + (0.82 * i) / 11).toFixed(2)}
          />
        ))}
      </g>
      <circle className="i-fill" cx="12" cy="12" r="12" />
      <path className="i-check" d="M7.6 12.4l3 3 5.8-6.6" pathLength="100" />
      <g className="i-pause">
        <rect x="8.6" y="7.5" width="2.3" height="9" rx="1.15" />
        <rect x="13.1" y="7.5" width="2.3" height="9" rx="1.15" />
      </g>
    </svg>
  );
}
