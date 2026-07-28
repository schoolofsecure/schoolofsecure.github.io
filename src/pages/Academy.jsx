import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import AcademyCohortNote from '../components/AcademyCohortNote'
import { FOUNDER_LINKEDIN_URL } from '../data/brand'
import '../styles/site.css'

const steps = [
  {
    n: '1',
    title: 'Share your interest',
    text: "About five minutes. Tell us where you are now and what you'd like to feel more confident with online. No tech background needed. Filling in the form is free and creates no obligation.",
  },
  {
    n: '2',
    title: 'Book a short conversation',
    text: "If it seems useful to talk, you'll get a calendar link for a short call with our team.",
  },
  {
    n: '3',
    title: 'We explore together',
    text: "A two-way conversation about whether an early practice group could help you. If it feels useful on both sides, we'll share more about how the pilot works. You decide if you want to stay in touch. Nothing is sold on this page.",
  },
]

const faqs = [
  {
    q: 'How much time per week does it take?',
    a: 'People in the early group typically spend around 3 to 6 hours a week between live sessions and guided practice. Sessions stay focused so they can fit around a busy schedule.',
  },
  {
    q: "What if I'm still working a full-time job?",
    a: 'Yes, many people are. Live times are chosen with busy schedules in mind, and guided materials help if you miss a session.',
  },
  {
    q: 'How long does the early group run?',
    a: 'We are planning about 6 months of live sessions, guided practice and support. On the call we will walk you through the current calendar so you know what we have in mind.',
  },
  {
    q: "What happens if I can't make a live session?",
    a: 'Life happens. If you miss a live session, you can catch up with notes or recordings where available, and bring questions to the next check-in.',
  },
  {
    q: "I'm not sure where I struggle yet. Can I still share my interest?",
    a: 'Yes. The form and conversation help you clarify where you feel unsure. You do not need a clear problem statement first.',
  },
]

function AcademyMobileCta() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('.teams-page--academy .site-footer')
    if (!footer) return undefined
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.05, rootMargin: '0px 0px -8px 0px' },
    )
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  if (typeof document === 'undefined') return null
  return createPortal(
    <div
      className={`academy-mobile-cta${hidden ? ' is-hidden' : ''}`}
      role="region"
      aria-label="Share interest"
      aria-hidden={hidden}
    >
      <Link to="/academy/apply" className="academy-start-btn" tabIndex={hidden ? -1 : undefined}>
        Share your interest
      </Link>
    </div>,
    document.body,
  )
}

export default function Academy() {
  return (
    <div className="container teams-page teams-page--academy">
      <SiteNav />

      <section className="academy-layout" aria-label="Academy interest">
        <div className="academy-main">
          <p className="landing-path-label">Academy</p>
          <h1 className="academy-main-title">
            <span className="academy-main-title-line">Start with a conversation.</span>
            <span className="academy-main-title-line academy-main-title-line--emphasis">
              <span className="academy-main-title-strong">We'll explore </span>
              <span className="landing-hero-highlight">
                together.
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
          <p className="academy-main-lead">
            We are testing an early practice group for people who want calm, practical habits online. Right now there is no purchase and no enrolment on this site. There is only a free form and, if useful, a short conversation to see whether this could help you.
          </p>
          <AcademyCohortNote />

          <aside className="academy-trust" aria-label="What sharing interest means">
            <h2 className="academy-trust-title">What this is (and isn&apos;t)</h2>
            <ul className="academy-trust-list">
              <li>Free interest form</li>
              <li>Short conversation</li>
              <li>No payment on this site</li>
              <li>We usually reply within a day</li>
            </ul>
          </aside>

          <div className="academy-steps-cta academy-steps-cta--early">
            <Link to="/academy/apply" className="academy-start-btn">
              Share your interest
            </Link>
          </div>

          <h2 className="teams-section-title academy-steps-heading">How things progress</h2>
          <ol className="academy-steps-list">
            {steps.map((step) => (
              <li key={step.n} className="academy-step">
                <span className="academy-step-n" aria-hidden="true">{step.n}</span>
                <div className="academy-step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className="academy-founder academy-founder--compact" aria-label="Founder">
            <p className="academy-founder-compact">
              Led by Erika Papp-Kovacs ·{' '}
              <a href={FOUNDER_LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </p>
          </aside>
        </div>

        <aside className="academy-faq" aria-labelledby="academy-faq-title">
          <h2 id="academy-faq-title" className="academy-faq-title">Common Questions</h2>
          <p className="academy-faq-intro">
            Any questions? Don&apos;t see yours below?{' '}
            <Link to="/contact">Use the contact form</Link>
            . A real person from our team will reply, usually within a day.
          </p>
          <div className="academy-faq-list">
            {faqs.map((item) => (
              <details key={item.q} className="academy-faq-item">
                <summary>{item.q}</summary>
                <div className="academy-faq-answer">
                  {item.a.split('\n\n').map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <div className="academy-steps-cta academy-steps-cta--after-faq">
            <Link to="/academy/apply" className="academy-start-btn">
              Share your interest
            </Link>
          </div>
        </aside>
      </section>

      <AcademyMobileCta />

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
