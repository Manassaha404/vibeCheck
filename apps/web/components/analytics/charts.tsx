import type { PieLabelRenderProps } from "recharts";

export function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload?.length && payload[0]) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-primary">{payload[0].value} responses</p>
      </div>
    );
  }
  return null;
}

export function PieLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (
    typeof cx !== "number" ||
    typeof cy !== "number" ||
    typeof midAngle !== "number" ||
    typeof innerRadius !== "number" ||
    typeof outerRadius !== "number" ||
    typeof percent !== "number" ||
    percent < 0.08
  ) {
    return null;
  }
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}
