import { Link } from '@tanstack/react-router'
import { type Post } from 'content-collections'

import { cdnImage } from '@/lib/site'
import { ArrowRight } from './icons'
import { PostMeta, TagPill } from './post-meta'

export function PostCard({
  post,
  featured = false,
}: {
  post: Post
  featured?: boolean
}) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-elev transition hover:-translate-y-0.5 hover:border-accent/50 ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      {post.image && (
        <div className={`overflow-hidden ${featured ? 'md:w-1/2' : ''}`}>
          <img
            src={cdnImage(post.image, featured ? 960 : 640)}
            alt=""
            loading="lazy"
            width={800}
            height={450}
            className="aspect-video h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div
        className={`flex flex-1 flex-col gap-3 p-5 sm:p-6 ${featured ? 'md:justify-center md:p-8' : ''}`}
      >
        <PostMeta
          date={post.date}
          wordCount={post.wordCount}
          readingMinutes={post.readingMinutes}
        />
        <h3
          className={`font-semibold leading-snug tracking-tight ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}
        >
          <Link
            to="/posts/$slug"
            params={{ slug: post.slug }}
            className="after:absolute after:inset-0 group-hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">
          {post.summary}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-2">
            {post.categories.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs text-accent opacity-0 transition group-hover:opacity-100">
            阅读 <ArrowRight />
          </span>
        </div>
      </div>
    </article>
  )
}
