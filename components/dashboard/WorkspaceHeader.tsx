"use client";

import { useEffect, useState } from 'react';

interface Workspace {
  id: string;
  name: string;
  urlKey: string;
}

export default function WorkspaceHeader() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const fetchWorkspace = async () => {
    try {
      const response = await fetch('/api/linear/workspace');
      if (response.ok) {
        const data = await response.json();
        setWorkspace(data.workspace);
      }
    } catch (error) {
      console.error('Failed to fetch workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
        Loading workspace...
      </div>
    );
  }

  if (!workspace) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {workspace.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {workspace.name}
          </div>
          <div className="text-xs text-gray-500">
            {workspace.urlKey}.linear.app
          </div>
        </div>
      </div>
    </div>
  );
}
