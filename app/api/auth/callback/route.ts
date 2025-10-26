import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getLinearUser } from '@/lib/auth/oauth';
import { createSession, setSessionCookie } from '@/lib/auth/session';

/**
 * Handle OAuth callback from Linear
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/?error=oauth_failed`
      );
    }

    // Validate authorization code
    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/?error=missing_code`
      );
    }

    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    const accessToken = tokenResponse.access_token;

    // Get user info from Linear
    const user = await getLinearUser(accessToken);

    // Create session
    const sessionToken = await createSession({
      accessToken,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      expiresAt: Date.now() + tokenResponse.expires_in * 1000,
    });

    // Set session cookie
    await setSessionCookie(sessionToken);

    // Redirect to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?connected=true`
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/?error=callback_failed`
    );
  }
}
