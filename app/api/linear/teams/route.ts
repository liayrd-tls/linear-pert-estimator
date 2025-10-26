import { NextResponse } from 'next/server';
import { getLinearClientFromSession, fetchTeams } from '@/lib/linear/client';

export async function GET() {
  try {
    const client = await getLinearClientFromSession();

    if (!client) {
      return NextResponse.json(
        { error: 'Not authenticated. Please connect your Linear account.' },
        { status: 401 }
      );
    }

    const teams = await fetchTeams(client);

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching Linear teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams. Please try reconnecting your Linear account.' },
      { status: 500 }
    );
  }
}
