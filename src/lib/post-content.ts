import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'

const slugSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/,
    'Use a URL segment containing letters, numbers, hyphens, or underscores',
  )

export const postSchema = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  categories: z.array(z.string().trim().min(1)).default([]),
  slug: slugSchema.optional(),
  image: z
    .string()
    .trim()
    .min(1)
    .refine(
      (value) =>
        /^https:\/\//.test(value) ||
        (!value.includes(':') && !value.startsWith('//')),
      'Use a public image path or HTTPS URL',
    )
    .optional(),
  imageAlt: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
    .refine((value) => {
      const date = new Date(`${value}T00:00:00Z`)
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      )
    }, 'Use a valid calendar date'),
  content: z.string(),
})

export function resolvePostSlug(slug: string | undefined, path: string) {
  if (slug !== undefined) return slugSchema.parse(slug)
  return slugSchema.parse(
    path
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  )
}

export function assertUniqueSlugs(
  posts: { slug: string; _meta: { filePath: string } }[],
) {
  const paths = new Map<string, string>()
  for (const post of posts) {
    const previous = paths.get(post.slug)
    if (previous)
      throw new Error(
        `Duplicate post slug "${post.slug}" in ${previous} and ${post._meta.filePath}. Set a unique frontmatter slug.`,
      )
    paths.set(post.slug, post._meta.filePath)
  }
}

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

/** Counts CJK characters individually and Latin words/numbers as one each. */
export function countWords(content: string) {
  const text = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|-]/g, ' ')
  const cjk = text.match(/[\u3400-\u9fff\uf900-\ufaff]/g)?.length ?? 0
  const latin =
    text
      .replace(/[\u3400-\u9fff\uf900-\ufaff]/g, ' ')
      .match(/[A-Za-z0-9][A-Za-z0-9.'+-]*/g)?.length ?? 0
  return cjk + latin
}

/** Reading time in minutes, assuming ~350 Chinese characters per minute. */
export function readingMinutes(wordCount: number) {
  return Math.max(1, Math.round(wordCount / 350))
}

export function renderMarkdown(content: string) {
  return sanitizeHtml(marked.parse(content, { async: false }) as string, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height'],
      code: ['class'],
      span: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
  })
}
