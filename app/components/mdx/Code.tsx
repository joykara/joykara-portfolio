import { highlight } from 'sugar-high'

interface CodeProps {
    children: string
}

export function Code({ children }: CodeProps) {
    const codeHTML = highlight(children)
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
}
