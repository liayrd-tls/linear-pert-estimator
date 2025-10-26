import { NextResponse } from 'next/server';
import { getLinearClientFromSession, fetchTeamIssues } from '@/lib/linear/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'teamId parameter is required' },
        { status: 400 }
      );
    }

    const client = await getLinearClientFromSession();

    if (!client) {
      return NextResponse.json(
        { error: 'Not authenticated. Please connect your Linear account.' },
        { status: 401 }
      );
    }

    const issues = await fetchTeamIssues(client, teamId);

    return NextResponse.json({ issues });
  } catch (error) {
    console.error('Error fetching Linear issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues. Please try reconnecting your Linear account.' },
      { status: 500 }
    );
  }
}
