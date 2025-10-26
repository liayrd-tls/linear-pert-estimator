"use client";

import { PertResult } from '@/lib/pert/calculator';

interface ConfidenceIntervalsProps {
  result: PertResult;
  unit?: string;
}

export default function ConfidenceIntervals({ result, unit = 'hours' }: ConfidenceIntervalsProps) {
  const intervals = [
    {
      label: '68% confidence',
      percentage: '~1σ',
      range: result.confidenceIntervals.oneStdDev,
      description: 'Most likely outcome range',
    },
    {
      label: '95% confidence',
      percentage: '~2σ',
      range: result.confidenceIntervals.twoStdDev,
      description: 'High confidence range',
    },
    {
      label: '99.7% confidence',
      percentage: '~3σ',
      range: result.confidenceIntervals.threeStdDev,
      description: 'Maximum range',
    },
  ];

  return (
    <div className="space-y-3">
      {intervals.map((interval, idx) => (
        <div
          key={idx}
          className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{interval.label}</span>
              <span className="text-xs text-gray-500 font-mono">{interval.percentage}</span>
            </div>
            <span className="text-xs text-gray-500">{interval.description}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {interval.range.lower.toFixed(1)}
            </span>
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 rounded-full" />
            <span className="text-gray-600 dark:text-gray-400">
              {interval.range.upper.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500 ml-1">{unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
