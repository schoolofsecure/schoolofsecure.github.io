// Ügyek konfigurációi
import React from 'react'
export const ugy1Config = {
  level: 1,
  title: "A múzeum éjszakája",
  badge: "Múzeum - éjszakai műszak",
  headerTitle: "A múzeum éjszakája - Ügy #1",
  narrativeTitle: "A múzeum éjszakája - Ügy #1",
  narrativeText: "Az üres termekben csak az érzékelők pislognak. Az archívumban mozgás nyomai, de hiányzik az idővonal. A restaurátor szerint \"csak egy kis rendrakás\" - szerintünk nem.",
  isDynamic: false,
  totalTasks: 5,
  images: ['/images/1a.jpg', '/images/1b.jpg', '/images/1c.jpg', '/images/1d.jpg', '/images/1e.jpg'],
  nextLevelRoute: "/ugy2",
  nextLevelText: "Tovább az Éjféli kézfogásra",
  specialComponents: { wordSearch: true, matchTable: true, archive: true },
  tasks: [
    {
      step: 0,
      title: "1. feladat",
      leftTitle: "Rejtjel",
      leftContent: (
        <>
          <p className="muted">
            Éjfél van, a múzeum szerveréről váratlanul titkosított üzenet érkezett.<br /><br />
            A képernyőn furcsa karakterek villognak, mintha valaki sietve rejtette volna el az üzenetet.<br /><br />
            <code>Yljbdcc, Crol ohkhw wlwnrvxjbqrn</code><br /><br />
            A biztonsági csapat tanácstalan, de te, friss kibernyomozóként, készen állsz a felderítésre.
          </p>
          <div className="statusline">
            Fejtsd meg a titkosított üzenetet, hogy megtudd az első nyomot a küldetésedhez.
            A kijelző felvillan, a sorok villogni kezdenek… minden karakter egy újabb nyomot rejt.
            Ha sikerül megfejtened, a titkosított hálózaton tovább jutsz, és a következő bizonyíték vár.
          </div>
        </>
      ),
      rightTitle: "Válasz",
      placeholder: "üzenet…",
      expectedAnswer: (val, norm) => {
        const expected = 'Vigyázz, Zoli lehet titkosügynök.';
        return norm(val) === norm(expected);
      },
      hint: (
        <>
          <p className="muted" style={{margin:'8px 0 0'}}>
            Gondolj az ábécére, és képzeld el, hogy minden betű egy kicsit előrébb vagy hátrébb lép a sorban.
            A szóközök és írásjelek nem változnak. Próbáld kibogozni a titkos üzenetet, amely el van rejtve a karakterek között.
          </p>
          <div className="hint-chips" aria-hidden="true">
            <span className="hint-chip">rot‑3</span>
            <span className="hint-chip">shift‑3</span>
            <span className="hint-chip">A↔X, B↔Y, C↔Z</span>
            <span className="hint-chip">Caesar</span>
          </div>
        </>
      ),
      difficulty: 'easy'
    },
    {
      step: 1,
      title: "2. feladat",
      leftTitle: "Torzult rendszerlog",
      leftContent: (
        <>
          <p className="muted">Ahogy a múzeum biztonsági szerverszobájába lépsz, a levegő vibrál.</p>
          <p className="muted">A ventilátorok túl gyorsan pörögnek, a monitorokon pedig remegő sorok futnak.</p>
          <p className="muted" style={{marginTop:'8px'}}>
            A technikusok szerint valaki éjjel hozzáfért a rendszerhez és „kitisztította" a nyomait.
            Csakhogy a hacker amatőr hibát vétett: hátrahagyott egy félbehagyott logfájlt, amelyben a fontos részeket ugyan törölte,
            de egy mintát nem tudott eltakarni.
          </p>
          <p className="muted" style={{marginTop:'8px'}}>A logfájl vége villogva jelenik meg előtted:</p>
          <div className="console float-soft" aria-label="Rendszer napló">
            <span className="line"><span className="ts">2025-11-21 09:02:14</span> <span className="lvl info">INFO</span>  <span className="kv">SessionID=Nd0f94be7ac21f44f...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:17</span> <span className="lvl warn">WARN</span>  <span className="kv">PayloadHash=Y57ac90b32df1a...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:20</span> <span className="lvl info">INFO</span>  <span className="kv">LoginToken=Oaa12f8c0bffe942...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:24</span> <span className="lvl error">ERROR</span> <span className="kv">ReqHash=Mc21f9ee8b1127c3...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:28</span> <span className="lvl info">INFO</span>  <span className="kv">OutID=Od991e0bc113fe0...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:32</span> <span className="lvl alert">ALERT</span> <span className="kv">KeyRef=Kb019aaef9e13cc1...</span></span>
          </div>
          <div className="statusline" style={{marginTop:'10px'}}>
            Gyűjtsd össze a naplósorok értékeinek első betűit,
            olvasd össze kulcsszóvá, majd írj be a mezőbe.
          </div>
        </>
      ),
      rightTitle: "Válasz",
      placeholder: "kulcsszó…",
      expectedAnswer: (val, norm) => {
        const v = norm(val).replace(/[\s\-_.]/g,'');
        return v === 'NYOMOK';
      },
      hint: (
        <p className="muted" style={{margin:'8px 0 0'}}>
          Figyeld a kulcs‑érték párokat. Minden érték vezető karaktere fontos a következő feladathoz.
          Gyűjtsd össze ezeket a karaktereket, és rakd össze a jelszót!
          (Magyarázat: a „kulcs‑érték pár" olyan forma, mint „Név=Secure" - a bal oldal a kulcs, a jobb oldal az érték.)
        </p>
      ),
      difficulty: 'medium'
    },
    {
      step: 2,
      title: "3. feladat",
      leftTitle: "Titkosított levél",
      leftContent: (
        <>
          <div className="card" style={{background:'#0b121c', borderColor:'rgba(207,230,255,0.12)'}}>
            <p className="muted" style={{whiteSpace:'pre-line', margin:0}}>
Kedves ismeretlen!

Ma nyolckor a kávézónál vártalak volna,
de három pillanat alatt elszaladt az idő.

Minden percben egyetlen percet gondolok rád,
és hét lépés távolságban érzem a közelséged.

 Először azok a pillanatok törnek elő, amelyek a legerősebben élnek bennem.
 Ezután következik az érzés, ami először megmozdította a szívemet.
 A következő jelek a közénk feszülő tér rezdüléseiben bújnak meg.
 Végül a röpke, elsuhanó percek rajzolják ki a történet teljes képét.

Üdvözlettel, S.</p>
          </div>
          <div className="statusline" style={{marginTop:'10px'}}>
            Gépeld be a 4 számjegyű kulcskódot - a levél suttogja a megoldást.
          </div>
        </>
      ),
      rightTitle: "Válasz",
      placeholder: "4 számjegy…",
      expectedAnswer: (val, _norm) => {
        const v = String(val||'').replace(/\D/g,'');
        return v === '3871';
      },
      okText: "Helyes! Tovább…",
      errText: "Nem egészen - figyeld a számokat szavakban és a sorrendet.",
      hint: (
        <p className="muted" style={{margin:'8px 0 0'}}>
          Figyeld a levél apró utalásait - bizonyos szavak mögött rejlenek a kulcs jelei.
          A sorrend titka a történet ritmusában bújik meg: csak ha jól olvasod, áll össze a kód.
        </p>
      ),
      difficulty: 'medium'
    },
    {
      step: 3,
      title: "4. feladat",
      leftTitle: "Kódolt betűk",
      leftContent: (
        <>
          <p className="muted" style={{margin:'8px 0 10px'}}>
            A múzeum egyik archivált adatcsomagjában furcsa szövegrácsot találtak.<br /><br />
            A technikusok szerint valaki szándékosan rejtett el benne kulcsszavakat, amelyek a rendszerbe történt behatolásra utalnak.
            A mintázat túl rendezett ahhoz, hogy véletlen legyen.<br /><br />
            A biztonsági csapat téged kér, hogy keresd meg a rejtett szavakat — ezek vezetnek a következő nyomhoz.<br />
            De vigyázz: a támadó mindig hagy egy hamis nyomot is, hogy megtévessze a nyomozókat.
          </p>
          <div className="ws-wrap">
            <div className="ws-board">
              <div id="wsGrid" className="ws-grid"></div>
            </div>
            <div className="ws-words">
              <strong>Keresendő szavak:</strong>
              <ul id="wsList" style={{margin:'8px 0 0 16px', padding:0}}></ul>
              <div id="wsDone" className="ws-done">Kész!</div>
            </div>
          </div>
          <div className="statusline" style={{marginTop:'10px'}}>
            Jelöld ki a rácsban elrejtett szavakat.
            A megtalált szavak első betűi számokká alakulnak - olvasd össze a négy számot kóddá.
          </div>
        </>
      ),
      rightTitle: "Kód",
      placeholder: "4 számjegy…",
      expectedAnswer: (val, _norm) => {
        const v = String(val||'').replace(/\D/g,'');
        return v === '3542';
      },
      okText: "Helyes! Tovább…",
      errText: "Nem egészen - előbb találd meg a szavakat, majd alakítsd számokká az első betűiket.",
      hint: (
        <p className="muted" style={{margin:'8px 0 0'}}>
          Minden szó első betűje számot rejt. Figyeld a rácsban elrejtett kulcsszavakat, így juthatsz a következő kódhoz.
        </p>
      ),
      difficulty: 'hard',
      needsWordSearch: true
    },
    {
      step: 4,
      title: "5. feladat",
      leftTitle: "Nyomok dokumentálása",
      leftContent: (
        <>
          <p className="muted">A központ rákérdez, mennyire figyeltél az eddigi nyomokra. Egy ügyes kibernyomozó minden nyomot rendszerez, hogy később könnyen visszakereshető legyen.</p>
          <p className="muted">Dokumentáld az előző négy feladat nyomait! Írj le minden nyomot külön sorban, és jelöld, honnan származik. Csak akkor tudsz továbblépni, ha mind a négy nyomot helyesen jegyzed fel.</p>
        </>
      ),
      rightTitle: "Táblázat",
      needsMatchTable: true,
      difficulty: 'hard'
    }
  ]
};

