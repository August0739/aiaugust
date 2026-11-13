import { formatDate } from '@/lib/blog'

export function PostMeta({
  date,
  wordCount,
  readingMinutes,
}: {
  date: string
  wordCount: number
  readingMinutes: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-faint">
      <time dateTime={date}>{formatDate(date)}</time>
      <span aria-hidden="true">·</span>
      <span>{wordCount.toLocaleString('zh-CN')} 字</span>
      <span aria-hidden="true">·</span>
      <span>约 {readingMinutes} 分钟阅读</span>
    </div>
  )
}

export function TagPill({ tag }: { tag: string }) {
  return (
    <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
      # {tag}
    </span>
  )
}
