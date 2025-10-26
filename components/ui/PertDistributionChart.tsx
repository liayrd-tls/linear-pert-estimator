"use client";

import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { PertResult } from '@/lib/pert/calculator';

interface PertDistributionChartProps {
  result: PertResult;
  unit?: string;
}

export default function PertDistributionChart({ result, unit = 'hours' }: PertDistributionChartProps) {
  const { expectedTime, confidenceIntervals } = result;

  // Generate data points for visualization
  const data = [
    {
      name: 'Best Case',
      value: confidenceIntervals.threeStdDev.lower,
      type: 'optimistic',
    },
    {
      name: '68%',
      value: confidenceIntervals.oneStdDev.lower,
      type: 'likely',
    },
    {
      name: 'Expected',
      value: expectedTime,
      type: 'expected',
    },
    {
      name: '68%',
      value: confidenceIntervals.oneStdDev.upper,
      type: 'likely',
    },
    {
      name: 'Worst Case',
      value: confidenceIntervals.threeStdDev.upper,
      type: 'pessimistic',
    },
  ];

  const getColor = (type: string) => {
    switch (type) {
      case 'expected':
        return '#3b82f6'; // blue
      case 'likely':
        return '#94a3b8'; // slate
      case 'optimistic':
      case 'pessimistic':
        return '#e2e8f0'; // light slate
      default:
        return '#cbd5e1';
    }
  };

  return (
    <div className="w-full space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            label={{ value: unit, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
            ))}
          </Bar>
          <ReferenceLine
            y={expectedTime}
            stroke="#3b82f6"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Best Case</div>
          <div className="font-mono font-semibold">
            {confidenceIntervals.threeStdDev.lower.toFixed(1)} {unit}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Expected</div>
          <div className="font-mono font-semibold text-blue-600">
            {expectedTime.toFixed(1)} {unit}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Worst Case</div>
          <div className="font-mono font-semibold">
            {confidenceIntervals.threeStdDev.upper.toFixed(1)} {unit}
          </div>
        </div>
      </div>
    </div>
  );
}
