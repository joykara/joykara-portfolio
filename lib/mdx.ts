import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export function getAllPosts() {
    const files = fs.readdirSync(contentDir)
    return files.map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const filePath = path.join(contentDir, fileName)
        const source = fs.readFileSync(filePath, 'utf8')
        const { data } = matter(source)
        return { slug, frontmatter: data }
    })
}

export function getPostBySlug(slug: string) {
    const filePath = path.join(contentDir, `${slug}.mdx`)
    const source = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(source)
    return { frontmatter: data, content }
}

