import { type ReactElement } from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';
import type { ChartPoint } from '../types';

const COLORS = ['#4f46e5', '#7c3aed', '#0891b2', '#059669', '#d97706', '#be123c', '#0f766e', '#9333ea', '#e11d48', '#0284c7'];

interface CountryTreemapProps {
  data: ChartPoint[];
}

function TreemapContent({ x = 0, y = 0, width = 0, height = 0, index = 0, name = '' }: { x?: number; y?: number; width?: number; height?: number; depth?: number; index?: number; name?: string }): ReactElement {
  if (!width || !height) {
    return <g />;
  }
  const fontSize = Math.min(width / Math.max(name.length, 1), height / 3);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={COLORS[index % COLORS.length]}
        rx={6}
        ry={6}
        opacity={0.85}
      />
      {fontSize > 8 && width > 40 && height > 24 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize={fontSize}
          fontWeight={700}
        >
          {name}
        </text>
      )}
    </g>
  );
}

export function CountryTreemap({ data }: CountryTreemapProps) {
  const treeData = data.map((d) => ({ name: d.label, size: d.value }));

  return (
    <ResponsiveContainer>
      <Treemap
        data={treeData}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#fff"
        content={<TreemapContent />}
      />
    </ResponsiveContainer>
  );
}
