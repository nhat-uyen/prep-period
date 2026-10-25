interface Props {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  step: number;
  showAxes?: boolean;
  size?: number; // SVG units; the image scales to its container
}

export default function CoordinateGrid({ xMin, xMax, yMin, yMax, step, showAxes = true, size = 360, }: Props) {
  if (step <= 0 || xMax <= xMin || yMax <= yMin) return null;

  const pad = 24;
  const plot = size - pad * 2;

  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * plot;
  const sy = (y: number) => pad + ((yMax - y) / (yMax - yMin)) * plot;

  const originVisible = xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0;

  // Tick values at multiples of step. Rounding avoids float drift (0.1 + 0.2).
  const ticks = (min: number, max: number) => {
    const out: number[] = [];
    const start = Math.ceil(min / step);
    const end = Math.floor(max / step);
    for (let i = start; i <= end; i++) out.push(Math.round(i * step * 1e6) / 1e6);
    return out;
  };
  const xs = ticks(xMin, xMax);
  const ys = ticks(yMin, yMax);

  const axisX = Math.min(Math.max(0, yMin), yMax); // keep labels on-screen if 0 is out of range
  const axisY = Math.min(Math.max(0, xMin), xMax);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      style={{ maxWidth: size, display: "block" }}
      role="img"
      aria-label={`Coordinate grid, x from ${xMin} to ${xMax}, y from ${yMin} to ${yMax}`}
    >
      {xs.map((x) => (
        <line key={`v${x}`} x1={sx(x)} y1={sy(yMax)} x2={sx(x)} y2={sy(yMin)} stroke="#bbb" strokeWidth={0.5} />
      ))}
      {ys.map((y) => (
        <line key={`h${y}`} x1={sx(xMin)} y1={sy(y)} x2={sx(xMax)} y2={sy(y)} stroke="#bbb" strokeWidth={0.5} />
      ))}

      {showAxes && (
        <>
          <line x1={sx(xMin)} y1={sy(axisX)} x2={sx(xMax)} y2={sy(axisX)} stroke="#000" strokeWidth={1.2} />
          <line x1={sx(axisY)} y1={sy(yMax)} x2={sx(axisY)} y2={sy(yMin)} stroke="#000" strokeWidth={1.2} />
        </>
      )}

      {xs.filter((x) => !(originVisible && x === 0)).map((x) => (
        <text key={`tx${x}`} x={sx(x)} y={sy(axisX) + 12} fontSize={9} textAnchor="middle">{x}</text>
      ))}
      {ys.filter((y) => !(originVisible && y === 0)).map((y) => (
        <text key={`ty${y}`} x={sx(axisY) - 4} y={sy(y) + 3} fontSize={9} textAnchor="end">{y}</text>
      ))}

      {originVisible && (
        <text x={sx(0) - 4} y={sy(0) + 12} fontSize={9} textAnchor="end">0</text>
      )}
    </svg>
  );
}