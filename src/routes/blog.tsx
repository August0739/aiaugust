import { createFileRoute, Link } from '@tanstack/react-router'

import { allPosts } from 'content-collections'

import { PostCard } from '@/components/post-card'
import { getCategories, newestPosts } from '@/lib/blog'
import { siteName, tags } from '@/lib/site'

type BlogSearch = { tag?: string }

export const Route = createFileRoute('/blog')({
  validateSearch: (search: Record<string, unknown>): BlogSearch => ({
    tag:
      typeof search.tag === 'string' && search.tag.trim()
        ? search.tag.trim()
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: `全部文章 | ${siteName}` },
      {
        name: 'description',
        content: '大模型、AI 智能体、论文解读与行业观察——全部技术文章。',
      },
    ],
  }),
  component: BlogPage,
})

function BlogPage() {
  const { tag } = Route.useSearch()
  // Always show the four core topics, plus any extra tags used in posts.
  const allTags = [...new Set<string>([...tags, ...getCategories(allPosts)])]
  const posts = newestPosts(
    tag ? allPosts.filter((post) => post.categories.includes(tag)) : allPosts,
  )
  const count = (t?: string) =>
    t
      ? allPosts.filter((p) => p.categories.includes(t)).length
      : allPosts.length

  const chip =
    'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition'
  const on = 'border-accent bg-accent-soft text-accent'
  const off = 'border-line text-muted hover:border-accent/60 hover:text-fg'

  return (
    <div className="mx-auto max-w-5xl px-5 pt-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
        Archive
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {tag ? (
          <>
            <span className="text-gradient"># {tag}</span>
          </>
        ) : (
          '全部文章'
        )}
      </h1>
      <p className="mt-3 text-muted">
        {tag
          ? `共 ${posts.length} 篇与「${tag}」相关的文章`
          : `共 ${posts.length} 篇文章，记录 AI 技术前沿的研究与思考`}
      </p>

      <nav
        aria-label="按标签筛选"
        className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        <Link
          to="/blog"
          search={{}}
          aria-current={!tag ? 'page' : undefined}
          className={`${chip} shrink-0 ${!tag ? on : off}`}
        >
          全部 <span className="font-mono text-xs opacity-70">{count()}</span>
        </Link>
        {allTags.map((t) => (
          <Link
            key={t}
            to="/blog"
            search={{ tag: t }}
            aria-current={tag === t ? 'page' : undefined}
            className={`${chip} shrink-0 ${tag === t ? on : off}`}
          >
            {t} <span className="font-mono text-xs opacity-70">{count(t)}</span>
          </Link>
        ))}
      </nav>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="text-muted">「{tag}」标签下暂时还没有文章。</p>
          <Link to="/blog" className="mt-4 inline-block text-sm text-accent">
            查看全部文章 →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
