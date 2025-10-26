import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth/session';

/**
 * Logout and clear session
 */
export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await clearSession();
    return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL || '/');
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL || '/');
  }
}
