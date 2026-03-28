'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasStoredPassword, setHasStoredPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPassword = localStorage.getItem('adminPassword')
      if (savedPassword) {
        setPassword(savedPassword)
        setHasStoredPassword(true)
      }
    }
  }, [])

  // 自动生成 slug
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish: boolean = true) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          adminPassword: password,
        }),
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        alert(data.error || '创建失败')
      }
    } catch (error) {
      alert('创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">写文章</h1>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900"
            >
              ← 返回管理后台
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {/* Password */}
          {!hasStoredPassword && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理员密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入管理员密码"
              />
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="文章标题"
              required
            />
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL 标识 (slug) *
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="article-url"
                required
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              摘要（可选，不填则自动截取正文）
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="文章摘要"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容 (支持 Markdown) *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="# 标题

正文内容...

## 二级标题

- 列表项
- 列表项

**粗体** *斜体*"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading || !title || !slug || !content}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '发布文章'}
            </button>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900"
            >
              取消
            </Link>
          </div>
        </form>

        {/* Preview */}
        {content && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">预览</h3>
            <div className="prose prose-gray max-w-none border-t border-gray-100 pt-4">
              <div className="text-gray-500 text-sm mb-2">正文预览（前 500 字）</div>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded">
                {content.slice(0, 500)}
                {content.length > 500 && '...'}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
