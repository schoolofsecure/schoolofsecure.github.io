import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../index.css'

const Landing = () => {
  const [gdprAgreed, setGdprAgreed] = useState(false)
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false)
  const [showGdprHint, setShowGdprHint] = useState(false)
  const { user, registerWithEmail, loginWithEmail, logout, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookieConsent')
      if (!consent) {
        setCookieBannerVisible(true)
      }
    } catch (e) {}
  }, [])

  const handleCookieAccept = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted')
      setCookieBannerVisible(false)
    } catch (e) {}
  }

  const handleSignup = (e) => {
    if (!gdprAgreed) {
      e.preventDefault()
      setShowGdprHint(true)
      // Scroll to the gdpr section
      setTimeout(() => {
        const signupSection = document.getElementById('signup')
        if (signupSection) {
          signupSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }
    setShowGdprHint(false)
  }

  const handleRegister = async () => {
    const result = await registerWithEmail(email, password)
    alert(result.message)
  }

  const handleLogin = async () => {
    const result = await loginWithEmail(email, password)
    alert(result.message)
  }

  const handleLogout = async () => {
    const result = await logout()
    alert(result.message)
  }

  return (
    <div className="container">
      <header>
        <Link to="/" className="brand" aria-label="CyberMystery">
          <div className="brand-badge">CM</div>
          <div className="brand-title">CyberMystery</div>
        </Link>
      </header>

      <section className="hero" aria-label="Fő szekció">
        <div className="hero-copy">
          <h1>Fedezd fel a digitális titkokat!</h1>
          <p className="lead">Interaktív online nyomozós krimi a kiberbiztonság világában. Oldj meg <strong>rejtélyeket</strong>, fejts meg <strong>logikai feladványokat</strong>, hozz meg <strong>döntéseket</strong> – és leplezd le, ki áll a digitális támadások mögött.</p>
          <div className="features">
            <div className="feat"><h4>Nyomozás</h4><p>Interjúk, nyomok, idővonal, bizonyítékok.</p></div>
            <div className="feat"><h4>Hackelés</h4><p>Kódtörés, hálózati minták, OSINT feladatok.</p></div>
            <div className="feat"><h4>Logika</h4><p>Fejtörők, rejtvények, kombinációk.</p></div>
            <div className="feat"><h4>Döntések</h4><p>Több lehetséges végkimenetel.</p></div>
          </div>
          <div className="cta-row">
            <a 
              id="heroBtn" 
              href="https://forms.gle/pVMdZ7SSWWbCJhzdA" 
              target="_blank" 
              rel="noopener" 
              className="btn btn-primary" 
              aria-label="Kezdd el a nyomozást" 
              aria-disabled={!gdprAgreed}
              onClick={handleSignup}
            >
              Kezdd el a nyomozást
            </a>
          </div>
        </div>
        <div className="hero-media">
          <div className="terminal-card" role="img" aria-label="Hangulatvizuál – neon terminál">
            <div className="terminal-bar">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="terminal-body">
              <div><span className="prompt">investigator@cm</span>:~$ trace --source breach.log</div>
              <div>› scanning network… <span style={{color:'var(--ok)'}}>OK</span></div>
              <div>› anomaly detected: <span style={{color:'var(--danger)'}}>UNAUTHORIZED ACCESS</span></div>
              <div>› decrypting payload… ████░░░░░ 42%</div>
              <div>› clue unlocked: <em>"A jelszó a történetben rejtőzik."</em></div>
              <div>_ <span className="cursor"></span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="signup" className="signup" aria-label="Feliratkozás">
        <div>
          <h2 style={{margin: '0 0 6px', fontFamily: 'Rajdhani, Inter, sans-serif'}}>Jelentkezz most – az első feladvány 24 órán belül érkezik.</h2>
        </div>
        <div className="cta-row" style={{justifyContent:'center'}}>
          <a 
            id="signupBtn" 
            href="https://forms.gle/pVMdZ7SSWWbCJhzdA" 
            target="_blank" 
            rel="noopener" 
            className="btn-submit" 
            style={{textDecoration:'none'}} 
            aria-disabled={!gdprAgreed}
            onClick={handleSignup}
          >
            Kérem az első nyomot
          </a>
        </div>
        <div className="gdpr-consent">
          <div className="gdpr-checkbox">
            <input 
              type="checkbox" 
              id="gdprAgree" 
              checked={gdprAgreed}
              onChange={(e) => {
                setGdprAgreed(e.target.checked)
                if (e.target.checked) {
                  setShowGdprHint(false)
                }
              }}
            />
            <label htmlFor="gdprAgree">
              Elfogadom, hogy adataimat a játék céljára kezeljék. Bővebben az <Link to="/privacy">adatkezelési tájékoztatóban</Link>.
            </label>
          </div>
          {(showGdprHint || !gdprAgreed) && (
            <div 
              id="gdprHint" 
              style={{
                marginTop:'6px', 
                fontSize:'12px', 
                color: showGdprHint ? 'var(--danger)' : 'var(--muted)',
                fontWeight: showGdprHint ? 600 : 400,
                transition: 'color 0.3s ease'
              }}
            >
              A gomb aktiválásához fogadd el az adatkezelést.
            </div>
          )}
        </div>
      </section>

      <section id="brief" className="sidebar-layout" style={{margin: '28px 0 6px'}}>
        <div className="brief-left">
          <h3 style={{fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 8px'}}>Miért izgalmas?</h3>
          <ul style={{margin: 0, paddingLeft: '18px', color: 'var(--muted)', lineHeight: 1.8}}>
            <li>Nyomozás a kiberbiztonság szürke zónájában: minden döntésed számít.</li>
            <li>Fejleszti a problémamegoldást és a logikai gondolkodást.</li>
            <li>Változatos pályák: OSINT feladatok, kódtörés, hálózati nyomok elemzése.</li>
            <li>Újrajátszhatóság: több befejezés, rejtett szálak, bónusznyomok.</li>
          </ul>
          <div className="tips" aria-label="Secure kiberbiztonsági tippjei">
            <h4>Secure kiberbiztonsági tippjei</h4>
            <ul>
              <li>Ellenőrizd, szerepel‑e az e‑mail címed a „Have I Been Pwned"-on.</li>
              <li>Titkosítsd a Wi‑Fi‑t – még otthon is.</li>
              <li>Kétlépcsős azonosítás: nem csak erős, de extra biztonság.</li>
              <li>Biztonsági kérdések? Használj kitalált válaszokat.</li>
              <li>Offline mentés = adataid tartós védelme.</li>
            </ul>
          </div>
        </div>
        <aside className="secure-figure" aria-label="Secure – kiberbiztonsági szakértő">
          <img src="/images/secure.png" alt="Secure – kiberbiztonsági szakértő portré" loading="lazy" decoding="async" />
          <p className="secure-caption">Szia, Secure vagyok – kiberbiztonsági szakértő. Imádom a rejtett mintákat és a logikai kihívásokat. Végigvezetlek a bizonyítékokon, közben praktikus tippekkel és eszközökkel segítek, hogy magabiztosan gondolkodj, mint egy profi nyomozó.</p>
        </aside>
      </section>

      <section className="signup" aria-label="Bejelentkezés és játékállás mentés" style={{marginTop: '20px'}}>
        <div>
          <h2 style={{margin: '0 0 6px', fontFamily: 'Rajdhani, Inter, sans-serif'}}>Belépés / Regisztráció</h2>
          <div id="cm-auth-status" style={{color: 'var(--muted)', fontSize: '14px'}}>
            {user && user.emailVerified ? `Bejelentkezve: ${user.email}` : user && !user.emailVerified ? `E-mail megerősítés szükséges: ${user.email}` : 'Nem vagy bejelentkezve'}
          </div>
        </div>
        <form id="cm-auth-form" style={{opacity: user && user.emailVerified ? 0.5 : 1}}>
          <input 
            id="cm-email" 
            className="input" 
            type="email" 
            placeholder="E-mail cím" 
            autocomplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            id="cm-pass" 
            className="input" 
            type="password" 
            placeholder="Jelszó" 
            autocomplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="cta-row">
            <button id="cm-login" className="btn-submit" type="button" onClick={handleLogin}>Bejelentkezés</button>
            <button id="cm-register" className="btn-secondary" type="button" style={{height:'56px'}} onClick={handleRegister}>Regisztráció</button>
            {user && (
              <button id="cm-logout" className="btn-secondary" type="button" style={{height:'56px'}} onClick={handleLogout}>Kijelentkezés</button>
            )}
          </div>
        </form>
      </section>

      <section aria-label="Idézet" style={{margin: '10px 0 30px'}}>
        <blockquote style={{margin:0, padding: '14px 16px', background: '#0f1621', border: '1px solid rgba(207,230,255,0.08)', borderRadius: '12px', color: 'var(--ink)'}}>
          „Mint egy modern noir – neonfényben úszó kódsorok, rejtett minták, és egy nyom, ami végigvezet a sötét web határáig."
        </blockquote>
      </section>

      <footer>
        <div className="footer-social">
          <a href="https://www.facebook.com/groups/1177342823898055" target="_blank" rel="noopener" aria-label="Csatlakozz a Facebook közösséghez">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.675 0h-21.35C.596 0 0 .597 0 1.333v21.333C0 23.403.596 24 1.325 24h11.495v-9.294H9.847V11.06h2.973V8.413c0-2.94 1.792-4.544 4.412-4.544 1.253 0 2.332.093 2.646.135v3.07l-1.816.001c-1.423 0-1.698.676-1.698 1.668v2.318h3.396l-.442 3.646h-2.954V24h5.789C23.404 24 24 23.403 24 22.667V1.333C24 .597 23.404 0 22.675 0z"></path>
            </svg>
            <span>Csatlakozz a közösséghez és bázishoz</span>
          </a>
        </div>
        © 2025 CyberMystery. Minden jog fenntartva.
      </footer>

      {cookieBannerVisible && (
        <div id="cookieBanner" className="cookie-banner" role="region" aria-label="Cookie tájékoztató">
          <div className="cookie-card">
            <div className="cookie-text">
              Ez a weboldal kizárólag a működéshez szükséges cookie-kat használ.
            </div>
            <div className="cookie-actions">
              <button 
                id="cookieSettings" 
                className="btn-ghost" 
                type="button"
                onClick={() => alert('Csak működéshez szükséges cookie-kat használunk – nincs követés / analitika ezen az oldalon.')}
              >
                Beállítások
              </button>
              <button id="cookieAccept" className="btn-accept" type="button" onClick={handleCookieAccept}>Elfogadom</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Landing

