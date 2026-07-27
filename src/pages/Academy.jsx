import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import AcademyCohortNote from '../components/AcademyCohortNote'
import '../styles/site.css'

const steps = [
  {
    n: '1',
    title: 'Submit your application',
    text: "About five minutes. Tell us where you are now and what you'd like to feel more confident with online. No tech background needed. We just want to understand you.",
  },
  {
    n: '2',
    title: 'Book your interview call',
    text: "If it looks like a good fit, you'll get a calendar link to book a short call with our team.",
  },
  {
    n: '3',
    title: 'We decide together',
    text: "A two-way conversation to check the Academy is right for you and you're right for us. If it's a yes on both sides, you're in. We'll match you with a coach and a group, and welcome you to the next cohort.",
  },
]

const faqs = [
  {
    q: 'How much time per week does it take?',
    a: 'Most people spend around 3–6 hours a week practising alongside the programme. That includes live sessions, short materials, and — most importantly — applying what you learn in real everyday decisions.\n\nSome weeks will be lighter, some fuller, depending on where you are. The programme is designed to flex around your life, not the other way around.',
  },
  {
    q: "What if I'm still working a full-time job?",
    a: 'That is common. The Academy is built for busy people. Sessions are live but catch-up options exist, and the practice fits around a normal week rather than asking you to quit everything else.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'We talk through fit on the call before you join, so there are fewer surprises. If something still does not feel right after you start, reach out through the contact form and we will look at your situation fairly.',
  },
  {
    q: 'How long is the programme?',
    a: 'Each cohort runs for a set number of weeks with live sessions, guided practice and support. On the call we will walk you through the current cohort length and calendar so you know exactly what you are joining.',
  },
  {
    q: "What happens if I can't make a cohort event?",
    a: "Life happens. If you miss a live session, you can catch up with recordings or notes where available, and bring questions to the next live coaching session or group check-in so you stay on track.",
  },
  {
    q: "I'm not sure where I struggle yet. Can I still apply?",
    a: 'Yes. You do not need a clear “problem statement” or tech background. The application and call help us understand where you are — and whether the Academy is the right next step for you.',
  },
]

export default function Academy() {
  return (
    <div className="container teams-page">
      <SiteNav />

      <section className="academy-layout" aria-label="Academy application">
        <div className="academy-main">
          <p className="landing-path-label">Academy</p>
          <h1 className="academy-main-title">
            <span className="academy-main-title-line">Apply first.</span>
            <span className="academy-main-title-line academy-main-title-line--emphasis">
              <span className="academy-main-title-strong">We'll decide </span>
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
            We don't take everyone. We take people who want calm, practical habits online and are ready to change how they act online. Each cohort is small, so coaching stays personal and nobody gets lost in the crowd. Here's how it works from here.
          </p>
          <AcademyCohortNote />

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
          <div className="academy-steps-cta">
            <Link to="/academy/apply" className="academy-start-btn">
              Start the application
            </Link>
          </div>
        </div>

        <aside className="academy-faq" aria-labelledby="academy-faq-title">
          <h2 id="academy-faq-title" className="academy-faq-title">Common Questions</h2>
          <p className="academy-faq-intro">
            Any questions? Don't see yours below?{' '}
            <Link to="/teams#contact">Use the contact form</Link>
            {' '}— a real person from our team will reply, usually within a day.
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
        </aside>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
