'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function EditPostForm() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [published, setPublished] = useState(true)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasStoredPassword, setHasStoredPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPassword = localStorage.getItem('adminPassword')
      if (savedPassword) {
        setPassword(savedPassword)
        setHasStoredPassword(true)
      }
      
      if (slug) {
        fetchPost(savedPassword || '')
      }
    }
  }, [slug])

  const fetchPost = async (pwd: string) => {
    try {
      const res = await fetch(`/api/posts/${slug}?adminPassword=${pwd}`)
      if (res.ok) {
        const data = await res.json()
        setTitle(data.title)
        setContent(data.content)
        setExcerpt(data.excerpt || '')
        setPublished(data.published)
      } else {
        alert('获取文章失败')
        router.push('/admin')
      }
    } catch (error) {
      alert('获取文章失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          published,
          adminPassword: password,
        }),
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        alert('保存失败')
      }
    } catch (error) {
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        加载中...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">编辑文章</h1>
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
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="文章标题"
              required
            />
          </div>

          {/* Slug (readonly) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL 标识
            </label>
            <div className="flex items-center px-3 py-2 bg-gray-100 rounded-md text-gray-600">
              <span className="mr-2">/blog/</span>
              <span>{slug}</span>
            </div>
          </div>

          {/* Published */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">已发布</span>
            </label>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              摘要
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
              placeholder="文章内容"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={saving || !title || !content}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : '保存修改'}
            </button>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900"
            >
              取消
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default function EditPost() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <EditPostForm />
    </Suspense>
  )
}
