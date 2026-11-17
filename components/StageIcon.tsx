// One SVG holds every status glyph; CSS shows the one matching the
// nearest [data-state] (queued, running, passed, waiting): circle.dotted,
// a filled circle with a spinning three-segment ring, checkmark.circle.fill
// and pause.circle.fill.
const DOTS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  return { cx: +(12 + 6.75 * Math.sin(a)).toFixed(2), cy: +(12 - 6.75 * Math.cos(a)).toFixed(2) };
});

export function StageIcon() {
  return (
    <svg className="stage-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <g className="i-ring">
        {DOTS.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r="1" />
        ))}
      </g>
      <circle className="i-fill" cx="12" cy="12" r="12" />
      {/* drawn over the fill: a white ring broken into three arcs */}
      <circle className="i-spin" cx="12" cy="12" r="6" pathLength="100" />
      <path className="i-check" d="M7.6 12.4l3 3 5.8-6.6" pathLength="100" />
      <g className="i-pause">
        <rect x="8.6" y="7.5" width="2.3" height="9" rx="1.15" />
        <rect x="13.1" y="7.5" width="2.3" height="9" rx="1.15" />
      </g>
    </svg>
  );
}
