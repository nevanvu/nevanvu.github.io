// One SVG holds every status glyph; CSS shows the one matching the
// nearest [data-state] (queued, running, passed, waiting).
export function StageIcon() {
  return (
    <svg className="stage-icon" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
      <circle className="i-ring" cx="10" cy="10" r="8.25" />
      <circle className="i-arc" cx="10" cy="10" r="8.25" pathLength="100" />
      <circle className="i-fill" cx="10" cy="10" r="9" />
      <path className="i-check" d="M6 10.4l2.7 2.7L14.2 7.4" pathLength="100" />
      <g className="i-pause">
        <rect x="7" y="6.5" width="2" height="7" rx="1" />
        <rect x="11" y="6.5" width="2" height="7" rx="1" />
      </g>
    </svg>
  );
}
