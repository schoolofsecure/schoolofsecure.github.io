import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { blogPosts } from '../data/blogPosts'
import '../styles/site.css'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

export default function Blog() {
  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <header style={{ padding: '24px 0' }}>
          <p className="landing-path-label" style={{ marginBottom: 8 }}>Blog</p>
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 8px' }}>Short notes for busy people</h1>
          <p className="section-lead" style={{ margin: 0, maxWidth: 640 }}>
            Practical articles on deciding under pressure, reviewing without blame and taking one safer next step. Written for learners and teams.
          </p>
        </header>

        <div className="blog-index-list">
          {blogPosts.map((post) => (
            <article key={post.slug} className="blog-index-item">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <h2>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="blog-read-link">Read article</Link>
            </article>
          ))}
        </div>

        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
