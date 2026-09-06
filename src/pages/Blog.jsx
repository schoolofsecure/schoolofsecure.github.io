import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { blogSections, getReadingMinutes, getFeaturedBlogPost, getPostLocale, getPublishedBlogPosts } from '../data/blogPosts'
import '../styles/site.css'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

export default function Blog() {
  const [section, setSection] = useState('All')
  const published = useMemo(() => getPublishedBlogPosts(), [])

  const filtered = useMemo(() => {
    if (section === 'All') return published
    return published.filter((p) => p.section === section)
  }, [section, published])

  const featured =
    section === 'All'
      ? getFeaturedBlogPost()
      : filtered.find((p) => p.featured) || filtered[0] || null

  const rest = filtered.filter((p) => p.slug !== featured?.slug)
  const featuredLoc = featured ? getPostLocale(featured, 'en') : null

  return (
    <div className="container teams-page">
      <SiteNav />

      <header className="teams-hero">
        <div className="teams-hero-copy">
          <p className="landing-path-label">Blog</p>
          <h1>Short reads for busy minds</h1>
          <p className="teams-hero-lead">
            Iterali helps people pause before fast online decisions. Short reads on the moments that ask for a fast yes.
          </p>
        </div>
        {featured && section === 'All' && (
          <aside className="teams-hero-aside" aria-label="Featured article">
            <div className="teams-aside-card">
              <p className="teams-aside-label">{featured.section || 'Featured'}</p>
              <p className="teams-aside-stat">{featured.title}</p>
              <p className="teams-aside-note teams-aside-note--flush">
                {formatDate(featured.date)} · {getReadingMinutes(featured)} min read
              </p>
            </div>
          </aside>
        )}
      </header>

      <div className="blog-mag-filters" role="toolbar" aria-label="Filter by topic">
        <button
          type="button"
          className={`blog-mag-filter${section === 'All' ? ' is-active' : ''}`}
          aria-pressed={section === 'All'}
          onClick={() => setSection('All')}
        >
          All
        </button>
        {blogSections.map((name) => (
          <button
            key={name}
            type="button"
            className={`blog-mag-filter${section === name ? ' is-active' : ''}`}
            aria-pressed={section === name}
            onClick={() => setSection(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {featured && (
        <section className="blog-mag-featured" aria-labelledby="blog-featured-title">
          <Link to={`/blog/${featured.slug}`} className="blog-mag-featured-link">
            <div className={`blog-mag-featured-copy${featured.image ? ' blog-mag-featured-copy--with-image' : ''}`}>
              <div>
                <p className="blog-mag-section">{featured.section || 'Notes'}</p>
                <p className="blog-mag-kicker">{section === 'All' ? 'Featured' : featured.section}</p>
                <h2 id="blog-featured-title">{featured.title}</h2>
                {featured.subtitle && <p className="blog-mag-subtitle">{featured.subtitle}</p>}
                <p className="blog-mag-excerpt">{featured.excerpt}</p>
                <p className="blog-meta">
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                  <span aria-hidden="true"> · </span>
                  <span>{getReadingMinutes(featured)} min read</span>
                  {featured.hu ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span>EN / HU</span>
                    </>
                  ) : null}
                </p>
                <span className="blog-read-link">Read article</span>
              </div>
              {featuredLoc?.image ? (
                <img
                  className="blog-mag-featured-image"
                  src={featuredLoc.image}
                  alt={featuredLoc.imageAlt || featuredLoc.title}
                />
              ) : null}
            </div>
          </Link>
        </section>
      )}

      <section className="blog-mag-grid-section" aria-labelledby="blog-more-title">
        <h2 id="blog-more-title" className="teams-section-title">
          {section === 'All' ? 'More articles' : section}
        </h2>
        {rest.length === 0 && !featured ? (
          <p className="blog-mag-empty">No articles in this topic yet.</p>
        ) : null}
        <div className="blog-mag-grid">
          {rest.map((post) => (
            <article key={post.slug} className="blog-mag-card">
              <Link to={`/blog/${post.slug}`} className="blog-mag-card-link">
                <p className="blog-mag-section">{post.section || 'Notes'}</p>
                <h3>{post.title}</h3>
                <p className="blog-mag-card-excerpt">{post.excerpt}</p>
                <p className="blog-meta">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true"> · </span>
                  <span>{getReadingMinutes(post)} min read</span>
                  {post.hu ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span>EN / HU</span>
                    </>
                  ) : null}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
