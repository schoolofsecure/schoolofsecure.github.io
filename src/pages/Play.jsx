import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { PerfImg } from '../components/PerfImg'
import '../styles/site.css'

export default function Play() {
  return (
    <div className="container teams-page">
      <SiteNav />

      <section className="about-page" aria-labelledby="play-title">
        <p className="landing-path-label">About the game</p>
        <div className="about-copy play-copy">
          <h1 id="play-title" className="about-title">Spot what is off before you say yes</h1>
          <p className="play-lead">
            Aurora is a short game for the pause before a fast online decision.
          </p>
          <p>
            You land in a situation like an email, a login or a request that feels slightly off. You choose what to do, then see what gave it away.
          </p>
          <div className="play-preview" role="group" aria-label="Example of a round">
            <PerfImg
              className="play-preview-shot"
              src="/images/aurora-round-preview.png"
              alt="Aurora Task 1: decrypt an unexpected message"
              width="2190"
              height="1086"
              priority
            />
            <p className="play-preview-caption">
              In Aurora, you choose before you see what gave it away.
            </p>
          </div>
          <p className="play-callout">
            There is no lecture and no penalty for a miss. You notice cues as you go; a wrong choice stays in the game, not on your record at work.
          </p>
          <p className="play-account-note">
            Create a free account after your first round to keep your progress: what you notice sooner and where you pause more often.
          </p>
          <p className="play-cta">
            <Link to="/aurora" className="btn btn-primary">Play Aurora</Link>
          </p>
        </div>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
