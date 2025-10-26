"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LinearConnectionStatus from '@/components/ui/LinearConnectionStatus';
import WorkspaceHeader from '@/components/dashboard/WorkspaceHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ProjectList from '@/components/dashboard/ProjectList';
import TaskList from '@/components/dashboard/TaskList';
import { PertEstimate } from '@/lib/pert/calculator';

type DashboardView = 'overview' | 'projects' | 'tasks';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showConnectedMessage, setShowConnectedMessage] = useState(false);

  useEffect(() => {
    // Check for connection success message
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'true') {
      setShowConnectedMessage(true);
      window.history.replaceState({}, '', '/dashboard');
      setTimeout(() => setShowConnectedMessage(false), 5000);
    }
  }, []);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('tasks');
  };

  const handleEstimateChange = async (taskId: string, estimate: PertEstimate) => {
    // TODO: Save estimate to database
    console.log('Saving estimate for task:', taskId, estimate);

    // In a real implementation, you would call an API endpoint here
    // await fetch('/api/estimates', {
    //   method: 'POST',
    //   body: JSON.stringify({ taskId, estimate }),
    // });
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProjectId(null);
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedProjectId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold hover:text-blue-600 transition-colors">
                Linear PERT Estimator
              </Link>
              <WorkspaceHeader />
            </div>
            <div className="flex items-center gap-4">
              <LinearConnectionStatus />
            </div>
          </div>
        </div>
      </nav>

      {/* Success Message */}
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

      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={handleBackToOverview}
              className={`hover:text-blue-600 transition-colors ${
                currentView === 'overview' ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Overview
            </button>
            {(currentView === 'projects' || currentView === 'tasks') && (
              <>
                <span className="text-gray-400">/</span>
                <button
                  onClick={handleBackToProjects}
                  className={`hover:text-blue-600 transition-colors ${
                    currentView === 'projects' ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Projects
                </button>
              </>
            )}
            {currentView === 'tasks' && selectedProjectId && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-blue-600 font-semibold">Tasks</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setCurrentView('overview')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setCurrentView('projects')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'projects' || currentView === 'tasks'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              📁 Projects
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'overview' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <button
                onClick={() => setCurrentView('projects')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                View All Projects
              </button>
            </div>
            <DashboardOverview />
          </div>
        )}

        {currentView === 'projects' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Projects</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select a project to view and estimate tasks
              </p>
            </div>
            <ProjectList
              onSelectProject={handleSelectProject}
              selectedProjectId={selectedProjectId || undefined}
            />
          </div>
        )}

        {currentView === 'tasks' && selectedProjectId && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Project Tasks</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Add PERT estimates to tasks for better planning
                </p>
              </div>
              <button
                onClick={handleBackToProjects}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ← Back to Projects
              </button>
            </div>
            <TaskList
              projectId={selectedProjectId}
              onEstimateChange={handleEstimateChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}
