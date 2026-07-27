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
      })
      setNewsletterStatus('success')
      setNewsletterEmail('')
    } catch (_) {
      setNewsletterStatus('idle')
      setNewsletterError('Could not subscribe right now. Please try again.')
    }
  }

  return (
    <div className="container landing-page">
      <SiteNav />

      <section className="landing-hero landing-hero--centered" aria-label="Introduction">
        <div className="landing-hero-copy landing-hero-copy--centered">
          <h1 className="landing-hero-title">
            <span className="landing-hero-title-line landing-hero-title-line--primary">Live online with calm confidence</span>
            <span className="landing-hero-title-line landing-hero-title-line--emphasis">
              when every decision{' '}
              <span className="landing-hero-highlight">
                feels right
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
            The Iterali Academy is a guided, practical programme that helps you build calm, confident habits online.
          </p>
          <p className="landing-hero-support">
            <span>No lectures</span>
            <span className="landing-hero-support-dot" aria-hidden="true">·</span>
            <span>Real scenarios</span>
            <span className="landing-hero-support-dot" aria-hidden="true">·</span>
            <span>A clear next step</span>
          </p>
          <div className="landing-hero-ctas landing-hero-ctas--centered">
            <Link to="/academy" className="btn btn-primary landing-hero-btn">
              Apply to the Academy
            </Link>
            <a href="#newsletter" className="btn btn-secondary landing-hero-btn">
              Join the Newsletter
            </a>
          </div>
          <p className="landing-hero-note landing-hero-note--centered">
            Also available for <Link to="/teams">teams</Link>.
          </p>
        </div>
      </section>

      <section className="landing-academy-about" aria-labelledby="academy-about-title">
        <h2 id="academy-about-title" className="landing-academy-about-title">
          What is the Iterali Academy?
        </h2>
        <div className="landing-academy-about-copy">
          <p>
            Life online should support your real life, not stress you out. Rather than fear-based training or endless warnings, it prioritises calm, clarity and confident everyday decisions. It is about building habits that fit how you actually live and work.
          </p>
          <p>
            The Iterali Academy helps you practise the decisions that matter most, in realistic scenarios you recognise from email, chat and everyday shortcuts. Through guided practice, clear feedback and one next step at a time, you build calm habits you can use straight away, without lectures, guilt or complex dashboards.
          </p>
          <p>
            This is not training you buy and never use. It is a guided journey that helps you take action and make real progress.
          </p>
        </div>
        <ul className="landing-academy-features">
          {[
            {
              title: 'Skills you can use anywhere',
              text: 'What you learn carries into work, home and everyday apps, not just one training screen.',
            },
            {
              title: 'Calm confidence, not fear',
              text: 'You build steady habits instead of panic and second-guessing every click.',
            },
            {
              title: 'A clear path, step by step',
              text: 'You always know what to practise next, so you never feel lost.',
            },
            {
              title: 'Personal guidance when you are stuck',
              text: 'One-to-one and small-group help for the moments that feel hard alone.',
            },
            {
              title: 'Live practice that sticks',
              text: 'Interactive sessions focused on real decisions and action, not long lectures.',
            },
            {
              title: 'Private member community',
              text: 'A members-only space to share progress, get feedback and learn alongside others.',
            },
          ].map(({ title, text }) => (
            <li key={title} className="landing-academy-feature">
              <h3>{title}</h3>
              {text && <p>{text}</p>}
            </li>
          ))}
        </ul>
        <div className="landing-academy-cta">
          <Link to="/academy" className="btn btn-primary landing-hero-btn">
            Apply to the Academy
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
          Short notes on calm decisions, clear habits and confident choices online.
        </p>
        {newsletterStatus === 'success' ? (
          <p className="landing-newsletter-success">Thanks. You are on the list.</p>
        ) : (
          <form className="landing-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              className="input landing-newsletter-input"
              type="email"
              name="email"
              placeholder="Email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              disabled={newsletterStatus === 'sending'}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-primary landing-newsletter-btn" disabled={newsletterStatus === 'sending'}>
              {newsletterStatus === 'sending' ? 'Joining…' : 'Subscribe'}
            </button>
          </form>
        )}
        {newsletterError && <p className="landing-newsletter-error">{newsletterError}</p>}
      </section>

      <SiteFooter />

      <CookieBanner />
    </div>
  )
}

export default Landing
