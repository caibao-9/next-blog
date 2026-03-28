# 部署指南

## 方案一：部署到 Vercel（推荐，免费）

### 1. 准备代码

```bash
# 确保代码已提交到 Git
git add .
git commit -m "init blog"
```

### 2. 创建 Vercel 账号

1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 "Add New Project"
4. 导入你的 Git 仓库

### 3. 配置环境变量

在 Vercel 项目设置中，添加以下环境变量：

| 名称 | 值 |
|------|-----|
| `DATABASE_URL` | 你的 MySQL 数据库连接地址 |
| `ADMIN_PASSWORD` | 管理员密码 |

### 4. 数据库准备

Vercel 只部署前端，**数据库需要自己准备**：

**选项 A：PlanetScale（免费 MySQL，推荐）**
1. 注册 https://planetscale.com
2. 创建数据库
3. 获取连接字符串
4. 格式：`mysql://username:password@host/database?sslaccept=strict`

**选项 B：阿里云/腾讯云 RDS**
- 购买 MySQL 实例
- 开放外网访问
- 创建数据库和用户

**选项 C：本地数据库 + 内网穿透（测试用）**
- 使用 ngrok 或花生壳暴露本地 MySQL
- 不推荐生产环境使用

### 5. 部署命令

Vercel 会自动检测 Next.js 项目，使用默认设置即可：

- Build Command: `prisma generate && next build`
- Output Directory: `.next`

### 6. 数据库迁移

部署后，在本地运行：

```bash
# 使用生产数据库 URL 执行迁移
DATABASE_URL="你的生产数据库URL" npx prisma migrate deploy
```

---

## 方案二：服务器部署（有自己的服务器）

### 使用 PM2 部署

```bash
# 服务器上安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移
npx prisma migrate deploy

# 构建
npm run build

# 使用 PM2 启动
npm install -g pm2
pm2 start npm --name "blog" -- start
```

### 使用 Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

构建并运行：

```bash
docker build -t my-blog .
docker run -p 3000:3000 -e DATABASE_URL="..." -e ADMIN_PASSWORD="..." my-blog
```

---

## 方案三：完全免费方案（适合测试）

如果你不想买数据库，可以用：

1. **前端**：Vercel（免费）
2. **数据库**：Supabase PostgreSQL（免费额度足够）

需要修改：
1. 将 `schema.prisma` 的 `provider` 从 `mysql` 改为 `postgresql`
2. 重新生成迁移
3. 使用 Supabase 的连接字符串

---

## 部署后验证

1. 访问首页，确认显示正常
2. 访问 `/admin`，用密码登录
3. 创建一篇文章
4. 确认文章能正常显示

## 常见问题

**Q: 部署后 API 返回 500？**
A: 检查环境变量是否正确设置，特别是 `DATABASE_URL`

**Q: 数据库连不上？**
A: 确认数据库允许外网访问，防火墙已开放端口

**Q: 样式丢失？**
A: 检查 `next.config.ts` 的 `output` 配置，Vercel 不需要设置 `output: 'export'`
