# 部署指南

## Supabase + Vercel（完全免费方案，推荐！）

### 第一步：创建 Supabase 项目

1. 访问 https://supabase.com
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 填写信息：
   - **Name**: my-blog (或其他名字)
   - **Database Password**: 设置一个强密码（保存好！）
   - **Region**: 选 Asia (Singapore) 或 Asia (Tokyo) 离中国近
5. 等待项目创建完成（约 1-2 分钟）

### 第二步：获取数据库连接字符串

1. 进入项目后，点击左侧 **Project Settings** (齿轮图标)
2. 点击 **Database** 标签
3. 找到 **Connection string** 部分
4. 选择 **URI** 格式
5. 复制连接字符串，把 `[YOUR-PASSWORD]` 换成你的实际密码

格式像这样：
```
postgresql://postgres:your-password@db.xxxxxxxxx.supabase.co:5432/postgres
```

### 第三步：执行数据库迁移

在本地终端运行：

```bash
# 用 Supabase 的连接字符串执行迁移
DATABASE_URL="postgresql://postgres:你的密码@db.xxx.supabase.co:5432/postgres" npx prisma migrate deploy

# 然后重新生成 Prisma Client
DATABASE_URL="postgresql://postgres:你的密码@db.xxx.supabase.co:5432/postgres" npx prisma generate
```

看到成功消息就可以了。

### 第四步：部署到 Vercel

1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 点击 **"Add New Project"**
4. 导入你的 GitHub 仓库
5. 在 **Environment Variables** 中添加：

| 名称 | 值 |
|------|-----|
| `DATABASE_URL` | `postgresql://postgres:你的密码@db.xxx.supabase.co:5432/postgres` |
| `ADMIN_PASSWORD` | 你的管理员密码（比如 my-secret-123）|

6. 点击 **Deploy**
7. 等待部署完成（约 2-3 分钟）

### 第五步：访问你的博客

Vercel 会给你分配一个域名，比如：
```
https://next-demo-xxx.vercel.app
```

打开这个链接，应该能看到博客首页了！

---

## 使用你的博客

### 管理后台

1. 访问 `https://你的域名/admin`
2. 输入密码（就是 ADMIN_PASSWORD 设置的）
3. 点击 **"写文章"**
4. 填写：
   - **标题**：文章标题
   - **slug**：URL 标识（如 `hello-world`）
   - **内容**：用 Markdown 写
5. 点击 **发布文章**

### Markdown 支持

写内容时支持：
```markdown
# 一级标题
## 二级标题

**粗体** *斜体*

- 列表项
- 列表项

1. 有序列表
2. 有序列表

\`\`\`javascript
console.log('代码块')
\`\`\`

[链接](https://example.com)
```

---

## 其他部署方案

### 自己的服务器

```bash
# 服务器上安装依赖
npm install

# 设置环境变量
export DATABASE_URL="postgresql://..."
export ADMIN_PASSWORD="..."

# 执行迁移
npx prisma migrate deploy

# 构建
npm run build

# 启动
npm start
```

### Docker 部署

```bash
# 构建镜像
docker build -t my-blog .

# 运行
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e ADMIN_PASSWORD="..." \
  my-blog
```

---

## 常见问题

**Q: 部署后显示 "Internal Server Error"？**
A: 检查 Vercel 的环境变量是否设置正确，特别是 DATABASE_URL

**Q: 数据库连不上？**
A: Supabase 默认会阻止某些 IP，检查 Supabase 的 Network Restrictions 设置

**Q: 如何绑定自己的域名？**
A: Vercel 项目 → Settings → Domains → 添加域名

**Q: Supabase 免费额度是多少？**
A: 500MB 数据库，每月 5GB 流量，对于个人博客完全够用
