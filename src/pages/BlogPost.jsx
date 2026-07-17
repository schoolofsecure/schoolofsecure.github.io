import React from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { getBlogPost } from '../data/blogPosts'
import NotFound from './NotFound'
import '../styles/site.css'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogPost(slug)

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
          <time className="blog-post-date" dateTime={post.date}>{formatDate(post.date)}</time>
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
