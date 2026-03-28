import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/posts - 获取文章列表
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        views: true,
        createdAt: true,
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - 创建文章（需要密码验证）
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, slug, content, excerpt, adminPassword } = body

    // 简单的密码验证
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.slice(0, 200) + '...',
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
