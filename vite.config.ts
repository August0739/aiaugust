import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import netlify from '@netlify/vite-plugin-tanstack-start'
import contentCollections from '@content-collections/vite'

const config = defineConfig({
  base: '/aiaugust/',
  resolve: { tsconfigPaths: true },
  plugins: [
    contentCollections(),
    tailwindcss(),
    // netlify(),
    tanstackStart({
      prerender: {
        enabled: true, // 开启预渲染
        autoSubfolderIndex: true, // 让 /blog 生成 /blog/index.html
        crawlLinks: true, // 自动发现并预渲染所有链接页面
        failOnError: true, // 预渲染失败就中断，方便排查
      },
    }),
    viteReact(),
  ],
})

export default config
