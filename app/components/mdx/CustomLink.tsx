import Link from 'next/link'

export function CustomLink({ href, children, ...props }: any) {
    if (href.startsWith('/')) {
        return <Link href={href} {...props}>{children}</Link>
    }
    if (href.startsWith('#')) {
        return <a {...props}>{children}</a>
    }
    return <a target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
}
