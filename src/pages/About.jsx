import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../styles/site.css'

export default function About() {
  return (
    <div className="container teams-page">
      <SiteNav />

      <section className="about-page" aria-labelledby="about-title">
        <p className="landing-path-label">About</p>
        <div className="about-copy">
          <h1 id="about-title" className="about-title">Why Iterali?</h1>
          <p>
            Free reads and simple practice for calmer online decisions.
          </p>
          <p>
            Come for a useful article. Stay to try one realistic situation in Aurora: an urgent email, a login prompt or a request that feels slightly off. You sign in to play.
          </p>
          <p>
            <Link to="/aurora" className="btn btn-primary">Play Aurora</Link>
          </p>
        </div>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
