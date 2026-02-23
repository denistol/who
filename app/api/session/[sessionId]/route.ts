import { sessionService } from "@/services/session.service"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing sessionId' }, { status: 400 })
    }

    const session = await sessionService.getSessionById(sessionId)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error: unknown) {
    console.error('getSession API error:', error)
    let message = 'Unknown error'
    if (error instanceof Error) message = error.message
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}