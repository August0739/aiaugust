import { createFileRoute, Link } from '@tanstack/react-router'

import { GitHubIcon, XIcon, ArrowRight } from '@/components/icons'
import { author, siteName } from '@/lib/site'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: `关于我 | ${siteName}` },
      { name: 'description', content: `${author.name}：${author.title}。` },
    ],
  }),
  component: AboutPage,
})

const projects = [
  {
    name: 'ReasonBench-Live',
    status: '进行中',
    description:
      '一个持续更新、按时间切分的推理评测集，自动收集新发布的数学与编程竞赛题，用于缓解数据污染问题。',
    stack: ['Python', 'vLLM', '评测框架'],
  },
  {
    name: 'Agent Relay',
    status: '进行中',
    description:
      '轻量级多智能体协作框架，以显式的消息协议和全链路追踪为核心，让智能体系统可观测、可调试。',
    stack: ['TypeScript', '工具调用', '可观测性'],
  },
  {
    name: '长上下文混合架构实验',
    status: '研究中',
    description:
      '对比注意力层与状态空间层在不同配比下的长文本检索与推理表现，探索更高效的下一代模型结构。',
    stack: ['PyTorch', 'Mamba', 'MoE'],
  },
]

const timeline = [
  { year: '2026', text: '专注推理评估与多智能体系统的研究与开源实践' },
  { year: '2024', text: '参与大模型预训练与对齐相关工程工作' },
  { year: '2021', text: '开始系统研究深度学习与自然语言处理' },
]

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
        About
      </p>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div
          aria-hidden="true"
          className="grid size-20 shrink-0 place-items-center rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/20 to-accent-2/20 text-3xl font-bold text-accent"
        >
          {author.name.slice(0, 1)}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {author.name}
          </h1>
          <p className="mt-1 text-gradient font-medium">{author.title}</p>
        </div>
      </div>

      <section className="mt-10 space-y-4 text-[1.0625rem] leading-[1.95] text-muted">
        <p>{author.bio}</p>
        <p>
          我的日常工作在“研究”与“工程”之间来回切换：读论文、跑实验、写代码，再把踩过的坑和想清楚的问题整理成文章。这个博客是我的公开笔记本，关注的主题包括
          <strong className="text-fg">大语言模型的架构演进</strong>、
          <strong className="text-fg">推理能力的评估</strong>与
          <strong className="text-fg">多智能体协作</strong>。
        </p>
        <p>如果你对这些方向感兴趣，欢迎通过下方的社交链接与我交流。</p>
      </section>

      <section className="mt-14" aria-labelledby="projects">
        <h2 id="projects" className="text-xl font-bold tracking-tight">
          目前在做的 AI 项目
        </h2>
        <div className="mt-6 grid gap-4">
          {projects.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-line bg-elev p-5 transition hover:border-accent/50 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono font-medium">{p.name}</h3>
                <span className="flex items-center gap-1.5 text-xs text-accent">
                  <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                  {p.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-xs text-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="path">
        <h2 id="path" className="text-xl font-bold tracking-tight">
          经历
        </h2>
        <ol className="mt-6 space-y-4 border-l border-line pl-6">
          {timeline.map((t) => (
            <li key={t.year} className="relative">
              <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full border-2 border-accent bg-bg" />
              <span className="font-mono text-sm text-accent">{t.year}</span>
              <p className="mt-0.5 text-muted">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14" aria-labelledby="social">
        <h2 id="social" className="text-xl font-bold tracking-tight">
          找到我
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href={author.github}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-line bg-elev p-5 transition hover:border-accent/60"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-fg">
              <GitHubIcon size={20} />
            </span>
            <span className="flex-1">
              <span className="block font-medium">GitHub</span>
              <span className="text-sm text-faint">开源项目与实验代码</span>
            </span>
            <span className="text-faint transition group-hover:text-accent">
              <ArrowRight />
            </span>
          </a>
          <a
            href={author.twitter}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-line bg-elev p-5 transition hover:border-accent/60"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-fg">
              <XIcon size={18} />
            </span>
            <span className="flex-1">
              <span className="block font-medium">X / Twitter</span>
              <span className="text-sm text-faint">论文速递与日常思考</span>
            </span>
            <span className="text-faint transition group-hover:text-accent">
              <ArrowRight />
            </span>
          </a>
        </div>
        <Link
          to="/blog"
          className="mt-10 inline-flex items-center gap-2 text-sm text-accent"
        >
          去看看我写的文章 <ArrowRight />
        </Link>
      </section>
    </div>
  )
}
