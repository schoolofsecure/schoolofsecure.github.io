import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import {
  findBlogPostBySlug,
  getBlogPost,
  getPostLocale,
  getReadingMinutes,
  isBlogPostPublicByDate,
  isValidBlogPreviewKey,
} from '../data/blogPosts'
import NotFound from './NotFound'
import '../styles/site.css'

const DEFAULT_TITLE = 'Iterali – Pause before fast online decisions'
const DEFAULT_DESCRIPTION =
  'Iterali helps people pause before fast online decisions. Spot what is off before you say yes.'

function previewStorageKey(slug) {
  return `iterali-blog-preview:${slug}`
}

function formatDate(iso, lang) {
  try {
    return new Date(iso).toLocaleDateString(lang === 'hu' ? 'hu-HU' : 'en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function setMetaTag(attr, key, value) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function renderBodyBlock(block, i, lang) {
  if (typeof block === 'string') {
    return <p key={`${lang}-${i}`}>{block}</p>
  }
  if (block?.type === 'q') {
    return (
      <p key={`${lang}-${i}`} className="blog-post-q">
        {block.text}
      </p>
    )
  }
  if (block?.type === 'h') {
    return (
      <h2 key={`${lang}-${i}`} className="blog-post-subhead">
        {block.text}
      </h2>
    )
  }
  return <p key={`${lang}-${i}`}>{block?.text}</p>
}

export default function BlogPost() {
  const { slug } = useParams()
  const draft = findBlogPostBySlug(slug)
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(previewStorageKey(slug)) === '1'
    } catch {
      return false
    }
  })
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const post = getBlogPost(slug, { unlocked })
  const [lang, setLang] = useState(draft?.defaultLang || 'en')
  const needsPassword = Boolean(draft && !isBlogPostPublicByDate(draft) && !unlocked)
  const scheduledOnly = Boolean(post && !isBlogPostPublicByDate(post))

  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem(previewStorageKey(slug)) === '1')
    } catch {
      setUnlocked(false)
    }
    setPassword('')
    setPasswordError('')
  }, [slug])

  useEffect(() => {
    setLang(draft?.defaultLang || 'en')
  }, [slug, draft?.defaultLang])

  useEffect(() => {
    if (!post) return undefined

    const loc = getPostLocale(post, lang)
    const title = lang === 'hu' && post.hu ? `${loc.title} | Iterali` : post.seoTitle || `${post.title} | Iterali`
    const description = lang === 'hu' && post.hu ? loc.excerpt : post.seoDescription || post.excerpt
    const url = `https://iterali.com/blog/${post.slug}`

    document.title = title
    setMetaTag('name', 'description', description)
    setMetaTag('property', 'og:type', 'article')
    setMetaTag('property', 'og:url', url)
    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    setCanonical(url)
    if (scheduledOnly) {
      setMetaTag('name', 'robots', 'noindex, nofollow')
    }

    return () => {
      document.title = DEFAULT_TITLE
      setMetaTag('name', 'description', DEFAULT_DESCRIPTION)
      setMetaTag('property', 'og:type', 'website')
      setMetaTag('property', 'og:url', 'https://iterali.com/')
      setMetaTag('property', 'og:title', DEFAULT_TITLE)
      setMetaTag('property', 'og:description', DEFAULT_DESCRIPTION)
      setMetaTag('name', 'twitter:title', DEFAULT_TITLE)
      setMetaTag('name', 'twitter:description', 'Guided practice for calm, confident everyday decisions online.')
      if (scheduledOnly) {
        const robots = document.querySelector('meta[name="robots"]')
        if (robots) robots.remove()
      }
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) canonical.remove()
    }
  }, [post, lang, scheduledOnly])

  const handleUnlock = (e) => {
    e.preventDefault()
    if (!isValidBlogPreviewKey(password)) {
      setPasswordError(lang === 'hu' ? 'Hibás jelszó.' : 'Wrong password.')
      return
    }
    try {
      sessionStorage.setItem(previewStorageKey(slug), '1')
    } catch {
      /* ignore */
    }
    setUnlocked(true)
    setPasswordError('')
  }

  if (!draft) {
    return <NotFound />
  }

  if (needsPassword) {
    return (
      <div className="site-page">
        <div className="container">
          <SiteNav />
          <section className="blog-post blog-preview-gate" aria-labelledby="blog-preview-title">
            <p className="landing-path-label">
              <Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>
                Blog
              </Link>
            </p>
            <h1 id="blog-preview-title">
              {lang === 'hu' ? 'Előnézet — jelszó kell' : 'Preview — password required'}
            </h1>
            <p className="blog-post-subtitle">
              {lang === 'hu'
                ? 'Ez a cikk még nem nyilvános. Írd be a jelszót a megtekintéshez.'
                : 'This article is not public yet. Enter the password to view it.'}
            </p>
            <form className="blog-preview-form" onSubmit={handleUnlock}>
              <label className="blog-preview-label" htmlFor="blog-preview-password">
                {lang === 'hu' ? 'Jelszó' : 'Password'}
              </label>
              <input
                id="blog-preview-password"
                className="input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError('')
                }}
                required
              />
              {passwordError ? <p className="blog-preview-error">{passwordError}</p> : null}
              <button type="submit" className="btn btn-primary">
                {lang === 'hu' ? 'Megnyitás' : 'Open'}
              </button>
            </form>
          </section>
          <SiteFooter />
        </div>
        <CookieBanner />
      </div>
    )
  }

  if (!post) {
    return <NotFound />
  }

  const loc = getPostLocale(post, lang)
  const bilingual = Boolean(post.hu)

  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <article className="blog-post">
          {scheduledOnly && (
            <p className="blog-preview-banner" role="status">
              {lang === 'hu'
                ? 'Előnézet — ez a cikk még nem nyilvános a bloglistán.'
                : 'Preview — this article is not public on the blog list yet.'}
            </p>
          )}

          <p className="landing-path-label" style={{ marginBottom: 8 }}>
            <Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>
              Blog
            </Link>
          </p>

          {bilingual && (
            <div className="blog-lang-switch" role="group" aria-label={lang === 'hu' ? 'Nyelv' : 'Language'}>
              <button
                type="button"
                className={`blog-lang-btn${lang === 'hu' ? ' is-active' : ''}`}
                aria-pressed={lang === 'hu'}
                aria-label="Magyar"
                onClick={() => setLang('hu')}
              >
                <span className="blog-lang-flag" aria-hidden="true">
                  🇭🇺
                </span>
                <span>HU</span>
              </button>
              <button
                type="button"
                className={`blog-lang-btn${lang === 'en' ? ' is-active' : ''}`}
                aria-pressed={lang === 'en'}
                aria-label="English"
                onClick={() => setLang('en')}
              >
                <span className="blog-lang-flag" aria-hidden="true">
                  🇬🇧
                </span>
                <span>EN</span>
              </button>
            </div>
          )}

          {post.section && <p className="blog-mag-section">{post.section}</p>}
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 12px' }}>{loc.title}</h1>
          {loc.subtitle && <p className="blog-post-subtitle">{loc.subtitle}</p>}
          <p className="blog-meta">
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
            <span aria-hidden="true"> · </span>
            <span>
              {getReadingMinutes(post, 200, lang)} {lang === 'hu' ? 'perc' : 'min read'}
            </span>
          </p>

          {loc.image && (
            <figure className="blog-post-figure">
              <img src={loc.image} alt={loc.imageAlt || loc.title} />
            </figure>
          )}

          <div className="blog-post-body">
            {(loc.body || []).map((block, i) => renderBodyBlock(block, i, lang))}
          </div>
          <aside className="blog-aurora-cta" aria-labelledby="blog-aurora-cta-title">
            <h2 id="blog-aurora-cta-title">Try a real situation</h2>
            <p>
              Aurora gives you a short scenario where you decide what to do before you see the cues.
            </p>
            <Link to="/aurora" className="btn btn-primary">
              Play Aurora free
            </Link>
          </aside>
        </article>
        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