export const ugy2Config = {
  level: 2,
  title: "Éjféli kézfogás",
  badge: "Éjféli kézfogás",
  headerTitle: "Éjféli kézfogás - Ügy #2",
  narrativeTitle: "Éjféli kézfogás - Ügy #2",
  narrativeText: (
    <>
      <p>
        A múzeum csendje most valahogy nyugtalanítóbb, mint előző éjjel. A kamera-rendszer továbbra is akadozik,
        a hálózati térkép pedig ismeretlen kapcsolatokat mutat - olyanokat, amelyeknek nem kellene létezniük.
      </p>
      <p>
        Úgy tűnik, az éjszakai behatoló nem csak a gépeket érintette, hanem lassan próbál behatolni a teljes rendszerbe.
        Ha sikerül neki mélyebbre jutnia, a múzeum rendszereinek titkai pillanatok alatt kiszivároghatnak. Rajtad múlik, hogy visszaverd a támadást.
      </p>
    </>
  ),
  isDynamic: true,
  totalTasks: 5,
  images: ['/images/2a.jpg', '/images/2b.jpg', '/images/2c.jpg', '/images/2d.jpg', '/images/2e.jpg'],
  nextLevelRoute: "/ugy3",
  nextLevelText: "Tovább az Árnyak Ösvényére",
  specialComponents: {},
  taskLabels: {
    CAESAR: 'Titkosított suttogás',
    VIGENERE: 'Kulcskeringő',
    XOR: 'Villanó bitek',
    HASH_MISMATCH: 'Elcsúszott ujjlenyomat',
    ICON_MEMORY: 'Szimbólum-memória',
    PASSWORD_STRENGTH: 'Gyanús jelszóváltoztatás',
    PHISHING: 'Kurátori csali levél',
    URL_TRUST: 'Kapuhivatkozás vizsgálat',
    LOG_ANALYSIS: 'Éjjeli logvadászat',
    SOCIAL_ENGINEERING: 'Beszivárgó kérés',
    FIREWALL: 'Rendszerkapcsolat-vadász tűzfal',
    MISCONFIG: 'Rejtett konfigurációs hiba',
    RISKY_PERMISSION: 'Veszélyes engedélykérés',
    SECURITY_DECISION: 'Nyomok mérlegelése',
    CRYPTO_PUZZLE: 'Mini kripto rejtély',
    PSEUDOCODE_BUG: 'Pszeudokód csapda',
    NETWORK_ANOMALY: 'Hálózati burjánzás',
    EMAIL_HEADER: 'Fejléc-röntgen',
    ATTACK_SCENARIO: 'Támadási mozaik',
    ZERO_DAY: 'Nulladik nap dilemma'
  },
  taskImages: {
    PASSWORD_STRENGTH: '/images/2b.jpg',
    FIREWALL: '/images/2e.jpg',
    PHISHING: '/images/2c.jpg',
    SOCIAL_ENGINEERING: '/images/2a.jpg',
    SECURITY_DECISION: '/images/2d.jpg'
  },
  taskStories: {
    PASSWORD_STRENGTH: {
      title: 'Gyanús jelszóváltoztatás',
      text: `A rendszer egyik adminfiókja szokatlan jelszóváltoztatási kérelmet küldött be.

A kérelem pont akkor érkezett, amikor az ismeretlen „rendszerkapcsolat létesítése" riasztás aktiválódott.

Most rajtad a sor, hogy dönts:

A javasolt jelszó megfelel-e a biztonsági követelményeknek, vagy a támadó próbál gyenge autentikációt becsempészni a rendszerbe.

Válaszd ki a legbiztonságosabb döntést, hogy megakadályozd a támadót a további hozzáférésben.`
    },
    FIREWALL: {
      title: 'Rendszerkapcsolat-vadász tűzfal',
      text: `A tűzfal naplója szerint néhány külső cím váratlanul „engedélyezett" állapotba került.
    Ha rosszul zárod le a szabályt, a múzeum fontos érzékelői némulhatnak el - de ha nyitva hagyod, a támadó tartós hozzáférést szerezhet.

A látogatói webkioszkot ideiglenesen leválasztották a belső hálóról, de továbbra is kiszolgálja a digitális tárlat webes felületét.

Engedélyezd a látogatók által használt webes protokollokat, de tartsd zárva az admin SSH‑csatornát, hogy a kioszkot kívülről ne lehessen módosítani.`
    },
    PHISHING: {
      title: 'Kurátori csali levél',
      text: `Egy kurátor postaládájában gyanús üzenet jelent meg, amely állítólag a belső technikai osztálytól érkezett.

    A logok szerint az éjszakai támadó küldhette, hogy megszerezze a bejelentkezési adatait.

Csak akkor állíthatod le az akciót, ha felismered a rejtett jeleket.

A logfájlok között elrejtett üzenetek várnak a megfejtésre. A rendszer mindig hagy nyomokat - csak meg kell találnod őket.

Egy felhasználó gyanús e-mailt jelentett.

Elemezd az üzenet tartalmát, és azonosítsd a phishing jellemzőket, hogy megakadályozd a támadást.`
    },
    SOCIAL_ENGINEERING: {
      title: 'Beszivárgó kérés',
      text: `Egy sürgős üzenet érkezett - állítólag a múzeum egyik technikusától. A hangvétele személyes, sietős, és segítséget kér.

De valami nem stimmel. A szóhasználat furcsa, a rendszerlogok pedig azt mutatják, hogy a küldő helyéről már korábban is érkeztek gyanús próbálkozások. Lehet, hogy ez csak egy újabb kísérlet arra, hogy rajtad keresztül jusson be a hálózatba.

Vizsgáld meg az üzenetet, elemezd a kérését, és döntsd el:

valódi segítségkérésről van szó, vagy csak egy manipulatív próbálkozás?

Válaszd ki azt a reakciót, amelyik megfelel a biztonsági protokollnak.`
    },
    SECURITY_DECISION: {
      title: 'Nyomok mérlegelése',
      text: `A rendszer riaszt: a támadó létrehozott egy rejtett rendszerkapcsolat‑alagutat.

Most rajtad a sor, hogy dönts:

- Azonnal lekapcsolod, ezzel megakadályozva, hogy tovább haladjon?

- Vagy megfigyeled a műveletet, hogy több információt gyűjts róla - vállalva a kockázatot, hogy közben mélyebbre juthat?

Minden választásod hatással lesz arra, mihez fér hozzá a támadó, és arra is, te mennyit derítesz ki a módszereiről.`
    }
  },
  unlockDate: '2025-12-06T19:00:00+01:00'
};

