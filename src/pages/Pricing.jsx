import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { pricingPlans } from '../data/pricingPlans'
import '../styles/site.css'

export default function Pricing() {
  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <header className="page-header">
          <h1>Pricing</h1>
        </header>

        <p className="price-upgrade-hint">
          Start with Free. Upgrade when you want regular practice and tracked progress.
        </p>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className={`price-card${plan.highlight ? ' highlight' : ''}`}>
              <h2>{plan.title}</h2>
              <p className="price-amount">{plan.amount}</p>
              {plan.billingNotes?.map((note) => (
                <p key={note.text || 'yearly'} className="price-note">
                  {note.yearly ? (
                    <>or <strong>€49.99 per year</strong> · <span className="text-accent">Best Value</span></>
                  ) : (
                    note.text
                  )}
                </p>
              ))}
              <p className="price-desc">{plan.desc}</p>
              <p className="price-for-you">{plan.forYou}</p>
              <ul className="feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link to={plan.cta.to} className="btn btn-primary price-card-cta">
                {plan.cta.label}
              </Link>
            </div>
          ))}
        </div>

        <p className="pricing-disclaimer">
          No certificates, accredited qualifications, official certifications, job guarantees or lifetime access claims.
        </p>

        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
