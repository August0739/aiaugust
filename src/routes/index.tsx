import { createFileRoute, Link } from '@tanstack/react-router'

import { allPosts } from 'content-collections'

import { PostCard } from '@/components/post-card'
import { ArrowRight } from '@/components/icons'
import { newestPosts } from '@/lib/blog'
import { author, cdnImage, tags } from '@/lib/site'

export const Route = createFileRoute('/')({
  component: Home,
})

const focusAreas = [
  { label: '大语言模型', detail: '架构演进 · 规模定律' },
  { label: '推理与评估', detail: '基准设计 · 测试时计算' },
  { label: '多智能体系统', detail: '协作协议 · 工具使用' },
]

function Home() {
  const latest = newestPosts(allPosts).slice(0, 3)
  const [first, ...rest] = latest

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <img
          src={cdnImage('/img/hero.png', 1600)}
          alt=""
          aria-hidden="true"
          width={1376}
          height={768}
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-cover object-right opacity-40 dark:opacity-70 [mask-image:linear-gradient(to_right,transparent_5%,black_60%)]"
        />
        <div className="relative mx-auto max-w-5xl px-5 py-20 sm:py-28">
          <p className="rise font-mono text-xs uppercase tracking-[0.2em] text-accent">
            // 你好，我是{author.name}
          </p>
          <h1 className="rise mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl [animation-delay:80ms]">
            <span className="text-gradient">AI研究员</span>
            <br className="sm:hidden" />
            与探索者
            <span className="caret" />
          </h1>
          <p className="rise mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg [animation-delay:160ms]">
            {author.bio}
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3 [animation-delay:240ms]">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-bg transition hover:opacity-90"
            >
              阅读文章 <ArrowRight />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-bg/60 px-5 py-2.5 text-sm backdrop-blur transition hover:border-accent hover:text-accent"
            >
              关于我
            </Link>
          </div>
          <dl className="rise mt-14 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 [animation-delay:320ms]">
            {focusAreas.map((area) => (
              <div
                key={area.label}
                className="rounded-xl border border-line bg-elev/70 px-4 py-3 backdrop-blur"
              >
                <dt className="text-sm font-medium">{area.label}</dt>
                <dd className="mt-0.5 font-mono text-xs text-faint">
                  {area.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        className="mx-auto max-w-5xl px-5 pt-16"
        aria-labelledby="latest"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
              Latest
            </p>
            <h2 id="latest" className="mt-2 text-2xl font-bold tracking-tight">
              最新文章
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-accent"
          >
            全部文章 <ArrowRight />
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="mt-8 text-muted">暂无文章，敬请期待。</p>
        ) : (
          <div className="mt-8 grid gap-6">
            {first && <PostCard post={first} featured />}
            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section
        className="mx-auto max-w-5xl px-5 pt-16"
        aria-labelledby="topics"
      >
        <h2 id="topics" className="text-sm font-medium text-muted">
          按主题浏览
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              to="/blog"
              search={{ tag }}
              className="rounded-full border border-line px-4 py-1.5 text-sm text-muted transition hover:border-accent hover:text-accent"
            >
              # {tag}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