export const ugy3Config = {
  level: 3,
  title: "A kézbesítetlen üzenet",
  badge: "Üzenet - kézbesítetlen nyomok",
  headerTitle: "A kézbesítetlen üzenet - Ügy #3",
  narrativeTitle: "A kézbesítetlen üzenet - Ügy #3",
  narrativeText: "Az előző pályák nyomai egy újabb rejtélyhez vezettek. Egy üzenet soha nem érkezett meg a címzettjéhez, és a nyomok azt sugallják, hogy valaki megszakította a kommunikációt. Az előző két pálya megoldásai kulcsfontosságúak lesznek a folytatáshoz.",
  isDynamic: true,
  totalTasks: 5,
  images: ['/images/3a.jpg', '/images/3b.jpg', '/images/3c.jpg', '/images/3d.jpg', '/images/3e.jpg'],
  nextLevelRoute: "/ugy4",
  nextLevelText: "Következő ügy",
  specialComponents: {},
  requiresPrevious: true, // Előző pályák teljesítése szükséges
  storageKey: 'ugy3_progress',
  storageCompletedKey: 'ugy3_completed',
  forcedTypes: ['ICON_MEMORY', 'NETWORK_ANOMALY', 'EMAIL_HEADER', 'URL_TRUST', 'RISKY_PERMISSION'],
  forcedDifficulty: 'easy',
  taskLabels: {
    ICON_MEMORY: 'Szimbólum-memória',
    NETWORK_ANOMALY: 'Hálózati burjánzás',
    EMAIL_HEADER: 'Fejléc-röntgen',
    URL_TRUST: 'Kapuhivatkozás vizsgálat',
    RISKY_PERMISSION: 'Veszélyes engedélykérés'
  },
  taskImages: {
    ICON_MEMORY: '/images/3a.jpg',
    NETWORK_ANOMALY: '/images/3b.jpg',
    EMAIL_HEADER: '/images/3c.jpg',
    URL_TRUST: '/images/3d.jpg',
    RISKY_PERMISSION: '/images/3e.jpg'
  },
  taskStories: {
    ICON_MEMORY: {
      title: 'Szimbólum-memória',
      text: `A rendszer naplóiban gyanús ikonok és szimbólumok jelentek meg.
    
A támadó ezeket a jeleket használhatta, hogy kommunikáljon vagy információt hagyjon a rendszerben.
    
Emlékezz vissza a korábban látott ikonokra, és azonosítsd a veszélyes szimbólumokat.`
    },
    NETWORK_ANOMALY: {
      title: 'Hálózati burjánzás',
      text: `A hálózati forgalom elemzése során gyanús kapcsolatokat találtál.
    
A rendszer naplói szerint ismeretlen források próbálnak kapcsolatot létesíteni a belső hálózattal.
    
Elemezd a hálózati forgalmat, és azonosítsd az anomáliákat, hogy megakadályozd a támadást.`
    },
    EMAIL_HEADER: {
      title: 'Fejléc-röntgen',
      text: `Egy gyanús e-mail érkezett a rendszerbe, amely állítólag egy megbízható forrástól származik.
    
A támadó ezt az e-mailt használhatta, hogy megtévesztse a rendszert és hozzáférést szerezzen.
    
Elemezd az e-mail fejlécét, és azonosítsd a gyanús jeleket, hogy megakadályozd a támadást.`
    },
    URL_TRUST: {
      title: 'Kapuhivatkozás vizsgálat',
      text: `A rendszer egy gyanús URL-t észlelt, amely állítólag egy megbízható oldalra mutat.
    
A támadó ezt az URL-t használhatta, hogy megtévesztse a felhasználókat és adatokat lopjon.
    
Elemezd az URL-t, és döntsd el, hogy megbízható-e vagy sem.`
    },
    RISKY_PERMISSION: {
      title: 'Veszélyes engedélykérés',
      text: `Egy alkalmazás szokatlan engedélyeket kér a rendszertől.
    
A naplók szerint a támadó ezt az alkalmazást használhatta, hogy hozzáférést szerezzen a rendszerhez.
    
Elemezd az engedélykéréseket, és döntsd el, hogy melyek a veszélyesek.`
    }
  }
};

