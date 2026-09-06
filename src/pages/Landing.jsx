import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { getLatestBlogPosts } from '../data/blogPosts'

const popularPosts = getLatestBlogPosts(3)

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="container landing-page-body">
      <SiteNav />

      <section className="landing-hero landing-hero--centered" aria-label="Introduction">
        <div className="landing-hero-copy landing-hero-copy--centered">
          <h1 className="landing-hero-title">
            <span className="landing-hero-title-line landing-hero-title-line--primary">Spot what is off</span>
            <span className="landing-hero-title-line landing-hero-title-line--emphasis">
              before you{' '}
              <span className="landing-hero-highlight">
                say yes
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
            Iterali helps people pause before fast online decisions. Built around real emails, logins and rushed requests.
          </p>
          <p className="landing-hero-support" aria-label="How a round feels">
            <span>Short rounds</span>
            <span className="landing-hero-support-dot" aria-hidden="true">·</span>
            <span>Instant feedback</span>
            <span className="landing-hero-support-dot" aria-hidden="true">·</span>
            <span>Calmer decisions</span>
          </p>
          <div className="landing-hero-ctas landing-hero-ctas--centered">
            <Link to="/aurora" className="btn btn-primary landing-hero-btn">
              Play your first round
            </Link>
            <Link to="/blog" className="btn btn-secondary landing-hero-btn">
              Read the blog
            </Link>
          </div>
          <p className="landing-hero-note landing-hero-note--centered">
            Free to play · A few minutes · Account after your first round
          </p>
        </div>
      </section>

      <section className="landing-academy-about" aria-labelledby="play-aurora-title">
        <h2 id="play-aurora-title" className="landing-academy-about-title">
          How a round works
        </h2>
        <ol className="landing-round-steps" aria-label="How a round works, in three steps">
          <li>
            <span className="landing-round-step-num" aria-hidden="true">1</span>
            <h3>Spot the moment</h3>
            <p>Email, login or rushed request</p>
          </li>
          <li>
            <span className="landing-round-step-num" aria-hidden="true">2</span>
            <h3>Choose what to do</h3>
            <p>Make the call</p>
          </li>
          <li>
            <span className="landing-round-step-num" aria-hidden="true">3</span>
            <h3>See the cue</h3>
            <p>Learn what gave it away</p>
          </li>
        </ol>
        <div className="landing-academy-about-copy">
          <p>You land in a realistic situation, the kind that shows up at work and in everyday messages: an email, a login, or a request that feels slightly off. You choose what to do. Then you see what gave it away and practise pausing before an automatic yes.</p>
          <p>No lecture. Just a few minutes to practise pausing before a fast yes.</p>
        </div>
        <ul className="landing-academy-features" aria-label="What you get in a round">
          <li className="landing-academy-feature">
            <span className="landing-academy-feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 4h8v3L12 12l4 5v3H8v-3l4-5-4-5V4z" />
              </svg>
            </span>
            <div className="landing-academy-feature-body">
              <h3>Short rounds</h3>
              <p>A few minutes. In, decide, out.</p>
            </div>
          </li>
          <li className="landing-academy-feature">
            <span className="landing-academy-feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 5.5h11A1.5 1.5 0 0 1 19 7v7a1.5 1.5 0 0 1-1.5 1.5H10l-3.5 3v-3H6.5A1.5 1.5 0 0 1 5 14V7a1.5 1.5 0 0 1 1.5-1.5z" />
                <path d="M8.6 10.4l2 2 4.2-4.2" />
              </svg>
            </span>
            <div className="landing-academy-feature-body">
              <h3>Instant feedback</h3>
              <p>See the cue right after you choose.</p>
            </div>
          </li>
          <li className="landing-academy-feature">
            <span className="landing-academy-feature-icon landing-academy-feature-icon--pause" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="12" cy="12" r="8" />
                <path d="M10 9.2v5.6" />
                <path d="M14 9.2v5.6" />
              </svg>
            </span>
            <div className="landing-academy-feature-body">
              <h3>The pause</h3>
              <p>Notice sooner, pause more often.</p>
            </div>
          </li>
        </ul>
        <div className="landing-academy-cta">
          <Link to="/aurora" className="btn btn-primary landing-hero-btn">
            Play Aurora
          </Link>
        </div>
      </section>

      <section className="landing-popular" aria-labelledby="popular-content-title">
        <div className="landing-popular-head">
          <h2 id="popular-content-title" className="landing-popular-title">
            <span className="landing-popular-title-line landing-popular-title-line--emphasis">
              <span className="landing-hero-highlight">
                Start here
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
        </div>
        <div className="landing-popular-grid">
          {popularPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="landing-blog-card">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-boundaries" aria-labelledby="boundaries-teaser-title">
        <p className="landing-path-label">A rule of your own</p>
        <h2 id="boundaries-teaser-title" className="boundaries-teaser-title">
          After a round, keep one useful rule
        </h2>
        <p className="landing-newsletter-lead">
          Create a personal rule for the moments that feel urgent or hard to refuse.
        </p>
        <div className="landing-academy-cta">
          <Link to="/boundaries" className="btn-ghost">
            Create my boundary
          </Link>
        </div>
      </section>

      <SiteFooter />

      <CookieBanner />
      </div>
    </div>
  )
}

export default Landing
