import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { prisma } from '@/lib/prisma'

interface Props {
  params: { slug: string }
}

export default async function BlogPost({ params }: Props) {
  const post = await prisma.post.update({
    where: { slug: params.slug },
    data: { views: { increment: 1 } },
  })

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900"
          >
            ← 返回首页
          </Link>
        </div>
      </header>

      {/* Article */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="mx-2">·</span>
            <span>{post.views} 次阅读</span>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900"
        >
          ← 返回首页
        </Link>
      </footer>
    </div>
  )
}
