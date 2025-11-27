## ugy2 layout módosítás – jelölés törlése gomb eltávolítása

- **Dátum:** 2025-11-27  
- **Fájl:** `src/components/TaskRenderer/TaskRenderer.jsx`

### Változás
- A phishing feladatnál (`PhishingTaskRenderer`) eltávolítottuk a `Jelölések törlése` gombot.
- A kiválasztott elemek törlése mostantól a checkbox ismételt kattintásával történik, így a viselkedés megegyezik az `ugy1` oldalon megszokott működéssel.

### 2025-11-27 — Feladattípus címek megjelenítése
- **Fájl:** `src/pages/ugy2/index.jsx`
- Hozzáadtunk egy `TASK_LABELS` mapet, amely az összes dinamikus feladattípust emberi, magyar címekre fordítja.
- A `TaskCard` címében mostantól megjelenik a feladat sorszáma és a feladattípus, pl. `2. feladat – Social engineering döntés`, így a játékos azonnal tudja, milyen típusú kihívás következik.

### 2025-11-27 — Konkrét tűzfal puzzle szcenáriók
- **Fájl:** `src/tasks/impl/FirewallRulesTask.js`
- Több előre definiált forgatókönyvet hoztunk létre (webkioszk, szenzor gateway, távoli labor, forenzikus híd).
- Minden szcenárió konkrét protokoll/port párokat, narratívát és súgót tartalmaz, így a játékos valódi döntést hoz, nem csak véletlen listából választ.
- A payload mostantól `intro`, `hint`, `requiredServices`, `blockedServices` mezőket kap, amelyekhez a későbbi renderer bővítések használhatók.

### 2025-11-27 — Firewall feladat UI
- **Fájl:** `src/components/TaskRenderer/TaskRenderer.jsx`
- Dedikált renderer készült a FIREWALL típushoz: minden szolgáltatás sorban jelenik meg, és engedélyez/tilt gombokkal állítható.
- A feladat most már objektumot küld vissza (`allow`/`deny` listák), így a validáció pontosan tükrözi a tűzfal szabályt.

### 2025-11-27 — Password strength feladat súgó
- **Fájl:** `src/tasks/impl/PasswordStrengthTask.js`
- A payload immár tartalmaz difficulty-függő `hint` mezőt, így az „Ellenőrzés” gomb alatt minden nehézségi szinten megjelenik egy rövid emlékeztető, mire érdemes figyelni (pl. speciális karakter, tiltott szó).

### 2025-11-27 — Task Preview: 60 fix feladat
- **Fájl:** `src/pages/task-preview/index.jsx`
- A korábbi kattintható lista helyett most minden feladattípus és nehézség egyszerre látszik (20 típus × 3 nehézség = 60 kártya).
- Minden kártya seedelt módon generált feladatot, megoldást és metainformációt tartalmaz, így QA során gyorsan ellenőrizhetők a variációk.

### 2025-11-27 — Pseudocode bug feladatok frissítése
- **Fájl:** `src/tasks/impl/PseudoCodeBugTask.js`
- A feladatok most külön easy/medium/hard snippet készletből választanak (belépés, SQL, token, 2FA, feltöltés).
- Minden snippet címet és leírást kapott, a payload pedig difficulty-alapú hintet ad, így a hiba egyértelműbb és kontextushoz kötött.

### 2025-11-27 — Phishing hard feladat
- **Fájl:** `src/tasks/impl/PhishingRecognitionTask.js`
- A phishing feladatoknál külön difficulty-konfigurációt vezettünk be (kötelező gyanús elemek száma, safe elemek aránya).
- Hard szinten új email-sablonok, reply-to mismatch, SPF/DKIM hibák és extra hint került a payloadba, így összetettebb lett a feladat.

### 2025-11-27 — Második pálya könnyített forgatókönyve
- **Fájl:** `src/tasks/LevelGenerator.js`
- A 2. pálya most fix easy feladatlistából dolgozik (Password Strength, Firewall, Phishing, Social Engineering, Security Decision), de a sorrend minden betöltéskor keveredik, így ugyanazok a típusok változatos sorrendben jelennek meg.
- Ennek célja, hogy az első pálya után stabil, mégis nem monoton gyakorló szakasz következzen.

### 2025-11-27 — Éjszakai kézfogás narratíva
- **Fájl:** `src/pages/ugy2/index.jsx`
- Új epizódcím (Éjszakai kézfogás) és narratív leírás került az oldal tetejére, valamint minden feladathoz külön történetblokk tartozik, hogy a játékos jobban értse, miért fontos az adott kihívás.

### 2025-11-27 — Duplikált feladattípusok tiltása
- **Fájl:** `src/tasks/LevelGenerator.js`
- A generátor most már pályánként egyszer engedélyez egy adott feladattípust (a forced listát leszámítva): ha a preferált pool kiürül, fallback-ként is csak olyan típust választhat, ami ebben a pályában még nem szerepelt.

### Miért volt szükség rá?
- A felhasználói kérés szerint a második pálya UI-ja legyen azonos az első pályáéval.
- A checkboxok már támogatják a visszavonást újrakattintással, így a külön törlő gomb redundáns volt.
-
- Több játékos visszajelzése szerint nem volt egyértelmű, milyen típusú feladatot lát, ezért a cím mostantól konkrétan jelzi ezt.
- A tűzfal puzzle korábban generikus szöveget adott; most konkrét múzeumi helyzeteket és portkombinációkat mutat, ami jobban illik a történethez.

### Következő lépések
- Ha a jövőben más feladattípusnál is kerülne be manuális reset gomb, gondoljuk át, hogy a komponens logikája önmagában biztosítja-e a visszavonást.
- Ha új feladattípus kerül a rendszerbe, vegyük fel a `TASK_LABELS` objektumba, hogy a cím továbbra is lokalizált legyen.
- Készítsünk dedikált firewall renderert, ahol a játékos kapcsolókkal állíthatja a szabályokat (a payload már tartalmaz minden szükséges adatot).