// Sablon függvény dinamikus pályákhoz
function createDynamicUgyConfig(level, title, badge, narrativeText) {
  const img = `/images/${level}.jpg`;
  const isLast = level === 12;
  return {
    level,
    title,
    badge,
    headerTitle: `${title} - Ügy #${level}`,
    narrativeTitle: `${title} - Ügy #${level}`,
    narrativeText,
    isDynamic: true,
    totalTasks: 5,
    images: Array(5).fill(img),
    nextLevelRoute: isLast ? "/aurora" : `/ugy${level + 1}`,
    nextLevelText: isLast ? "Vissza az Aurora-hoz" : "Következő ügy",
    specialComponents: {},
    requiresPrevious: true,
    taskLabels: ugy2Config.taskLabels,
    taskImages: {
      CAESAR: img,
      VIGENERE: img,
      XOR: img,
      PHISHING: img,
      LOG_ANALYSIS: img
    },
    taskStories: ugy2Config.taskStories
  };
}

export const ugy4Config = createDynamicUgyConfig(4, "A hiányzó idővonal", "Idővonal - hiányzó nyomok", "Az idővonalban hiányosságok jelentek meg. A nyomok azt sugallják, hogy valaki manipulálta az események sorrendjét. Az előző pályák megoldásai kulcsfontosságúak lesznek a folytatáshoz.");
export const ugy5Config = createDynamicUgyConfig(5, "A rejtett metaadat", "Metaadat - rejtett információ", "A fájlok metaadataiban rejtett információk bukkannak fel. Valaki szándékosan elrejtett fontos adatokat, amelyek a nyomozás kulcsai lehetnek.");
export const ugy6Config = createDynamicUgyConfig(6, "A szivárgó port", "Port - szivárgó kapcsolat", "A hálózati portokon szokatlan forgalom észlelhető. Valaki próbál behatolni a rendszerbe egy sebezhető porton keresztül.");
export const ugy7Config = createDynamicUgyConfig(7, "A kettős identitás", "Identitás - kettős szerep", "Két különböző identitás nyomai bukkannak fel. Valaki álcázza magát, és több szerepben is megjelenik a rendszerben.");
export const ugy8Config = createDynamicUgyConfig(8, "A törött kulcs", "Kulcs - törött titkosítás", "A titkosítási kulcsok sérültek vagy hiányoznak. Valaki megpróbálta feltörni a védelmet, és nyomokat hagyott maga után.");
export const ugy9Config = createDynamicUgyConfig(9, "A megszakított átvitel", "Átvitel - megszakított kapcsolat", "Egy fontos adatátvitel megszakadt. A nyomok azt sugallják, hogy valaki szándékosan zavarta meg a kommunikációt.");
export const ugy10Config = createDynamicUgyConfig(10, "A Phantom-Profil", "Profil - fantom identitás", "Egy fantom profil jelent meg a rendszerben. Valaki létrehozott egy láthatatlan identitást, amelyet csak a legapróbb nyomok árulnak el.");
export const ugy11Config = createDynamicUgyConfig(11, "A lopott árnyékfiók", "Fiók - lopott árnyék", "Egy árnyékfiók került ellopásra. Valaki megszerezte egy másik felhasználó identitását, és azzal próbál behatolni a rendszerbe.");
export const ugy12Config = createDynamicUgyConfig(12, "A főkolompos", "Főkolompos - végső rejtély", "Az utolsó rejtély. Minden nyom egyetlen pontra mutat: a főkolompos azonosítására. Itt dől el minden.");

// Konfigurációk map
export const ugyConfigs = {
  1: ugy1Config,
  2: ugy2Config,
  3: ugy3Config,
  4: ugy4Config,
  5: ugy5Config,
  6: ugy6Config,
  7: ugy7Config,
  8: ugy8Config,
  9: ugy9Config,
  10: ugy10Config,
  11: ugy11Config,
  12: ugy12Config
};

