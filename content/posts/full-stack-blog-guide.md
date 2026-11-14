---
date: '2026-11-14'
slug: full-stack-blog-guide
title: '全栈实战：从静态博客搭建到 GitHub Pages 自动化部署全景指南'
summary: '这是一份从零开始的建站记录。涵盖了 Hugo 静态建站基础、主流托管平台对比、利用 AI Agent 极速生成源码、现代前端技术栈（Vite + TanStack Start）的本地化改造，以及最终通过 GitHub Actions 实现自动化部署的完整避坑指南。'
categories:
  - 大模型
  - 行业观察
image: /img/cover-deploying.png
imageAlt: '全栈实战建站指南'
---

在 AI 时代，拥有一个属于自己的技术博客不再是一件难事，但真正想要把它做到“极客范儿”、完全可控且免费托管，依然需要趟过不少工程上的坑。

本文将全景式复盘我构建这个 AI 前沿笔记博客的全过程：从最初的静态网站生成器选型，到利用 AI 快速生成代码，再到剥离繁杂配置，最终将其成功部署到 GitHub Pages，并打通了自动发布流程。

## 第一章：静态建站与托管平台选型

### 1.1 Hugo 极速入门

静态网站生成器是博客的骨架。Hugo 凭借其 Go 语言编写的极速编译、单文件安装和丰富的主题生态，成为了首选。

- **安装**：推荐安装 Extended 版本（支持 SCSS）。
- **建站**：`hugo new site my-blog`
- **配置**：安装 PaperMod 等流行主题，配置菜单、分类和标签。
- **预览与构建**：`hugo server -D` 本地预览，`hugo --minify` 构建生产版本。

### 1.2 静态托管平台对比：Netlify vs Vercel vs GitHub Pages

对于生成好的 `public/` 目录，我们有三家主流平台可选：

| 对比维度     | GitHub Pages             | Netlify                         | Vercel                   |
| :----------- | :----------------------- | :------------------------------ | :----------------------- |
| **国内访问** | 极不稳定                 | 相对较好                        | 依赖自定义域名及优化     |
| **免费额度** | 完全免费，100GB带宽      | 100GB带宽，300分钟构建          | 100GB带宽，6000分钟构建  |
| **核心优势** | 纯开源/个人免费，集成Git | 最友好的 Git 自动部署，提供预览 | 极致的前端性能与边缘网络 |
| **商业限制** | 禁止电商/在线业务        | 免费版未明确限制                | Hobby版禁止商业用途      |

**结论**：如果追求纯粹的免费与代码管理，GitHub Pages 是最终归宿；如果追求极致的部署体验与表单等全栈功能，Netlify 是极佳的选择。

## 第二章：AI 驱动的项目生成与本地化

为了追求更惊艳的视觉和更现代的前端架构，我放弃了传统的博客主题，决定让 **Netlify AI Agent (Claude Opus 5.5)** 直接帮我生成一套现代前端框架。

### 2.1 设计提示词 (Prompt)

在 Netlify 的 Agent 界面输入以下指令（重点提示技术栈和中文环境）：

> “请为我构建一个专注于‘AI技术前沿’的个人博客网站。采用极简、未来的科技风（深色模式为主），所有界面元素必须使用简体中文。使用 Astro 或 Vite + React 等技术栈。请生成多篇Markdown占位文章。”

### 2.2 本地拉取与启动

AI 生成完毕后，使用 Netlify CLI 将源码克隆到本地进行改造：

```bash
# 登录并克隆
netlify login
netlify clone aiaugust
# 安装依赖并运行
npm install
npm run dev
```

### 2.3 读懂生成的技术栈

AI 生成的是一套极其现代化的组合：

- **Vite**：作为中央厨房，瞬间将代码打包成浏览器懂的快餐。
- **React**：像乐高积木一样拼接网页UI。
- **TanStack Start**：负责路由导航和数据加载。
- **TailwindCSS**：直接在代码里写样式，打造深色科技感。
- **Content Collections**：负责解析本地的 Markdown 文章数据。

## 第三章：代码打磨与排错记录

在实际开发中，我们踩了两个典型的坑，这也是现代框架经常遇到的问题：

### 3.1 剥离无用的云服务依赖

由于最初是在 Netlify 生成的，代码里引用了很多 Netlify 专属的云函数或 CDN 图片裁剪服务 `cdnImage()`。

- **解决**：在 `vite.config.ts` 中注释掉 `netlify()` 插件；在代码中找到 `<img src={cdnImage(...)} />`，直接替换为原始的 `<img src={post.image} />`。

### 3.2 图片路径动态拼接（核心坑点）

部署到 GitHub Pages 后，网站通常位于二级目录（如 `https://username.github.io/repo/`）。
如果 Markdown 里写 `image: /img/cover.png`，浏览器会去网站根目录找，必然导致图片裂开。

- **解决**：在 React 代码中利用 Vite 的环境变量自动拼接前缀：

```jsx
<img src={`${import.meta.env.BASE_URL}${post.image.replace(/^\//, '')}`} />
```

## 第四章：GitHub Pages 自动化部署全流程

这是将本地代码推向世界的最后一步，全程通过 GitHub Actions 实现 CI/CD。

### 4.1 解决 SPA 刷新 404 问题

因为项目基于客户端路由，直接在线上刷新深层页面（如 `/posts/123`），服务器会找不到文件。

- **解决**：在 `public` 目录下新建一个 `404.html`，内容与 `index.html` 相同。当服务器找不到页面时，会把控制权交还给前端路由。

### 4.2 修改 Vite 基础路径

在 `vite.config.ts` 的 `defineConfig` 中添加你的仓库名，确保打包后的静态资源路径正确：

```typescript
export default defineConfig({
  base: '/你的仓库名/',
  // ... 其他配置
})
```

### 4.3 编写 Actions 配置文件

在项目根目录新建 `.github/workflows/deploy.yml`，配置部署流水线。

- **注意**：TanStack Start 的打包产物不在 `dist`，而在 `.output/public` 或 `dist/client`。务必确认路径并填入 `path` 字段。

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: ['main']
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist/client' # 关键：对应框架的输出目录
      - uses: actions/deploy-pages@v4
```

### 4.4 开启 GitHub Pages

1. 将代码推送到 GitHub。
2. 在仓库 `Settings -> Pages` 中，将 Source 更改为 **`GitHub Actions`**。
3. 等待 Actions 跑完绿勾，你的网站就正式上线了！

## 第五章：日常运维与发文指南

万事俱备，以后你只需要专注于内容创作。发布一篇新文章的步骤极为简单：

1. **准备图片**：将 16:9 的封面图放入 `public/img/` 目录。
2. **新建 Markdown**：在 `content/posts/` 下新建 `.md` 文件，并写好 Front Matter：

```yaml
---
date: '2026-11-20'
slug: my-new-post
title: '文章标题'
summary: '文章摘要'
categories:
  - 大模型
image: /img/your-cover.png
---
```

3. **本地预览**：运行 `npm run dev` 检查样式。
4. **一键发布**：终端执行以下命令，剩下的全部交给 GitHub Actions：

```bash
git add .
git commit -m "新增文章：xxxx"
git push
```

等待一两分钟，刷新线上页面，新文章就完美呈现了。

## 结语

从最早依赖现成主题的 Hugo，到利用 AI 生成前沿的 React 应用；从被路径问题折磨，到熟练配置 GitHub Actions 自动化流水线。这个博客的建成，不仅是一个交付产物，更是理解现代前端工程化的一块绝佳垫脚石。

希望这份指南能帮到想要搭建个人站点的你！
