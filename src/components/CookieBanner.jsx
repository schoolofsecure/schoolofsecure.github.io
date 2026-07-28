import React, { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('cookieConsent')) setVisible(true)
    } catch (e) {}
  }, [])

  const accept = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted')
    } catch (e) {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div id="cookieBanner" className="cookie-banner" role="region" aria-label="Cookie notice">
      <div className="cookie-notice">
        <p className="cookie-text">A few cookies help keep you signed in when you use an account.</p>
      </div>
      <div className="cookie-banner-action">
        <button type="button" className="cookie-accept" onClick={accept}>Accept</button>
      </div>
    </div>
  )
}
