import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateSession, getSessionByCode, cleanupExpiredSessions } from '../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const { code, peerUuid } = await request.json();

    if (!code || !peerUuid) {
      return NextResponse.json({ error: 'Missing code or peerUuid' }, { status: 400 });
    }

    await cleanupExpiredSessions();
    const success = await createOrUpdateSession(code, peerUuid);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }

    await cleanupExpiredSessions();
    const session = await getSessionByCode(code);

    if (session) {
      return NextResponse.json({
        exists: true,
        peer_uuid: session.peer_uuid
      });
    } else {
      return NextResponse.json({
        exists: false
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
