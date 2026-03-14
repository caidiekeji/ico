# 大鲸图标 - 网站图标获取 API

获取任意网站的 favicon 图标，提供 API 接口服务。部署在 Cloudflare Pages。

## 功能特点

- 🚀 获取任意网站的 favicon 图标
- 📐 支持多种图标尺寸 (16/32/48/64/128/256)
- 🌐 提供 RESTful API 接口
- ⚡ 部署在 Cloudflare Pages，全球 CDN 加速
- 🔄 多数据源备份，确保图标获取成功率

## 部署到 Cloudflare Pages

### 方式一：通过 Cloudflare Dashboard（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. 选择你的 GitHub 仓库
4. 配置构建设置：
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages@latest`
   - **Build output directory**: `.vercel/output/static`
5. 添加环境变量：
   - `NODE_VERSION` = `18` 或 `20`
6. 点击 **Save and Deploy**

## 本地开发

```bash
npm install
npm run dev
```

## API 使用说明

```
GET /api/icon?url=<domain>&size=<size>
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | string | 是 | 网站域名 |
| size | number | 否 | 图标尺寸 (16-256) |

## License

MIT