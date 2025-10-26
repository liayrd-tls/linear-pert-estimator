"use client";

import { useEffect, useState } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  state: string;
  progress: number;
  icon?: string;
  color?: string;
  issueCount?: number;
}

interface ProjectListProps {
  onSelectProject: (projectId: string) => void;
  selectedProjectId?: string;
}

export default function ProjectList({ onSelectProject, selectedProjectId }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/linear/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-3 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No projects</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a project in Linear.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onSelectProject(project.id)}
          className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
            selectedProjectId === project.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {project.icon ? (
                <span className="text-2xl">{project.icon}</span>
              ) : (
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: project.color || '#3b82f6' }}
                >
                  {project.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {project.name}
                </h3>
                <span className="text-xs text-gray-500 capitalize">
                  {project.state}
                </span>
              </div>
            </div>
          </div>

          {project.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {project.description}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{Math.round(project.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            {project.issueCount !== undefined && (
              <div className="text-xs text-gray-500">
                {project.issueCount} {project.issueCount === 1 ? 'issue' : 'issues'}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
