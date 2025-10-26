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

    const organization = await client.organization;

    return NextResponse.json({
      workspace: {
        id: organization.id,
        name: organization.name,
        urlKey: organization.urlKey,
        logoUrl: organization.logoUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspace information.' },
      { status: 500 }
    );
  }
}
