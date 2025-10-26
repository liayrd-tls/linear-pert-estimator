"use client";

import { useState } from 'react';
import { PertEstimate, validatePertEstimate, calculatePert } from '@/lib/pert/calculator';

interface TaskEstimateInputProps {
  onEstimateChange?: (estimate: PertEstimate) => void;
  initialEstimate?: PertEstimate;
  unit?: string;
}

export default function TaskEstimateInput({
  onEstimateChange,
  initialEstimate,
  unit = 'hours'
}: TaskEstimateInputProps) {
  const [estimate, setEstimate] = useState<PertEstimate>(
    initialEstimate || {
      optimistic: 0,
      mostLikely: 0,
      pessimistic: 0,
    }
  );

  const handleChange = (field: keyof PertEstimate, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newEstimate = { ...estimate, [field]: numValue };
    setEstimate(newEstimate);
    onEstimateChange?.(newEstimate);
  };

  const validation = validatePertEstimate(estimate);
  const result = validation.valid ? calculatePert(estimate) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Optimistic (O)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={estimate.optimistic || ''}
            onChange={(e) => handleChange('optimistic', e.target.value)}
            placeholder="Best case"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900"
          />
          <p className="text-xs text-gray-500">Best-case scenario</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Most Likely (M)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={estimate.mostLikely || ''}
            onChange={(e) => handleChange('mostLikely', e.target.value)}
            placeholder="Realistic estimate"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900"
          />
          <p className="text-xs text-gray-500">Most realistic</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pessimistic (P)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={estimate.pessimistic || ''}
            onChange={(e) => handleChange('pessimistic', e.target.value)}
            placeholder="Worst case"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900"
          />
          <p className="text-xs text-gray-500">Worst-case scenario</p>
        </div>
      </div>

      {validation.errors.length > 0 && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
            {validation.errors.map((error, idx) => (
              <li key={idx}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {result && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expected Time</div>
              <div className="text-2xl font-bold text-blue-600">
                {result.expectedTime.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">{unit}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Std Deviation</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {result.standardDeviation.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">{unit}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">68% Range</div>
              <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {result.confidenceIntervals.oneStdDev.lower.toFixed(1)} - {result.confidenceIntervals.oneStdDev.upper.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">{unit}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">95% Range</div>
              <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {result.confidenceIntervals.twoStdDev.lower.toFixed(1)} - {result.confidenceIntervals.twoStdDev.upper.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">{unit}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
