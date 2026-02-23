import { ButtonHTMLAttributes, ReactNode } from 'react'
import cx from 'classnames'

type ButtonProps = {
  children: ReactNode
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cx(
        'w-full min-w-70 h-12 md:h-16 rounded-lg md:rounded-xl',
        'bg-theme-orange-2 hover:bg-theme-orange-1 active:bg-theme-orange-3',
        'text-theme-base-0 text-[14px] md:text-[20px] font-semibold',
        'transition cursor-pointer flex justify-center items-center',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
