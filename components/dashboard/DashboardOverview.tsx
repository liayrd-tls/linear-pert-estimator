"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, Tooltip } from 'recharts';
import { calculatePert, PertEstimate } from '@/lib/pert/calculator';

interface ProjectSummary {
  id: string;
  name: string;
  color?: string;
  totalTasks: number;
  estimatedTasks: number;
  expectedTime: number;
  optimisticTime: number;
  pessimisticTime: number;
  state: string;
}

export default function DashboardOverview() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    estimatedTasks: 0,
    totalExpectedHours: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/linear/dashboard');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeProjects = projects.filter(p => p.state === 'started' || p.state === 'planned');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-3 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          total={stats.totalProjects}
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle={`${stats.estimatedTasks} estimated`}
          icon="✓"
          color="green"
        />
        <StatCard
          title="Expected Hours"
          value={Math.round(stats.totalExpectedHours)}
          suffix="h"
          icon="⏱"
          color="orange"
        />
        <StatCard
          title="Completion Rate"
          value={stats.totalTasks > 0 ? Math.round((stats.estimatedTasks / stats.totalTasks) * 100) : 0}
          suffix="%"
          icon="🎯"
          color="purple"
        />
      </div>

      {/* Active Projects Overview */}
      {activeProjects.length > 0 && (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Active Projects - Time Estimates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeProjects} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="optimisticTime" fill="#94a3b8" name="Optimistic" />
              <Bar dataKey="expectedTime" fill="#3b82f6" name="Expected" />
              <Bar dataKey="pessimisticTime" fill="#ef4444" name="Pessimistic" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Project List */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">All Projects</h3>
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: project.color || '#3b82f6' }}
                >
                  {project.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {project.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {project.estimatedTasks} of {project.totalTasks} tasks estimated
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {project.expectedTime.toFixed(1)}h
                </div>
                <div className="text-xs text-gray-500">
                  {project.optimisticTime.toFixed(1)}h - {project.pessimisticTime.toFixed(1)}h
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  total?: number;
  subtitle?: string;
  suffix?: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

function StatCard({ title, value, total, subtitle, suffix, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${colorClasses[color]}`}>
          {value}{suffix}
        </span>
        {total !== undefined && (
          <span className="text-sm text-gray-500">/ {total}</span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
