import { collection, doc, setDoc, updateDoc, serverTimestamp, getDoc, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@services/db.service'
import type { Session, SessionState } from '@/types'
import { questionService } from './question.service'
import { indexToAmount } from '@/utils'
import { SESSION_STORAGE_KEY } from '@/constants'

const COLLECTION_NAME = 'sessions'

class SessionService {
  private collection = collection(db, COLLECTION_NAME).withConverter<Session>({
    toFirestore: (data) => data,
    fromFirestore: (snapshot) => {
      const data = snapshot.data()!
      return {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Session
    }
  })

  questionService = questionService

  async create() {
    const sessionRef = doc(this.collection)
    const questions = await this.questionService.getSessionQuestions()

    await setDoc(sessionRef, {
      id: sessionRef.id,
      questions,
      score: 0,
      earned: 0,
      state: 'IN_PROGRESS',
      currentQuestionIndex: 0,
      createdAt: serverTimestamp(),
    })

    return sessionRef.id
  }
  destroyCurrentSession() {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }

async setAnswer(sessionId: string, answerId: number) {
  const sessionRef = doc(this.collection, sessionId)
  const session = await this.getSessionById(sessionId)

  if (!session) throw new Error('Session not found')
  if (session.state === 'DONE') throw new Error('Session already done')

  const question = session.questions[session.currentQuestionIndex]
  const isRightAnswer = question.rightAnswerId === answerId

  const nextIndex = isRightAnswer ? session.currentQuestionIndex + 1 : session.currentQuestionIndex
  const nextScore = isRightAnswer ? session.score + 1 : session.score
  let nextState: SessionState = !isRightAnswer || nextIndex >= session.questions.length ? 'DONE' : 'IN_PROGRESS'
  const earned = isRightAnswer ? indexToAmount[session.currentQuestionIndex] : session.earned

  if(session.currentQuestionIndex === 11 && isRightAnswer) {
    nextState = 'DONE'
  }

  await updateDoc(sessionRef, {
    score: nextScore,
    currentQuestionIndex: nextIndex,
    state: nextState,
    earned
  })

  return {
    id: session.id,
    currentQuestionIndex: nextIndex,
    newScore: nextScore,
    state: nextState,
    earned,
  }
}

  async getSessionById(sessionId: string): Promise<Session | null> {
    const sessionRef = doc(this.collection, sessionId)
    const snapshot = await getDoc(sessionRef)
    if (!snapshot.exists()) return null
    return snapshot.data()
  }

  async getAll(order: 'asc' | 'desc' = 'asc'): Promise<Session[]> {
    const q = query(this.collection, orderBy('createdAt', order))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data())
  }
}

export const sessionService = new SessionService()
