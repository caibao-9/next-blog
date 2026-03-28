'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  views: number
  createdAt: string
  updatedAt: string
}

export default function Admin() {
  const [posts, setPosts] = useState<Post[]>([])
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedPassword = localStorage.getItem('adminPassword')
    if (savedPassword) {
      setPassword(savedPassword)
      fetchPosts(savedPassword)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchPosts = async (pwd: string) => {
    try {
      const res = await fetch(`/api/admin/posts?adminPassword=${pwd}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
        setIsAuthenticated(true)
        localStorage.setItem('adminPassword', pwd)
      } else {
        alert('密码错误')
        localStorage.removeItem('adminPassword')
      }
    } catch (error) {
      alert('获取文章失败')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    fetchPosts(password)
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const res = await fetch(
        `/api/posts/${slug}?adminPassword=${password}`,
        { method: 'DELETE' }
      )
      if (res.ok) {
        setPosts(posts.filter((p) => p.slug !== slug))
      } else {
        alert('删除失败')
      }
    } catch (error) {
      alert('删除失败')
    }
  }

  const handleTogglePublish = async (post: Post) => {
    try {
      const res = await fetch(`/api/posts/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          content: '', // 不需要更新内容
          published: !post.published,
          adminPassword: password,
        }),
      })
      if (res.ok) {
        setPosts(
          posts.map((p) =>
            p.slug === post.slug ? { ...p, published: !p.published } : p
          )
        )
      }
    } catch (error) {
      alert('更新失败')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        加载中...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">管理后台登录</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理员密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入密码"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              登录
            </button>
          </form>
          <Link
            href="/"
            className="block text-center mt-4 text-gray-600 hover:text-gray-900"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                + 写文章
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                返回首页 →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <p className="text-gray-500 mb-4">还没有文章</p>
            <Link
              href="/admin/new"
              className="text-blue-600 hover:text-blue-800"
            >
              写第一篇文章 →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                    标题
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                    状态
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                    阅读量
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                    创建时间
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-700">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.published ? '已发布' : '草稿'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          查看
                        </Link>
                        <Link
                          href={`/admin/edit?slug=${post.slug}`}
                          className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
