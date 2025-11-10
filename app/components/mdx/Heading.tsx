'use client'

import React from 'react'

interface HeadingProps {
    level: 1 | 2 | 3 | 4 | 5 | 6
    children: React.ReactNode
}

function slugify(str: string) {
    return str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
}

export function Heading({ level, children }: HeadingProps) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    const slug = slugify(children as string)

    return (
        <Tag id={slug}>
            <a href={`#${slug}`} className="anchor mr-2 text-neutral-400 hover:text-neutral-600">
                #
            </a>
            {children}
        </Tag>
    )
}
