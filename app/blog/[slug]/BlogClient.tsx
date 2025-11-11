"use client"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import React from "react"
import Image from "next/image";

type BlogClientProps = { content: string }

export default function BlogClient({ content }: BlogClientProps) {
    const [mdxSource, setMdxSource] = React.useState<any>(null)

    React.useEffect(() => {
        serialize(content).then((source) => setMdxSource(source))
    }, [content])

    if (!mdxSource) return <p>Loading content...</p>

    return <MDXRemote {...mdxSource} />
}
