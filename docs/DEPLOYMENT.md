# 生产部署手册

本项目使用 Docker Compose 运行应用和 Caddy。应用容器不对公网开放；只有 Caddy 监听 80/443 并自动取得、续期 TLS 证书。

## 首次部署

1. 在服务器创建一个仅用于部署的普通用户，并给它 Docker 使用权限；不要用 root 日常操作。
2. 安装 Docker Engine 与 Compose plugin，开放防火墙的 TCP 80、443；SSH 仅允许你自己的管理地址或密钥登录。
3. 将仓库克隆到服务器，例如 `/opt/blog`，然后创建权限为 `600` 的 `.env`：

   ```dotenv
   DOMAIN=blog.tsukimakura.com
   NEXT_PUBLIC_SITE_URL=https://blog.tsukimakura.com
   NEXT_PUBLIC_SITE_NAME=Tsukimakura's Notes
   ```

4. DNS 生效后，在仓库目录运行：

   ```bash
   docker compose up -d --build
   docker compose ps
   docker compose logs -f caddy
   ```

首次签发证书时，Caddy 必须能被公网通过 80/443 访问。证书和续期状态保存在 `caddy_data` Docker volume；**不要删除该 volume**。

## 更新与回滚

文章或代码提交后，在服务器执行：

```bash
git pull --ff-only
docker compose up -d --build
docker image prune -f
```

建议由 GitHub Actions 用 SSH 执行相同的有限命令，并在发布前执行 `npm run typecheck`、`npm run lint`、`npm run build`。回滚使用已验证过的 Git commit 后重新构建；数据库加入后，代码发布与 schema migration 必须分开设计。

## 阿里云 DNS 与域名

域名注册商和 DNS 服务商可以是同一家。当前方案不依赖 Cloudflare：在阿里云控制台的 **云解析 DNS** 中，为 `tsukimakura.com` 新增以下记录：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | `blog` | 服务器公网 IPv4 |

不要填写服务器内网 IP。若服务器有 IPv6 且已正确配置防火墙，可额外添加 `AAAA blog → 服务器 IPv6`；否则不要添加 AAAA 记录。DNS 生效后，可用 `dig +short blog.tsukimakura.com` 检查返回地址。

## TLS 证书

Caddy 会为 `blog.tsukimakura.com` 自动向 Let's Encrypt 申请并续期证书。它通过 HTTP-01 验证域名所有权，因此 DNS 必须已指向服务器，且公网 TCP 80、443 必须能到达 Caddy。无需在阿里云手动购买、下载或续期证书。

## 可选：接入 Cloudflare

Cloudflare 不是域名注册商；即使域名在阿里云注册，也可以把 DNS 托管切换到 Cloudflare。只有在需要 CDN、WAF、DDoS 缓解或更精细限流时再做此变更：在 Cloudflare 添加域名后，将阿里云处的权威 nameserver 改为 Cloudflare 提供的两个 nameserver，随后创建 `A blog → 服务器 IPv4` 并开启代理。SSL/TLS 模式必须选 **Full (strict)**，绝不能选 Flexible。

## 日常运维清单

- 每周：检查 `docker compose ps`、错误日志和主机磁盘空间。
- 每月：更新基础镜像与依赖，重新构建；检查主机与访问日志的异常。
- 每天：把仓库、`.env`（加密保存）和未来 PostgreSQL 数据库做异地备份。
- 每季度：从备份恢复到临时环境，确认恢复流程真实可用；轮换 SSH 密钥、部署密钥和 API token。
- 告警：配置 Uptime Kuma/Healthchecks 对 `https://blog.tsukimakura.com` 做外部可用性检测，并接入错误追踪服务。

## 故障排查

```bash
docker compose ps
docker compose logs --tail=100 app
docker compose logs --tail=100 caddy
curl -I https://blog.tsukimakura.com
```

证书签发失败时，优先检查域名 A/AAAA 记录是否指向当前服务器、80/443 是否被云防火墙拦截、是否有另一套 Nginx/Apache 占用端口。不要手动申请或复制证书：Caddy 自动管理更可靠。
