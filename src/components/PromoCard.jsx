import React from 'react'
import { Link } from 'react-router-dom'

export default function PromoCard({ label, title, text, to, linkLabel }) {
  return (
    <article className="landing-path teams-how-card">
      <p className="landing-path-label">{label}</p>
      <h3>{title}</h3>
      <p>{text}</p>
      {to && linkLabel && (
        <Link to={to} className="btn btn-secondary teams-btn teams-how-card-btn">
          {linkLabel}
        </Link>
      )}
    </article>
  )
}
