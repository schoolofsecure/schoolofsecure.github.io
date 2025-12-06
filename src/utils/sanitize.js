/**
 * Utility függvények érzékeny adatok eltávolításához
 */

/**
 * Eltávolítja az érzékeny adatokat egy stringből
 */
export const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return str
  
  return str
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REMOVED]')
    .replace(/uid[:\s=]+[a-zA-Z0-9]{20,}/gi, 'uid=[UID_REMOVED]')
    .replace(/token[:\s=]+[a-zA-Z0-9]{20,}/gi, 'token=[TOKEN_REMOVED]')
    .replace(/password[:\s=]+[^\s,}]+/gi, 'password=[PASSWORD_REMOVED]')
    .replace(/[a-zA-Z0-9]{32,}/g, (match) => {
      // Ha hosszú alfanumerikus string (lehet token vagy hash), eltávolítjuk
      if (match.length > 40) return '[TOKEN_REMOVED]'
      return match
    })
}

/**
 * Sanitizálja az error.message-t, hogy ne tartalmazzon érzékeny adatokat
 */
export const sanitizeErrorMessage = (error) => {
  if (!error) return 'Ismeretlen hiba'
  
  // Ha van error.code (Firebase error), használjuk azt
  if (error.code) {
    // Firebase error code-ok biztonságosak, nem tartalmaznak érzékeny adatokat
    const codeMessages = {
      'auth/email-already-in-use': 'Ez az e-mail cím már használatban van.',
      'auth/invalid-email': 'Érvénytelen e-mail cím.',
      'auth/weak-password': 'A jelszó túl gyenge. Használj legalább 6 karaktert.',
      'auth/user-not-found': 'Ezzel az e-mail címmel nincs regisztrált fiók.',
      'auth/wrong-password': 'Hibás jelszó.',
      'auth/requires-recent-login': 'Biztonsági okokból újra be kell jelentkezned.',
      'auth/network-request-failed': 'Hálózati hiba. Ellenőrizd az internetkapcsolatod.',
      'permission-denied': 'Nincs jogosultságod ehhez a művelethez.',
      'unavailable': 'A szolgáltatás jelenleg nem elérhető. Próbáld újra később.'
    }
    
    if (codeMessages[error.code]) {
      return codeMessages[error.code]
    }
  }
  
  // Ha van error.message, sanitizáljuk
  if (error.message) {
    const sanitized = sanitizeString(error.message)
    // Ha a sanitizálás után üres vagy csak placeholder-ek maradtak, generikus üzenetet adunk
    if (sanitized === error.message || sanitized.length > 10) {
      return sanitized
    }
  }
  
  // Alapértelmezett üzenet
  return 'Hiba történt. Próbáld újra később.'
}

export default { sanitizeString, sanitizeErrorMessage }

