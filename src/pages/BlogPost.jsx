import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { getBlogPost, getReadingMinutes } from '../data/blogPosts'
import NotFound from './NotFound'
import '../styles/site.css'

const DEFAULT_TITLE = 'Iterali – Calm, confident habits online'
const DEFAULT_DESCRIPTION =
  'The Iterali Academy helps you build calm, confident habits online through guided practice and realistic scenarios. No tech background needed.'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
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

export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogPost(slug)

  useEffect(() => {
    if (!post) return undefined

    const title = post.seoTitle || `${post.title} | Iterali`
    const description = post.seoDescription || post.excerpt
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
  }, [post])

  if (!post) {
    return <NotFound />
  }

  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <article className="blog-post">
          <p className="landing-path-label" style={{ marginBottom: 8 }}>
            <Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
          </p>
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 12px' }}>{post.title}</h1>
          <p className="blog-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            <span>{getReadingMinutes(post)} min read</span>
          </p>
          <div className="blog-post-body">
            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <Link to="/blog" className="btn-ghost" style={{ display: 'inline-block', marginTop: 8 }}>
            ← All articles
          </Link>
        </article>
        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
