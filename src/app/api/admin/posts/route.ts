import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/posts - 获取所有文章（包括未发布）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminPassword = searchParams.get('adminPassword')

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        published: true,
        views: true,
        createdAt: true,
        updatedAt: true,
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
