import { NextRequest, NextResponse } from 'next/server';
import { getLinearClientFromSession } from '@/lib/linear/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const client = await getLinearClientFromSession();

    if (!client) {
      return NextResponse.json(
        { error: 'Not authenticated. Please connect your Linear account.' },
        { status: 401 }
      );
    }

    const project = await client.project(projectId);
    const issuesData = await project.issues();

    const issues = await Promise.all(
      issuesData.nodes.map(async (issue) => {
        const state = await issue.state;
        const assignee = await issue.assignee;
        const labels = await issue.labels();
        const projectData = await issue.project;
        const projectMilestones = projectData ? await projectData.projectMilestones() : null;
        const currentMilestone = projectMilestones?.nodes[0]; // Get the first milestone if exists

        return {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          description: issue.description,
          state: state?.name || 'No state',
          priority: issue.priority || 0,
          assignee: assignee
            ? {
                id: assignee.id,
                name: assignee.name,
                avatarUrl: assignee.avatarUrl,
              }
            : undefined,
          labels: labels.nodes.map(label => ({
            id: label.id,
            name: label.name,
            color: label.color,
          })),
          project: projectData ? {
            id: projectData.id,
            name: projectData.name,
            milestone: currentMilestone ? {
              id: currentMilestone.id,
              name: currentMilestone.name,
            } : undefined,
          } : undefined,
          estimate: undefined,
        };
      })
    );

    return NextResponse.json({ issues });
  } catch (error) {
    console.error('Error fetching project issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project issues.' },
      { status: 500 }
    );
  }
}
