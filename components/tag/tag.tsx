'use client'

import cx from "classnames"
import React from "react"
import { TagSize, TagState } from "./types"

type TagProps = {
    content: React.ReactNode
    state: TagState
    size: TagSize
}

type CapProps = {
    size: TagSize
    className?: string
    pathClassName?: string
}

const TAG_SIZE_CONFIG: Record<
    TagSize,
    { width: number; height: number; pathDetails: string, contentMinWidth: string }
> = {
    AMOUNT_MOBILE: {
        width: 21,
        height: 32,
        contentMinWidth: 'min-w-[220px]',
        pathDetails: "M15.1036 0.5H19.6035V32.5H15.1036C12.8007 32.5 10.6491 31.3612 9.36608 29.4631L0.603516 16.5L9.36608 3.53689C10.6491 1.63883 12.8007 0.5 15.1036 0.5Z",
    },
    AMOUNT: {
        width: 24,
        height: 40,
        contentMinWidth: 'min-w-[220px]',
        pathDetails: 'M18.9214 0.5H24.6055V40.5H18.9214C16.0124 40.5 13.2947 39.0765 11.674 36.7039L0.60553 20.5L11.674 4.29612C13.2947 1.92353 16.0124 0.5 18.9214 0.5Z'
    },
    NORMAL_MOBILE: {
        width: 34,
        height: 56,
        contentMinWidth: 'min-w-[260px]',
        pathDetails: "M25.7865 0.5H33.6021V56.5H25.7865C21.7866 56.5 18.0497 54.5071 15.8213 51.1854L0.602112 28.5L15.8213 5.81456C18.0497 2.49295 21.7866 0.5 25.7865 0.5Z",
    },
    NORMAL: {
        width: 43,
        height: 72,
        contentMinWidth: 'min-w-[260px]',
        pathDetails: "M32.653 0.5H42.6002V72.5H32.653C27.5623 72.5 22.8062 69.9376 19.9701 65.667L0.60022 36.5L19.9701 7.33301C22.8062 3.06236 27.5623 0.5 32.653 0.5Z",
    },
}

const TAG_STATE_COLOR_CLASSES: Record<
    TagState,
    {
        path: string
        line: string
        content: string
        contentBg: string
    }
> = {
    CORRECT: {
        path: "stroke-theme-green-1 fill-theme-green-0",
        line: "bg-theme-green-1",
        content: "border-theme-green-1 bg-theme-green-0 before:bg-theme-green-0 after:bg-theme-green-0",
        contentBg: "bg-theme-green-0",
    },
    SELECTED: {
        path: "stroke-theme-orange-3 fill-theme-orange-0",
        line: "bg-theme-orange-3",
        content: "border-theme-orange-3 bg-theme-orange-0 before:bg-theme-orange-0 after:bg-theme-orange-0",
        contentBg: "bg-theme-orange-0",
    },
    WRONG: {
        path: "stroke-theme-red-1 fill-theme-red-0",
        line: "bg-theme-red-1",
        content: "border-theme-red-1 bg-theme-red-0 before:bg-theme-red-0 after:bg-theme-red-0",
        contentBg: "bg-theme-red-0",
    },
    HOVER: {
        path: "stroke-theme-orange-3 fill-theme-base-0",
        line: "bg-theme-orange-3",
        content: "border-theme-orange-3 bg-theme-base-0 before:bg-theme-base-0 after:bg-theme-base-0",
        contentBg: "bg-theme-base-0",
    },
    INACTIVE: {
        path: "stroke-theme-base-2 fill-theme-base-0",
        line: "bg-theme-base-2",
        content: "border-theme-base-2 bg-theme-base-0 before:bg-theme-base-0 after:bg-theme-base-0",
        contentBg: "bg-theme-base-0",
    },
}

const Cap = ({
    size,
    className,
    pathClassName,
}: CapProps) => {
    const { width, height, pathDetails } = TAG_SIZE_CONFIG[size]

    return (
        <svg
            width={width}
            height={height}
            strokeWidth={1}
            className={className}
            preserveAspectRatio="none"
            viewBox={`0 0 ${width - 1} ${height + 1}`}
        >
            <path d={pathDetails} className={pathClassName} />
        </svg>
    )
}

export const Tag = ({ content, state, size }: TagProps) => {

    const colors = TAG_STATE_COLOR_CLASSES[state]
    const { height, contentMinWidth } = TAG_SIZE_CONFIG[size]
    
    const contentWrapperClasses = cx(
        "z-4 border-y flex items-center tag-content relative",
        "before:absolute before:top-0 before:bottom-0 before:-right-0.5 before:w-1 before:z-3 before:content-['']",
        "after:absolute after:top-0 after:bottom-0 after:-left-0.5 after:w-1 after:z-3 after:content-['']",
        colors.content,
        contentMinWidth
    )

    const contentInnerClasses = cx(
        "z-5 text-[14px] lg:text-[20px] w-full",
        colors.contentBg
    )

    return (
        <div className="flex items-center justify-center relative cursor-pointer">
            
            <div className={cx("w-full h-px absolute", colors.line)} />

            <Cap size={size} className="z-3" pathClassName={colors.path} />

            <div style={{ height }} className={contentWrapperClasses}>
                <div className={contentInnerClasses}>{content}</div>
            </div>

            <Cap size={size} className="-scale-x-100 z-3" pathClassName={colors.path} />
        </div>
    )
}
