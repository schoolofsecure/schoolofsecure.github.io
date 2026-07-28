import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { FOUNDER_LINKEDIN_URL } from '../data/brand'
import '../styles/site.css'

export default function About() {
  return (
    <div className="container teams-page">
      <SiteNav />

      <section className="about-page" aria-labelledby="about-title">
        <p className="landing-path-label">About</p>
        <div className="about-layout">
          <div className="about-photo-col">
            <img
              className="about-photo"
              src="/images/erika-papp-kovacs.jpg"
              alt="Erika Papp-Kovacs"
              width="220"
              height="220"
            />
            <p className="about-meta-name">Erika Papp-Kovacs</p>
            <p className="about-meta-line">Questions welcome in English and German.</p>
            <p className="about-meta-flags" aria-hidden="true">🇬🇧 · 🇩🇪</p>
            <div className="about-meta-links">
              <a href={FOUNDER_LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div className="about-copy">
            <h1 id="about-title" className="about-title">About Me</h1>
            <p>
              I&apos;m Erika Papp-Kovacs, and I created Iterali to make life online feel calmer, clearer and more manageable. I believe digital safety should not feel heavy or intimidating. It should feel practical, human and part of everyday life.
            </p>
            <p>
              My background combines law, economics and digital trust and security systems, which means I care both about clear thinking and real-world action. I&apos;m especially interested in helping people build calm habits online, so they can make better decisions without stress or fear.
            </p>
            <p>
              Iterali is my way of bringing that idea to life: thoughtful, practical and optimistic support for everyday online decisions. I want people to feel more confident, not more overwhelmed.
            </p>
            <p className="about-background">
              Final-year law student and economist, with a background in digital trust and security systems (DigiCert, Entrust nShield, Cybersecurity Specialist).
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
