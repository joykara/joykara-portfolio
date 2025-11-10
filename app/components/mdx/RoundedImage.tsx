'use client'

import Image from 'next/image'
import React from 'react'

export function RoundedImage(props: React.ComponentProps<typeof Image>) {
    return <Image className="rounded-lg" {...props} />
}
