import { notFound } from 'next/navigation'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import dynamic from 'next/dynamic'

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map(post => ({ slug: post.slug }))
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug.trim() === slug.trim())
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params, }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug.trim() === slug.trim())
  console.log("Params slug:", slug)
  console.log("Found post:", post)

  if (!post) {
    notFound()
  }

  const Post = dynamic(
    () => import(`@/content/${slug}.mdx`),
    { ssr: false } // ensures it only renders on client
  );

  return (
    <section>
      {/* <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Joy Mwende Karani',
              name: 'My Portfolio',
            },
          }),
        }}
      /> */}
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>

      <div className="flex flex-wrap gap-2 mt-2 mb-8 text-sm text-neutral-600 dark:text-neutral-400">
        <p>{formatDate(post.metadata.publishedAt)}</p>
        {post.metadata.tags && (
          <div className="flex flex-wrap gap-2">
            {post.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-md text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <article className="prose">
      <Post />

        {/* <CustomMDX source={post.content} /> */}
      </article>
    </section>
  )
}
