'use client'

import cx from 'classnames'
import { useMediaQuery } from 'react-responsive'

import { Tag } from './tag'
import { currencyFormat } from '@/utils'
import { TagAmountState, TagState } from './types'

type TagAmountProps = {
  amount: number
  state?: TagAmountState
}

const STATE_CONFIG: Record<
  TagAmountState,
  { tagState: TagState; textColor: string }
> = {
  ACTIVE: {
    tagState: 'HOVER',
    textColor: 'text-theme-orange-2',
  },
  INACTIVE: {
    tagState: 'INACTIVE',
    textColor: 'text-theme-base-2',
  },
  DEFAULT: {
    tagState: 'INACTIVE',
    textColor: 'text-theme-base-3',
  },
}

export const TagAmount = ({ amount, state = 'DEFAULT' }: TagAmountProps) => {
  const isMobile = useMediaQuery({ maxWidth: 1024 })
  const { tagState, textColor } = STATE_CONFIG[state]

  return (
    <Tag
      state={tagState}
      size={isMobile ? 'AMOUNT_MOBILE' : 'AMOUNT'}
      content={
        <div className={cx('w-full text-center', textColor)}>
          {currencyFormat(amount)}
        </div>
      }
    />
  )
}
