import { NextResponse } from 'next/server';
import { getLinearClientFromSession } from '@/lib/linear/client';

export async function GET() {
  try {
    const client = await getLinearClientFromSession();

    if (!client) {
      return NextResponse.json(
        { error: 'Not authenticated. Please connect your Linear account.' },
        { status: 401 }
      );
    }

    const projectsData = await client.projects();

    let totalTasks = 0;
    let estimatedTasks = 0;
    let totalExpectedHours = 0;

    const projects = await Promise.all(
      projectsData.nodes.map(async (project) => {
        const issues = await project.issues();
        const issueCount = issues.nodes.length;
        totalTasks += issueCount;

        // In a real implementation, these would come from your database
        // For now, using placeholder values
        const projectEstimatedTasks = 0;
        estimatedTasks += projectEstimatedTasks;

        return {
          id: project.id,
          name: project.name,
          color: project.color,
          state: project.state,
          totalTasks: issueCount,
          estimatedTasks: projectEstimatedTasks,
          expectedTime: 0, // Sum of all task estimates
          optimisticTime: 0,
          pessimisticTime: 0,
        };
      })
    );

    const activeProjects = projects.filter(
      (p) => p.state === 'started' || p.state === 'planned'
    ).length;

    return NextResponse.json({
      projects,
      stats: {
        totalProjects: projects.length,
        activeProjects,
        totalTasks,
        estimatedTasks,
        totalExpectedHours,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data.' },
      { status: 500 }
    );
  }
}
