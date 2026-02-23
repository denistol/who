'use client'

import { useState, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'

import { Tag } from './tag'
import { TagState } from './types'

type TagVariantProps = {
  state: TagState
  index: number
  variant: string
  onClick: () => void
}

const LETTERS = ['A', 'B', 'C', 'D'] as const

export const TagVariant = ({
  state = 'INACTIVE',
  index,
  variant,
  onClick,
}: TagVariantProps) => {
  const [isHover, setIsHover] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 1024 })

  const letter = LETTERS[index-1] ?? ''

  let tagState: TagState = 'INACTIVE'

  if(state === 'INACTIVE') {
    tagState = isHover ? 'HOVER' : 'INACTIVE'
  } else {
    tagState = state
  }
  
  const tagSize = isMobile ? 'NORMAL_MOBILE' : 'NORMAL'

  const content = useMemo(
    () => (
      <div className="flex w-full text-left">
        <b className="text-theme-orange-3">{letter}</b>
        <span className="pl-2">{variant}</span>
      </div>
    ),
    [letter, variant]
  )

  return (
    <div
      className="w-full xl:w-105"
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Tag state={tagState} size={tagSize} content={content} />
    </div>
  )
}
