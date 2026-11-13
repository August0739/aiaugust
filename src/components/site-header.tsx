import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { navItems, siteName } from '@/lib/site'
import { ThemeToggle } from './theme-toggle'

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="relative grid size-7 place-items-center rounded-md border border-accent/40 bg-accent-soft font-mono text-[11px] text-accent">
        AI
        <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-accent-2" />
      </span>
      <span>{siteName}</span>
    </span>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const linkClass =
    'rounded-md px-3 py-1.5 text-sm text-muted transition hover:text-fg data-[status=active]:text-fg data-[status=active]:bg-accent-soft'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link
          to="/"
          aria-label={`${siteName} 首页`}
          onClick={() => setOpen(false)}
        >
          <Logo />
        </Link>
        <nav aria-label="主导航" className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/', includeSearch: false }}
              className={linkClass}
            >
              {item.label}
            </Link>
          ))}
          <span className="mx-2 h-5 w-px bg-line" />
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? '关闭菜单' : '打开菜单'}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-lg border border-line text-muted"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="移动端导航"
          className="border-t border-line px-5 py-3 sm:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === '/', includeSearch: false }}
                onClick={() => setOpen(false)}
                className={`${linkClass} py-2.5 text-base`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
