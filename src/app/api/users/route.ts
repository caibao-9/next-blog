import { NextResponse } from 'next/server'

// CORS 响应头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

interface User {
  id: number
  name: string
  email: string
}

// 内存存储（实际项目用数据库）
let users: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
]

// 处理 OPTIONS 预检请求
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET /api/users
export async function GET() {
  return NextResponse.json(users, { headers: corsHeaders })
}

// POST /api/users
export async function POST(request: Request) {
  const body = await request.json()
  const newUser = {
    id: Date.now(),
    name: body.name,
    email: body.email,
  }
  users.push(newUser)
  return NextResponse.json(newUser, { status: 201, headers: corsHeaders })
}

// PUT /api/users?id=xxx
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '')
  const body = await request.json()

  const index = users.findIndex(u => u.id === id)
  if (index === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404, headers: corsHeaders }
    )
  }

  users[index] = { ...users[index], ...body }
  return NextResponse.json(users[index], { headers: corsHeaders })
}

// DELETE /api/users?id=xxx
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '')

  users = users.filter(u => u.id !== id)
  return NextResponse.json({ success: true }, { headers: corsHeaders })
}
