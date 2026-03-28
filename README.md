# Next.js 博客系统

一个基于 Next.js + Prisma + MySQL 的极简博客系统。

## 功能特性

- ✅ 文章列表展示
- ✅ Markdown 渲染
- ✅ 文章阅读量统计
- ✅ 管理后台（增删改查）
- ✅ 简单的密码保护
- ✅ 响应式设计

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 配置数据库
# 编辑 .env 文件，设置 DATABASE_URL

# 执行数据库迁移
npx prisma migrate deploy

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 默认账号

- 管理后台密码：`your-secret-password-123`（在 .env 中修改）

## 项目结构

```
├── prisma/
│   └── schema.prisma      # 数据库模型
├── src/
│   ├── app/               # 页面路由
│   │   ├── page.tsx       # 首页（文章列表）
│   │   ├── blog/[slug]/   # 文章详情页
│   │   ├── admin/         # 管理后台
│   │   └── api/           # API 接口
│   └── lib/
│       └── prisma.ts      # 数据库客户端
└── DEPLOY.md              # 部署指南
```

## 部署

详见 [DEPLOY.md](./DEPLOY.md)

推荐部署到 Vercel + PlanetScale（免费方案）

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: MySQL + Prisma
- **Markdown**: react-markdown

## License

MIT
