"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TaskEstimateInput from '@/components/ui/TaskEstimateInput';
import PertDistributionChart from '@/components/ui/PertDistributionChart';
import ConfidenceIntervals from '@/components/ui/ConfidenceIntervals';
import LinearConnectionStatus from '@/components/ui/LinearConnectionStatus';
import { PertEstimate, calculatePert } from '@/lib/pert/calculator';

export default function Dashboard() {
  const [estimate, setEstimate] = useState<PertEstimate>({
    optimistic: 2,
    mostLikely: 4,
    pessimistic: 8,
  });
  const [showConnectedMessage, setShowConnectedMessage] = useState(false);

  useEffect(() => {
    // Check for connection success message
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'true') {
      setShowConnectedMessage(true);
      // Clear the URL parameter
      window.history.replaceState({}, '', '/dashboard');
      // Hide message after 5 seconds
      setTimeout(() => setShowConnectedMessage(false), 5000);
    }
  }, []);

  const result = calculatePert(estimate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold hover:text-blue-600 transition-colors">
              Linear PERT Estimator
            </Link>
            <div className="flex items-center gap-4">
              <LinearConnectionStatus />
            </div>
          </div>
        </div>
      </nav>

      {showConnectedMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                Successfully connected to Linear! You can now import tasks and teams.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Task Estimation</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter optimistic, most likely, and pessimistic time estimates for your task.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">PERT Estimates</h3>
            <TaskEstimateInput
              initialEstimate={estimate}
              onEstimateChange={setEstimate}
              unit="hours"
            />
          </div>

          {/* Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Distribution</h3>
              <PertDistributionChart result={result} unit="hours" />
            </div>

            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Confidence Intervals</h3>
              <ConfidenceIntervals result={result} unit="hours" />
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">How PERT Works</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Expected Time:</strong> Calculated as (O + 4M + P) / 6, giving more weight to the most likely estimate.
              </p>
              <p>
                <strong>Standard Deviation:</strong> Measures uncertainty, calculated as (P - O) / 6.
              </p>
              <p>
                <strong>Confidence Intervals:</strong> Statistical ranges showing probability of completion within timeframes:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>68% confidence (±1σ): Most likely outcome range</li>
                <li>95% confidence (±2σ): High probability range</li>
                <li>99.7% confidence (±3σ): Nearly certain range</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
