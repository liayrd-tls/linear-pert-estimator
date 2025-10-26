import { NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/auth/oauth';

/**
 * Initiate Linear OAuth login flow
 */
export async function GET() {
  try {
    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(7);

    // Get the authorization URL
    const authUrl = getAuthorizationUrl(state);

    // Redirect to Linear's OAuth page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('OAuth login error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}
