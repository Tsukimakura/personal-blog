# Personal Blog

一个以 Git + MDX 为内容源、Next.js 为应用层、Caddy 为边缘代理的个人博客基础工程。

## 本地使用

需要 Node.js 22+：

```bash
cp .env.example .env
npm install
npm run dev
```

访问 `http://localhost:3000`。文章存放在 `content/posts/*.mdx`，front matter 必填字段为 `title`、`description`、`date`，可选 `tags`。

## 已具备

- MDX 文章、标签、阅读时间、RSS、sitemap 与基础 SEO
- 响应式页面与自有样式 token
- 基础 HTTP 安全响应头与受限 server action 请求体
- 非 root、只读应用容器，以及 HTTPS 自动化的 Caddy 部署

详见 [生产部署手册](docs/DEPLOYMENT.md)。在加入登录、表单、图片上传或数据库前，请先补对应的输入校验、CSRF/限流、备份与迁移策略。
