// Every tick gets a label, including 0, so the origin issue from the grid doesn’t come up here. 
// If a teacher picks a tiny step on a long range, labels will crowd. 
// A later improvement is to label every nth tick, but I’d wait until you see it happen.

interface Props {
  min: number;
  max: number;
  step: number;
  width?: number; // SVG units; scales to its container
}

export default function NumberLine({ min, max, step, width = 600 }: Props) {
  // Bad data (e.g. from the LLM) shouldn't crash the page
  if (step <= 0 || max <= min) return null;

  const height = 56;
  const pad = 28;
  const lineY = 22;
  const plot = width - pad * 2;
  const sx = (v: number) => pad + ((v - min) / (max - min)) * plot;

  const ticks: number[] = [];
  const start = Math.ceil(min / step);
  const end = Math.floor(max / step);
  for (let i = start; i <= end; i++) ticks.push(Math.round(i * step * 1e6) / 1e6);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width, display: "block" }}
      role="img"
      aria-label={`Number line from ${min} to ${max}`}
    >
      {/* main line, with arrowheads at both ends */}
      <line x1={pad - 10} y1={lineY} x2={width - pad + 10} y2={lineY} stroke="#000" strokeWidth={1.5} />
      <polygon points={`${pad - 16},${lineY} ${pad - 8},${lineY - 4} ${pad - 8},${lineY + 4}`} fill="#000" />
      <polygon points={`${width - pad + 16},${lineY} ${width - pad + 8},${lineY - 4} ${width - pad + 8},${lineY + 4}`} fill="#000" />

      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={lineY - 6} x2={sx(t)} y2={lineY + 6} stroke="#000" strokeWidth={1.2} />
          <text x={sx(t)} y={lineY + 22} fontSize={11} textAnchor="middle">{t}</text>
        </g>
      ))}
    </svg>
  );
}