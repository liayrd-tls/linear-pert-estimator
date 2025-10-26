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

    const projects = await Promise.all(
      projectsData.nodes.map(async (project) => {
        const issues = await project.issues();
        const issueCount = issues.nodes.length;
        const completedIssues = issues.nodes.filter(
          (issue) => issue.state?.type === 'completed'
        ).length;

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          state: project.state,
          progress: issueCount > 0 ? (completedIssues / issueCount) * 100 : 0,
          icon: project.icon,
          color: project.color,
          issueCount,
        };
      })
    );

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects.' },
      { status: 500 }
    );
  }
}
