'use client'

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import classNames from "classnames"

import { TagAmount } from "@/components/tag/tagAmount"
import { TagVariant } from "@/components/tag/tagVariant"
import { Screen } from "@/components/screen"

import { indexToAmount, sleep } from "@/utils"
import { Session, SessionState } from "@/types"
import { TagAmountState, TagState } from "@/components/tag/types"
import { ACTION_DELAY_SECS, SESSION_STORAGE_KEY } from "@/constants"
import { sessionService } from "@/services/session.service"

export const PageContent = () => {

    const [menuIsOpen, setMenuOpen] = useState(false)
    const [session, setSession] = useState<Session | null>(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [answerLoading, setAnswerLoading] = useState(false)

    const [clickedAnswerId, setClickedAnswerId] = useState<number | null>(null)
    const [clickedTagState, setClickedTagState] = useState<TagState>('INACTIVE')
    const [clickBlocked, setClickBlocked] = useState(false)

    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error')
    }

    const resetClick = useCallback(() => {
        setClickedAnswerId(null)
        setClickedTagState('INACTIVE')
        setClickBlocked(false)
    }, [])

    const initSession = useCallback(async () => {
        try {
            setLoading(true)
            resetClick()

            let sessionId = localStorage.getItem('sessionId')

            if (!sessionId) {
                const createRes = await fetch(`/api/session`, { method: 'POST' })
                if (!createRes.ok) throw new Error('Failed to create session')

                const created = await createRes.json() as Session
                sessionId = created.id
                localStorage.setItem('sessionId', sessionId)
            }

            const res = await fetch(`/api/session/${sessionId}`, { next: { revalidate: 0 } })
            if (!res.ok) throw new Error('Failed to fetch session')

            const sessionData = await res.json() as Session
            setSession(sessionData)

        } catch (err) {
            handleError(err)
        } finally {
            setLoading(false)
        }
    }, [resetClick])

    const handleAnswerClick = async (answerId: number) => {
        if (clickBlocked || !session || answerLoading || session.state === 'DONE') return

        setClickedAnswerId(answerId)
        setClickedTagState('SELECTED')
        setClickBlocked(true)

        await sleep(ACTION_DELAY_SECS)

        try {
            setAnswerLoading(true)

            const res = await fetch(`/api/session/${session.id}/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answerId })
            })

            if (!res.ok) throw new Error('Failed to submit answer')

            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'Unknown error')

            const updatedSession = data.data as { newScore: number, state: SessionState }

            const currentQuestion = session.questions[session.currentQuestionIndex]
            const isCorrect = currentQuestion.rightAnswerId === answerId

            setClickedTagState(isCorrect ? 'CORRECT' : 'WRONG')

            await sleep(ACTION_DELAY_SECS)

            setSession(prev => prev ? { ...prev, ...updatedSession } : prev)

            resetClick()

        } catch (err) {
            handleError(err)
        } finally {
            setAnswerLoading(false)
        }
    }

    const handleContinueClick = () => {
        sessionService.destroyCurrentSession()
        resetClick()
        initSession()
    }

    useEffect(() => {
        if (localStorage.getItem(SESSION_STORAGE_KEY)) {
            initSession()
        } else {
            setLoading(false)
        }
    }, [initSession])


    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!session) return <Screen state="INIT" earned={0} handleClick={handleContinueClick} />
    if (session.state === 'DONE')
        return <Screen state="EARNED" earned={session.earned} handleClick={handleContinueClick} />


    const questions = session.questions
    const currentQuestion = questions[session.currentQuestionIndex]
    const answers = currentQuestion.answers

    const getTagVariantState = (answerId: number): TagState =>
        answerId === clickedAnswerId ? clickedTagState : 'INACTIVE'

    const getTagAmountState = (questionId: number): TagAmountState => {
        const qIndex = questions.findIndex(q => q.id === questionId)

        if (qIndex < session.currentQuestionIndex) return 'INACTIVE'
        if (qIndex === session.currentQuestionIndex) return 'ACTIVE'
        return 'DEFAULT'
    }


    return (
        <div className="flex grow bg-theme-base-1 w-full relative h-screen container mx-auto">

            <main className="grow h-full flex justify-between flex-col py-30.5 items-center lg:items-start">

                <h2 className="font-semibold text-[18px] lg:text-[32px] max-w-full xl:max-w-2/3 mx-auto lg:mx-0 px-4 h-full flex items-center lg:block">
                    {currentQuestion.question}
                </h2>

                <div className="flex flex-wrap max-w-screen lg:max-w-160 xl:max-w-210 gap-y-2 lg:gap-y-8">
                    {answers.map((a) => (
                        <TagVariant
                            key={`${currentQuestion.id}-${a.id}`}
                            state={getTagVariantState(a.id)}
                            index={a.id}
                            variant={a.answerContent}
                            onClick={() => handleAnswerClick(a.id)}
                        />
                    ))}
                </div>

            </main>

            <aside
                className={classNames(
                    "fixed lg:relative w-screen lg:w-[320px] h-full left-0 top-0 z-10 flex flex-col-reverse justify-center gap-y-2 bg-theme-base-0 transition-transform duration-200 ease-in-out",
                    menuIsOpen ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"
                )}
            >
                {questions.map((q, qIndex) => (
                    <TagAmount
                        key={q.id}
                        amount={indexToAmount[qIndex]}
                        state={getTagAmountState(q.id)}
                    />
                ))}
            </aside>

            <Image
                className="p-4 block box-content fixed right-0 top-0 z-10 cursor-pointer lg:hidden"
                src={menuIsOpen ? "/menu-close.svg" : "/menu-open.svg"}
                width={24}
                height={24}
                alt="Toggle menu"
                onClick={() => setMenuOpen(p => !p)}
            />
        </div>
    )
}
