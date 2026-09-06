import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMagazineIssue } from '../data/magazineIssues'
import '../styles/magazine.css'

export default function Magazine() {
  const issue = getMagazineIssue('issue-01-the-pause')
  const scrollerRef = useRef(null)
  const [active, setActive] = useState(0)
  const total = issue?.pages?.length || 0

  const goTo = useCallback(
    (index) => {
      const next = Math.max(0, Math.min(total - 1, index))
      const scroller = scrollerRef.current
      if (!scroller) return
      const page = scroller.children[next]
      if (page) page.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(next)
    },
    [total],
  )

  useEffect(() => {
    document.title = 'Iterali Magazine · Demo'
    return () => {
      document.title = 'Iterali – Pause before fast online decisions'
    }
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    const onScroll = () => {
      const top = scroller.scrollTop
      const height = scroller.clientHeight || 1
      const index = Math.round(top / height)
      setActive(Math.max(0, Math.min(total - 1, index)))
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [total])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        goTo(active + 1)
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goTo(active - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, goTo])

  if (!issue) return null

  return (
    <div className="magazine">
      <header className="magazine-chrome">
        <Link to="/" className="magazine-chrome-brand">
          Iterali
        </Link>
        <p className="magazine-chrome-meta">
          Magazine · Issue {issue.number} · Demo
        </p>
        <Link to="/" className="magazine-chrome-exit">
          Exit
        </Link>
      </header>

      <div
        ref={scrollerRef}
        className="magazine-scroller"
        aria-label={`${issue.title} magazine pages`}
      >
        {issue.pages.map((page, index) => (
          <section
            key={page.id}
            className={`magazine-page magazine-page--${page.kind} magazine-page--${page.tone}`}
            aria-label={`Page ${index + 1} of ${total}`}
          >
            <div className="magazine-page-inner">
              {page.eyebrow && <p className="magazine-eyebrow">{page.eyebrow}</p>}
              <h1 className="magazine-title">{page.title}</h1>
              {page.lead && <p className="magazine-lead">{page.lead}</p>}
              {page.body && <p className="magazine-body">{page.body}</p>}
              {page.ctaTo && (
                <Link to={page.ctaTo} className="magazine-cta">
                  {page.ctaLabel || 'Continue'}
                </Link>
              )}
              {page.kind === 'cover' && (
                <button type="button" className="magazine-scroll-hint" onClick={() => goTo(1)}>
                  Scroll to open
                </button>
              )}
            </div>
          </section>
        ))}
      </div>

      <nav className="magazine-dots" aria-label="Pages">
        {issue.pages.map((page, index) => (
          <button
            key={page.id}
            type="button"
            className={`magazine-dot${active === index ? ' is-active' : ''}`}
            aria-label={`Go to page ${index + 1}`}
            aria-current={active === index ? 'true' : undefined}
            onClick={() => goTo(index)}
          />
        ))}
      </nav>

      <div className="magazine-arrows">
        <button
          type="button"
          className="magazine-arrow"
          aria-label="Previous page"
          disabled={active <= 0}
          onClick={() => goTo(active - 1)}
        >
          ↑
        </button>
        <button
          type="button"
          className="magazine-arrow"
          aria-label="Next page"
          disabled={active >= total - 1}
          onClick={() => goTo(active + 1)}
        >
          ↓
        </button>
      </div>
    </div>
  )
}
