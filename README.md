# 前沿 · AI 笔记

一个专注于“AI 技术前沿”的中文个人技术博客：首页个人简介、按标签筛选的文章列表、带字数统计与阅读时长的文章详情页，以及“关于我”页面。默认深色模式，支持一键切换浅色模式，并针对手机端阅读做了适配。

## 功能

- **首页**：“AI研究员与探索者”首屏，按时间展示最新 3 篇文章
- **文章列表 `/blog`**：按标签筛选（大模型、AI智能体、行业观察、论文解读），筛选状态保存在 URL（`/blog?tag=大模型`）
- **文章详情 `/posts/:slug`**：字数统计、阅读时长估算、阅读进度条、代码语法高亮与一键复制、上一篇/下一篇
- **关于我 `/about`**：个人简介、在做的 AI 项目、GitHub 与 X/Twitter 链接
- 全局深色/浅色模式切换（默认深色，选择会保存在浏览器中）

## 技术栈

- [TanStack Start](https://tanstack.com/start)（Vite + React 19）
- [Content Collections](https://www.content-collections.dev/)：Markdown 文章，构建时校验与渲染
- `marked` + `highlight.js`（构建时语法高亮）+ `sanitize-html`
- Tailwind CSS v4 + Typography 插件
- 部署于 Netlify，图片通过 Netlify Image CDN 输出 WebP

## 本地运行

```bash
pnpm install
netlify dev        # 推荐：包含 Netlify Image CDN 本地模拟
# 或
pnpm dev           # 仅 Vite 开发服务器（图片 CDN 地址不可用）
pnpm test          # 单元测试
```

## 写一篇新文章

在 `content/posts/` 下新建 `.md` 文件：

```markdown
---
date: '2026-12-01'
slug: my-new-post
title: '文章标题'
summary: '一句话摘要'
categories:
  - 大模型
image: /img/cover-scaling.png
imageAlt: ''
---

正文……
```

字数与阅读时长会在构建时自动计算。站点名称、作者信息、社交链接与标签列表位于 `src/lib/site.ts`。
