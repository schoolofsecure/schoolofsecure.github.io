import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { blogPosts, getReadingMinutes } from '../data/blogPosts'
import '../styles/site.css'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

export default function Blog() {
  const latest = blogPosts[0]

  return (
    <div className="container teams-page">
      <SiteNav />

      <header className="teams-hero">
        <div className="teams-hero-copy">
          <p className="landing-path-label">Blog</p>
          <h1>Short notes for busy people</h1>
          <p className="teams-hero-lead">
            Practical articles on deciding under pressure, reviewing without blame and taking one safer next step.
          </p>
          {latest && (
            <div className="teams-hero-ctas">
              <Link to={`/blog/${latest.slug}`} className="btn btn-primary teams-btn">
                Read latest
              </Link>
            </div>
          )}
        </div>
        {latest && (
          <aside className="teams-hero-aside" aria-label="Latest article">
            <div className="teams-aside-card">
              <p className="teams-aside-label">Latest</p>
              <p className="teams-aside-stat">{latest.title}</p>
              <p className="teams-aside-note teams-aside-note--flush">
                {formatDate(latest.date)} · {getReadingMinutes(latest)} min read
              </p>
            </div>
          </aside>
        )}
      </header>

      <section className="teams-section" aria-labelledby="blog-articles-title">
        <h2 id="blog-articles-title" className="teams-section-title">Articles</h2>
        <div className="blog-index-list">
          {blogPosts.map((post) => (
            <article key={post.slug} className="blog-index-item">
              <p className="blog-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true"> · </span>
                <span>{getReadingMinutes(post)} min read</span>
              </p>
              <h2>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="blog-read-link">Read article</Link>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
