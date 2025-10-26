"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Task } from '@/lib/pert/types';
import { calculatePert } from '@/lib/pert/calculator';

interface ProjectTimelineProps {
  tasks: Task[];
  unit?: string;
}

export default function ProjectTimeline({ tasks, unit = 'hours' }: ProjectTimelineProps) {
  const data = tasks.map(task => {
    const result = calculatePert(task.estimate);
    return {
      name: task.title.length > 30 ? task.title.substring(0, 30) + '...' : task.title,
      optimistic: task.estimate.optimistic,
      expected: result.expectedTime,
      pessimistic: task.estimate.pessimistic,
    };
  });

  const totalExpectedTime = data.reduce((sum, item) => sum + item.expected, 0);
  const totalPessimistic = data.reduce((sum, item) => sum + item.pessimistic, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div>
          <div className="text-xs text-gray-500 mb-1">Total Expected Time</div>
          <div className="text-2xl font-bold text-blue-600">
            {totalExpectedTime.toFixed(1)} {unit}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Worst Case Total</div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {totalPessimistic.toFixed(1)} {unit}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(300, tasks.length * 60)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: '#64748b' }}
            label={{ value: unit, position: 'insideBottom', offset: -10, fill: '#64748b' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="optimistic" fill="#94a3b8" name="Optimistic" radius={[0, 4, 4, 0]} />
          <Bar dataKey="expected" fill="#3b82f6" name="Expected" radius={[0, 4, 4, 0]} />
          <Bar dataKey="pessimistic" fill="#ef4444" name="Pessimistic" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
