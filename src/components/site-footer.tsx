import { author, siteName } from '@/lib/site'
import { GitHubIcon, XIcon } from './icons'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteName} · 记录 AI 前沿的思考与实践
        </p>
        <div className="flex items-center gap-4">
          <a
            href={author.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="transition hover:text-accent"
          >
            <GitHubIcon />
          </a>
          <a
            href={author.twitter}
            target="_blank"
            rel="noreferrer"
            aria-label="X / Twitter"
            className="transition hover:text-accent"
          >
            <XIcon />
          </a>
        </div>
      </div>
    </footer>
  )
}
