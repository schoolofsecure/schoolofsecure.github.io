import React from 'react'
import { Link } from 'react-router-dom'

const LOGO_SRC = '/images/iterali logo.png'

export function BrandLogo({ to = '/', className = 'brand', ariaLabel = 'Iterali' }) {
  const content = (
    <>
      <img src={LOGO_SRC} alt="" className="brand-logo" aria-hidden="true" />
      <div className="brand-title">Iterali</div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  return (
    <div className={className} aria-label={ariaLabel}>
      {content}
    </div>
  )
}

export default BrandLogo
