export const siteName = '前沿 · AI 笔记'
export const siteDescription =
  'AI 研究员与探索者的个人博客：记录大模型、AI 智能体、论文解读与行业观察。'

export const author = {
  name: 'August',
  title: 'AI研究员与探索者',
  bio: '专注于大语言模型、推理能力与多智能体系统的研究与工程实践。相信好的研究应当被清晰地写下来，也相信好的工程能让研究真正落地。',
  github: 'https://github.com/',
  twitter: 'https://x.com/',
}

export const tags = ['大模型', 'AI智能体', '行业观察', '论文解读'] as const

export const navItems = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '文章' },
  { to: '/about', label: '关于我' },
] as const

export function cdnImage(src: string, width: number) {
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp`
}
