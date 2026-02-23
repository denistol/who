export type SessionState = 'IN_PROGRESS' | 'DONE'
export interface Session {
    id: string;
    createdAt: Date;
    questions: Question[]
    state: SessionState
    currentQuestionIndex: number
    score: number
    earned: number
}

export type Answer = {
    id: number
    answerContent: string
}

export type Question = {
    id: number
    question: string
    answers: Answer[]
    rightAnswerId: number
    difficulty: number
}