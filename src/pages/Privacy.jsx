import React, { useState } from 'react'
import '../index.css'

const Privacy = () => {
  const [revealedEmails, setRevealedEmails] = useState(false)
  const emails = ['schoolofsecure@gmail.com', 'secure@schoolofsecure.com']

  return (
    <div className="container">
      <div className="card">
        <h1 id="adatkezeles">Adatkezelési tájékoztató</h1>
        <p className="muted">Utolsó frissítés: 2025-01-01</p>
        <span className="pill">GDPR kompatibilis</span>

        <div className="grid" style={{marginTop:'14px'}}>
          <section className="section">
            <h2>1. Adatkezelő</h2>
            <p>Az interaktív nyomozós krimi (kiberbiztonság témában) jelentkezéseinek és kommunikációjának kezelője: <strong>Papp‑Kovács Erika</strong> (adatkezelő). Elérhetőség: 
              {revealedEmails ? (
                <span>
                  {emails.map((email, i) => (
                    <span key={email}>
                      <a href={`mailto:${email}`}>{email}</a>
                      {i < emails.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              ) : (
                <span 
                  className="obf-emails" 
                  onClick={() => setRevealedEmails(true)}
                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                  [e‑mail címek megjelenítése]
                </span>
              )}
            </p>
          </section>

          <section className="section">
            <h2>2. Kezelt adatok köre</h2>
            <ul>
              <li>E‑mail cím.</li>
            </ul>
          </section>

          <section className="section">
            <h2>3. Adatkezelés célja és jogalapja</h2>
            <ul>
              <li>Játékhoz kapcsolódó kommunikáció, feladványok küldése (hozzájárulás – GDPR 6. cikk (1) a)).</li>
              <li>Rendszerbiztonság és hibakeresés (jogos érdek – GDPR 6. cikk (1) f)).</li>
            </ul>
          </section>

          <section className="section">
            <h2>4. Megőrzési idő</h2>
            <ul>
              <li>Feliratkozási adatok: a visszavonásig, de legfeljebb 24 hónap.</li>
              <li>Technikai naplók: legfeljebb 90 nap.</li>
            </ul>
          </section>

          <section className="section">
            <h2>5. Adatfeldolgozók, adattovábbítás</h2>
            <ul>
              <li>Google Forms (feliratkozások gyűjtése).</li>
              <li>E‑mail szolgáltató a feladványok kiküldéséhez.</li>
            </ul>
            <p>Harmadik országba irányuló adattovábbítás esetén az EU megfelelőségi határozata vagy megfelelő garanciák biztosítottak.</p>
          </section>

          <section className="section" id="cookies">
            <h2>6. Sütik (Cookie-k)</h2>
            <p>Az oldal kizárólag a működéshez feltétlenül szükséges cookie-kat használ (beállítások, űrlapvédelem, alapszintű működés). Profilozó vagy marketing cookie-kat nem alkalmazunk.</p>
          </section>

          <section className="section">
            <h2>7. Érintetti jogok</h2>
            <ul>
              <li>Hozzáférés és tájékoztatás kérése a kezelt adatokhoz.</li>
              <li>Helyesbítés, törlés („elfeledtetés"), adatkezelés korlátozása.</li>
              <li>Hozzájárulás visszavonása bármikor, indoklás nélkül.</li>
              <li>Adathordozhatóság (automatikusan kezelt adatok esetén).</li>
              <li>Panasz benyújtása: Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH).</li>
            </ul>
          </section>

          <section className="section">
            <h2>8. Adatbiztonság</h2>
            <p>Megfelelő technikai és szervezési intézkedésekkel védjük a személyes adatokat a jogosulatlan hozzáféréssel, megváltoztatással vagy nyilvánosságra hozatallal szemben.</p>
          </section>

          <section className="section">
            <h2>9. Kapcsolat</h2>
            <p>Adatkezeléssel kapcsolatos megkeresés: 
              {revealedEmails ? (
                <span>
                  {emails.map((email, i) => (
                    <span key={email}>
                      <a href={`mailto:${email}`}>{email}</a>
                      {i < emails.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              ) : (
                <span 
                  className="obf-emails" 
                  onClick={() => setRevealedEmails(true)}
                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                  [e‑mail címek megjelenítése]
                </span>
              )}
            </p>
          </section>

          <section className="section">
            <h2>10. Hatály</h2>
            <p>Jelen tájékoztató az interaktív nyomozós krimi játék (kiberbiztonság témában) landing oldalára és kommunikációjára vonatkozik. Változás esetén a módosított verzió lép hatályba a közzétételtől.</p>
          </section>
        </div>
        <p className="footer">© 2025 CyberMystery – Adatkezelési tájékoztató</p>
      </div>
    </div>
  )
}

export default Privacy

