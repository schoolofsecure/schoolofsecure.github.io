import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { getBlogPost, getPostLocale, getReadingMinutes } from '../data/blogPosts'
import NotFound from './NotFound'
import '../styles/site.css'

const DEFAULT_TITLE = 'Iterali – Calm, confident habits online'
const DEFAULT_DESCRIPTION =
  'The Iterali Academy helps you build calm, confident habits online through guided practice and realistic scenarios. No tech background needed.'

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
  const post = getBlogPost(slug)
  const [lang, setLang] = useState(post?.defaultLang || 'en')

  useEffect(() => {
    setLang(post?.defaultLang || 'en')
  }, [slug, post?.defaultLang])

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

    return () => {
      document.title = DEFAULT_TITLE
      setMetaTag('name', 'description', DEFAULT_DESCRIPTION)
      setMetaTag('property', 'og:type', 'website')
      setMetaTag('property', 'og:url', 'https://iterali.com/')
      setMetaTag('property', 'og:title', DEFAULT_TITLE)
      setMetaTag('property', 'og:description', DEFAULT_DESCRIPTION)
      setMetaTag('name', 'twitter:title', DEFAULT_TITLE)
      setMetaTag('name', 'twitter:description', 'Guided practice for calm, confident everyday decisions online.')
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) canonical.remove()
    }
  }, [post, lang])

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
          <Link to="/blog" className="btn-ghost" style={{ display: 'inline-block', marginTop: 8 }}>
            {lang === 'hu' ? '← Összes cikk' : '← All articles'}
          </Link>
        </article>
        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
