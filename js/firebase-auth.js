// Firebase Auth + Firestore – egyszerű, kezdőbarát integráció
// Használat:
// - Regisztráció: űrlap mezők + "Regisztráció" gomb
// - Bejelentkezés: űrlap mezők + "Bejelentkezés" gomb
// - Kijelentkezés: "Kijelentkezés" gomb
// - Pálya mentése: window.CMAuth.saveLevelCompletion('palya-azonosito')

// Firebase SDK importok (CDN, npm nélkül)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Projekt konfiguráció (a felhasználó által megadott adatokkal)
const firebaseConfig = {
  apiKey: "AIzaSyBTWS3GAmBjYOJB9FO6TvLKZKKg8HgqhAs",
  authDomain: "game-cdd1d.firebaseapp.com",
  projectId: "game-cdd1d",
  storageBucket: "game-cdd1d.firebasestorage.app",
  messagingSenderId: "482306235908",
  appId: "1:482306235908:web:0db066468f868ccbd61f51"
};

// Inicializálás (egyszer)
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.warn("Firebase már inicializálva lehet:", e?.message || e);
}
const auth = getAuth();
const db = getFirestore();

function qs(id) {
  return document.getElementById(id);
}

function setDisabled(el, disabled) {
  if (!el) return;
  el.setAttribute("aria-disabled", disabled ? "true" : "false");
  el.disabled = !!disabled;
}

function updateAuthStatus(user) {
  const statusEl = qs("cm-auth-status");
  const logoutBtn = qs("cm-logout");
  const form = qs("cm-auth-form");
  if (!statusEl) return;
  if (user && user.emailVerified) {
    statusEl.textContent = `Bejelentkezve: ${user.email}`;
    if (logoutBtn) logoutBtn.style.display = "";
    if (form) form.style.opacity = "0.5";
  } else if (user && !user.emailVerified) {
    statusEl.textContent = `E-mail megerősítés szükséges: ${user.email}`;
    if (logoutBtn) logoutBtn.style.display = "";
    if (form) form.style.opacity = "1";
  } else {
    statusEl.textContent = "Nem vagy bejelentkezve";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (form) form.style.opacity = "1";
  }
}

async function registerWithEmail(email, password) {
  try {
    if (!email || !password) {
      alert("Adj meg e-mail címet és jelszót.");
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    console.log("Regisztráció sikeres, megerősítő e-mail elküldve.");
    alert("Sikeres regisztráció! Küldtünk egy megerősítő e-mailt. Ellenőrizd a postaládádat.");
    await signOut(auth);
  } catch (e) {
    console.error("Regisztráció hiba:", e);
    alert(`Regisztráció sikertelen: ${e?.message || e}`);
  }
}

async function loginWithEmail(email, password) {
  try {
    if (!email || !password) {
      alert("Adj meg e-mail címet és jelszót.");
      return;
    }
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      try {
        await sendEmailVerification(cred.user);
      } catch (_) {
        // ha nem sikerül újraküldeni, nem végzetes
      }
      alert("Még nem erősítetted meg az e-mail címed. Küldtünk megerősítő linket. Jelentkezz be újra a megerősítés után.");
      await signOut(auth);
      return;
    }
    console.log("Sikeres bejelentkezés:", cred.user.email);
    alert("Sikeres bejelentkezés!");
  } catch (e) {
    console.error("Bejelentkezés hiba:", e);
    alert(`Bejelentkezés sikertelen: ${e?.message || e}`);
  }
}

async function logout() {
  try {
    await signOut(auth);
    alert("Kijelentkeztél.");
  } catch (e) {
    console.error("Kijelentkezés hiba:", e);
    alert(`Kijelentkezés sikertelen: ${e?.message || e}`);
  }
}

// Pálya teljesítés mentése Firestore-ba
// users/{uid}/completions/{levelId} -> { levelId, completedAt }
async function saveLevelCompletion(levelId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Előbb jelentkezz be a mentéshez.");
      return;
    }
    if (!user.emailVerified) {
      alert("Csak megerősített e-maillel lehet menteni. Ellenőrizd a postaládád.");
      return;
    }
    if (!levelId) {
      alert("Hiányzik a pálya azonosító (levelId).");
      return;
    }
    const ref = doc(db, "users", user.uid, "completions", String(levelId));
    await setDoc(ref, { levelId: String(levelId), completedAt: serverTimestamp() }, { merge: true });
    console.log("Pálya mentve:", levelId);
    alert(`Pálya mentve: ${levelId}`);
  } catch (e) {
    console.error("Mentés hiba:", e);
    alert(`Mentés sikertelen: ${e?.message || e}`);
  }
}

// Globális objektum, hogy a játék más JS-eiből is hívható legyen:
window.CMAuth = {
  registerWithEmail,
  loginWithEmail,
  logout,
  saveLevelCompletion
};

// UI eseménykezelők – csak akkor futnak, ha a megfelelő elemek léteznek
function bindUI() {
  const emailEl = qs("cm-email");
  const passEl = qs("cm-pass");
  const regBtn = qs("cm-register");
  const loginBtn = qs("cm-login");
  const logoutBtn = qs("cm-logout");
  const saveTestBtn = qs("cm-save-test");

  if (regBtn) {
    regBtn.addEventListener("click", (e) => {
      e.preventDefault();
      registerWithEmail(emailEl?.value?.trim(), passEl?.value?.trim());
    });
  }
  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginWithEmail(emailEl?.value?.trim(), passEl?.value?.trim());
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await logout();
    });
  }
  if (saveTestBtn) {
    saveTestBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = prompt("Add meg a pálya azonosítót (pl. ugy1-level1):");
      if (id) await saveLevelCompletion(id);
    });
  }
}

onAuthStateChanged(auth, (user) => {
  updateAuthStatus(user);
  // Gombok engedélyezése/tiltása
  const saveBtn = qs("cm-save-test");
  setDisabled(saveBtn, !(user && user.emailVerified));
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindUI);
} else {
  bindUI();
}



