// /blog/utils.ts
import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  tags?: string[]
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  if (!match) return { metadata: {} as Metadata, content: fileContent }

  const frontMatterBlock = match[1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Record<keyof Metadata, string | string[]>> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    const rawValue = valueArr.join(': ').trim().replace(/^['"](.*)['"]$/, '$1')

    if (key.trim() === 'tags') {
      const tags = rawValue
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
      metadata.tags = tags
    } else {
      metadata[key.trim() as keyof Metadata] = rawValue
    }
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))
    return { metadata, slug, content }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'content'))
}

export function formatDate(date: string, includeRelative = false) {
  if (!date) return ''

  const currentDate = new Date()
  if (!date.includes('T')) date = `${date}T00:00:00`
  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''
  if (yearsAgo > 0) formattedDate = `${yearsAgo}y ago`
  else if (monthsAgo > 0) formattedDate = `${monthsAgo}mo ago`
  else if (daysAgo > 0) formattedDate = `${daysAgo}d ago`
  else formattedDate = 'Today'

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return includeRelative ? `${fullDate} (${formattedDate})` : fullDate
}
