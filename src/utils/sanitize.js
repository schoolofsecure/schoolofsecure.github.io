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
  if (!error) return 'Unknown error'
  
  // Ha van error.code (Firebase error), használjuk azt
  if (error.code) {
    // Firebase error code-ok biztonságosak, nem tartalmaznak érzékeny adatokat
    const codeMessages = {
      'auth/email-already-in-use': 'This email address is already in use.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
      'auth/user-not-found': 'No account is registered with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/requires-recent-login': 'For security reasons, you need to sign in again.',
      'auth/network-request-failed': 'Network error. Check your internet connection.',
      'permission-denied': 'You do not have permission for this action.',
      'unavailable': 'The service is currently unavailable. Please try again later.'
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
  return 'Something went wrong. Please try again later.'
}

export default { sanitizeString, sanitizeErrorMessage }
