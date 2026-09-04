import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../styles/site.css'

const steps = [
  {
    n: '1',
    title: 'Read, if you want',
    text: 'A short blog piece first. Or skip it and go straight in.',
  },
  {
    n: '2',
    title: 'Decide one situation',
    text: 'A rushed email. An odd login. A yes that cannot wait.',
  },
  {
    n: '3',
    title: 'Come back',
    text: 'New pieces and new practice over time. The newsletter can ping you.',
  },
]

const faqs = [
  {
    q: 'How much time does it take?',
    a: 'A few minutes per situation. Stop whenever you like. There is no weekly timetable.',
  },
  {
    q: 'Do I need an account?',
    a: 'To practise, you sign in so progress can be saved. It is free. Reading the blog does not need an account.',
  },
  {
    q: "I'm not sure where I struggle. Can I still start?",
    a: 'Yes. Pick one situation and try it. You do not need a plan first.',
  },
  {
    q: 'Is this a live course?',
    a: 'No. It is free practice you do in your own time. No cohort, no call to book.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. The Academy practice on this site is free.',
  },
]

function AcademyMobileCta() {
  const [hidden, setHidden] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    let io
    const startId = window.requestAnimationFrame(() => {
      setReady(true)
      const footer = document.querySelector('.teams-page--academy .site-footer')
      if (!footer) return
      io = new IntersectionObserver(
        ([entry]) => setHidden(entry.isIntersecting),
        { threshold: 0.15, rootMargin: '0px 0px -24px 0px' },
      )
      io.observe(footer)
    })

    return () => {
      window.cancelAnimationFrame(startId)
      io?.disconnect()
    }
  }, [])

  if (typeof document === 'undefined') return null
  return createPortal(
    <div
      className={`academy-mobile-cta${ready ? ' is-ready' : ''}${hidden ? ' is-hidden' : ''}`}
      role="region"
      aria-label="Try one now"
      aria-hidden={hidden}
    >
      <Link to="/aurora" className="academy-start-btn" tabIndex={hidden ? -1 : undefined}>
        Try one now
      </Link>
    </div>,
    document.body,
  )
}

export default function Academy() {
  return (
    <div className="container teams-page teams-page--academy">
      <SiteNav />

      <section className="academy-layout" aria-label="Free Academy">
        <div className="academy-main">
          <p className="landing-path-label">Free Academy</p>
          <h1 className="academy-main-title">
            <span className="academy-main-title-line">Practise the moment that</span>
            <span className="academy-main-title-line academy-main-title-line--emphasis">
              <span className="landing-hero-highlight">
                rushes you.
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
            Open a rushed email. Decide. See the next step. A few minutes.
          </p>

          <div className="academy-steps-cta academy-steps-cta--early">
            <Link to="/aurora" className="academy-start-btn">
              Try one now
            </Link>
          </div>

          <h2 className="teams-section-title academy-steps-heading">How it works</h2>
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
            <Link to="/aurora" className="academy-start-btn">
              Try one now
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
