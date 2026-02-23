import { NextResponse } from 'next/server';
import { sessionService } from '@services/session.service';

export async function GET() {
    try {
        const sessions = await sessionService.getAll()

        return NextResponse.json(sessions);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch sessions' },
            { status: 500 },
        );
    }
}

export async function POST() {
    try {
        const id = await sessionService.create()
        return NextResponse.json({ id, message: 'Session created' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create session' },
            { status: 500 },
        );
    }
}
