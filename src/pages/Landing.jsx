import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { submitToFormSubmit } from '../utils/formSubmit'
import { getLatestBlogPosts } from '../data/blogPosts'

const popularPosts = getLatestBlogPosts(4)
const POPULAR_VISIBLE = 3

const Landing = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle')
  const [newsletterError, setNewsletterError] = useState('')
  const [newsletterHp, setNewsletterHp] = useState('')
  const [newsletterPrivacy, setNewsletterPrivacy] = useState(false)
  const [popularIndex, setPopularIndex] = useState(0)

  const maxPopularIndex = Math.max(0, popularPosts.length - POPULAR_VISIBLE)
  const visiblePopular = popularPosts.slice(popularIndex, popularIndex + POPULAR_VISIBLE)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    setNewsletterStatus('sending')
    setNewsletterError('')
    try {
      await submitToFormSubmit({
        email: newsletterEmail,
        request: 'Newsletter signup',
        _subject: 'Iterali newsletter signup',
        _replyto: newsletterEmail,
      }, { honeypot: newsletterHp })
      setNewsletterStatus('success')
      setNewsletterEmail('')
    } catch (_) {
      setNewsletterStatus('idle')
      setNewsletterError('Could not subscribe right now. Please try again.')
    }
  }

  return (
    <div className="landing-page">
      <div className="container landing-page-body">
      <SiteNav />

      <section className="landing-hero landing-hero--centered" aria-label="Introduction">
        <div className="landing-hero-copy landing-hero-copy--centered">
          <h1 className="landing-hero-title">
            <span className="landing-hero-title-line landing-hero-title-line--primary">Free reads and simple practice</span>
            <span className="landing-hero-title-line landing-hero-title-line--emphasis">
              for{' '}
              <span className="landing-hero-highlight">
                calmer online decisions
                <svg className="landing-hero-highlight-wave" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M4 11 C48 3, 72 14, 120 8 S160 4, 196 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>
          <p className="landing-hero-lead landing-hero-lead--centered">
            Useful articles when you arrive. Aurora when you want to try a real situation. The newsletter when you want to come back.
          </p>
          <p className="landing-hero-support">
            <span>Blog</span>
            <span className="landing-hero-support-dot" aria-hidden="true">·</span>
            <span>Play</span>
            <span className="landing-hero-support-dot" aria-hidden="true">·</span>
            <span>Newsletter</span>
          </p>
          <div className="landing-hero-ctas landing-hero-ctas--centered">
            <Link to="/blog" className="btn btn-primary landing-hero-btn">
              Read the blog
            </Link>
            <Link to="/aurora" className="btn btn-secondary landing-hero-btn">
              Play
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-academy-about" aria-labelledby="play-aurora-title">
        <h2 id="play-aurora-title" className="landing-academy-about-title">
          Play Aurora
        </h2>
        <div className="landing-academy-about-copy">
          <p>Practise one small online decision.</p>
          <p>
            Aurora puts you in a realistic situation: an urgent email, a login prompt or a request that feels slightly off.
          </p>
          <p>Choose your next step, then see what to check.</p>
          <p>You sign in to play. The blog does not need an account.</p>
        </div>
        <div className="landing-academy-cta">
          <Link to="/aurora" className="btn btn-primary landing-hero-btn">
            Play Aurora
          </Link>
        </div>
      </section>

      <section className="landing-popular" aria-labelledby="popular-content-title">
        <div className="landing-popular-head">
          <h2 id="popular-content-title" className="landing-popular-title">
            <span className="landing-popular-title-line">Check Out Our Most</span>
            <span className="landing-popular-title-line landing-popular-title-line--emphasis">
              <span className="landing-popular-title-strong">Popular </span>
              <span className="landing-hero-highlight">
                Content
                <svg className="landing-hero-highlight-wave" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M4 11 C48 3, 72 14, 120 8 S160 4, 196 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h2>
          <div className="landing-popular-arrows">
            <button
              type="button"
              className="landing-popular-arrow"
              aria-label="Previous articles"
              disabled={popularIndex <= 0}
              onClick={() => setPopularIndex((i) => Math.max(0, i - 1))}
            >
              ←
            </button>
            <button
              type="button"
              className="landing-popular-arrow"
              aria-label="Next articles"
              disabled={popularIndex >= maxPopularIndex}
              onClick={() => setPopularIndex((i) => Math.min(maxPopularIndex, i + 1))}
            >
              →
            </button>
          </div>
        </div>
        <div className="landing-popular-grid">
          {visiblePopular.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="landing-blog-card">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="newsletter" className="landing-newsletter" aria-labelledby="newsletter-title">
        <h2 id="newsletter-title" className="landing-newsletter-title">Join the Newsletter</h2>
        <p className="landing-newsletter-lead">
          A note when there is a new article or a new game.
        </p>
        {newsletterStatus === 'success' ? (
          <p className="landing-newsletter-success">Thanks. You are on the list.</p>
        ) : (
          <form className="landing-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input type="text" name="_honey" value={newsletterHp} onChange={(e) => setNewsletterHp(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <input
              className="input landing-newsletter-input"
              type="email"
              name="email"
              placeholder="Email address"
              maxLength={254}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              disabled={newsletterStatus === 'sending'}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-primary landing-newsletter-btn" disabled={newsletterStatus === 'sending' || !newsletterPrivacy}>
              {newsletterStatus === 'sending' ? 'Joining…' : 'Subscribe'}
            </button>
            <label className="form-privacy-check" style={{ width: '100%' }}>
              <input type="checkbox" checked={newsletterPrivacy} onChange={(e) => setNewsletterPrivacy(e.target.checked)} />
              <span>I accept the <Link to="/privacy">Privacy Policy</Link>.</span>
            </label>
          </form>
        )}
        {newsletterError && <p className="landing-newsletter-error">{newsletterError}</p>}
      </section>

      <SiteFooter />

      <CookieBanner />
      </div>
    </div>
  )
}

export default Landing
