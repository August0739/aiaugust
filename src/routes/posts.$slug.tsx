import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { allPosts } from 'content-collections'

import { PostMeta } from '@/components/post-meta'
import { ArrowRight } from '@/components/icons'
import { findPost, newestPosts } from '@/lib/blog'
import { cdnImage, siteName } from '@/lib/site'

export const Route = createFileRoute('/posts/$slug')({
  loader: async ({ params }) => {
    return findPost(allPosts, params.slug)
  },
  head: ({ loaderData: post }) => ({
    meta: post
      ? [
          { title: `${post.title} | ${siteName}` },
          { name: 'description', content: post.summary },
          { property: 'og:title', content: post.title },
          { property: 'og:description', content: post.summary },
          { property: 'og:type', content: 'article' },
          ...(post.image
            ? [{ property: 'og:image', content: post.image }]
            : []),
          {
            property: 'article:published_time',
            content: `${post.date}T00:00:00Z`,
          },
          ...post.categories.map((category) => ({
            property: 'article:tag',
            content: category,
          })),
        ]
      : [],
  }),
  component: PostPage,
})

const COPY_ICON =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'

/** Wraps each <pre> with a language label and a copy-to-clipboard button. */
function useCodeBlocks(
  ref: React.RefObject<HTMLDivElement | null>,
  key: string,
) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const cleanups: (() => void)[] = []
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.parentElement?.classList.contains('code-block')) return
      const code = pre.querySelector('code')
      const lang =
        code?.className
          .match(/language-([\w-]+)/)?.[1]
          ?.replace('plaintext', 'text') ?? 'text'
      const wrapper = document.createElement('div')
      wrapper.className = 'code-block'
      const bar = document.createElement('div')
      bar.className = 'code-block-bar'
      const label = document.createElement('span')
      label.textContent = lang
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'copy-btn'
      btn.setAttribute('aria-label', '复制代码')
      btn.innerHTML = `${COPY_ICON}<span>复制</span>`
      let timer: ReturnType<typeof setTimeout> | undefined
      const onClick = async () => {
        const text = code?.innerText ?? pre.innerText
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          const ta = document.createElement('textarea')
          ta.value = text
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          ta.remove()
        }
        btn.dataset.copied = 'true'
        btn.querySelector('span')!.textContent = '已复制'
        clearTimeout(timer)
        timer = setTimeout(() => {
          btn.dataset.copied = 'false'
          btn.querySelector('span')!.textContent = '复制'
        }, 1800)
      }
      btn.addEventListener('click', onClick)
      bar.append(label, btn)
      pre.replaceWith(wrapper)
      wrapper.append(bar, pre)
      cleanups.push(() => {
        btn.removeEventListener('click', onClick)
        clearTimeout(timer)
      })
    })
    return () => cleanups.forEach((fn) => fn())
  }, [ref, key])
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-accent to-accent-2"
      style={{ transform: `scaleX(${progress})` }}
    />
  )
}

function PostPage() {
  const post = Route.useLoaderData()
  const contentRef = useRef<HTMLDivElement>(null)
  useCodeBlocks(contentRef, post.slug)

  const sorted = newestPosts(allPosts)
  const index = sorted.findIndex((p) => p.slug === post.slug)
  const newer = index > 0 ? sorted[index - 1] : undefined
  const older = index < sorted.length - 1 ? sorted[index + 1] : undefined

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-5 pt-10 sm:pt-14">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-accent"
        >
          <span className="rotate-180">
            <ArrowRight />
          </span>
          返回文章列表
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap gap-2">
            {post.categories.map((tag) => (
              <Link
                key={tag}
                to="/blog"
                search={{ tag }}
                className="rounded-full border border-accent/40 bg-accent-soft px-3 py-0.5 text-xs text-accent transition hover:border-accent"
              >
                # {tag}
              </Link>
            ))}
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-[2.6rem] sm:leading-[1.2]">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {post.summary}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-line py-4">
            <PostMeta
              date={post.date}
              wordCount={post.wordCount}
              readingMinutes={post.readingMinutes}
            />
          </div>
        </header>

        {post.image && (
          <img
            src={post.image}
            alt={post.imageAlt ?? post.title}
            width={1376}
            height={768}
            className="mt-8 aspect-video w-full rounded-2xl border border-line object-cover"
          />
        )}

        <div
          ref={contentRef}
          className="article prose mt-10 max-w-none break-words prose-headings:font-semibold prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <nav
          aria-label="更多文章"
          className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
        >
          {older ? (
            <Link
              to="/posts/$slug"
              params={{ slug: older.slug }}
              className="rounded-xl border border-line p-4 transition hover:border-accent/60"
            >
              <span className="font-mono text-xs text-faint">← 上一篇</span>
              <span className="mt-1 block font-medium">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link
              to="/posts/$slug"
              params={{ slug: newer.slug }}
              className="rounded-xl border border-line p-4 text-right transition hover:border-accent/60"
            >
              <span className="font-mono text-xs text-faint">下一篇 →</span>
              <span className="mt-1 block font-medium">{newer.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </>
  )
}
