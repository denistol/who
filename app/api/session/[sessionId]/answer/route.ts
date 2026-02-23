import { NextRequest, NextResponse } from 'next/server'
import { sessionService } from '@/services/session.service'

type SetAnswerBody = {
  answerId: number
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {

    const { sessionId } = await params
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing sessionId' }, { status: 400 })
    }

    const body: SetAnswerBody = await req.json()
    if (typeof body.answerId !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid answerId' }, { status: 400 })
    }

    const result = await sessionService.setAnswer(sessionId, body.answerId)
    return NextResponse.json({ success: true, data: result })
  } catch (error: unknown) {
    console.error('setAnswer API error:', error)
    let message = 'Unknown error'
    if (error instanceof Error) message = error.message

    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
