// One SVG holds every status glyph; CSS shows the one matching the
// nearest [data-state] (queued, running, passed, waiting): a grey disc with
// a white ring broken into three arcs, a spinning progress arc over a faint
// track, checkmark.circle.fill and pause.circle.fill.
export function StageIcon() {
  return (
    <svg className="stage-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <g className="i-ring">
        <circle className="i-ring-disc" cx="12" cy="12" r="12" />
        <circle className="i-ring-arcs" cx="12" cy="12" r="6" pathLength="100" />
      </g>
      <g className="i-spin">
        <circle className="i-track" cx="12" cy="12" r="7.5" />
        <circle className="i-arc" cx="12" cy="12" r="7.5" pathLength="100" />
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
