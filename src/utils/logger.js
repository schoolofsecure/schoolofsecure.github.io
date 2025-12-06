/**
 * Logger utility - production-ben nem ír console.log-okat
 * Érzékeny adatokat (email, user ID, password, token) soha nem logol
 */

const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD

/**
 * Sanitizálja az error objektumot, hogy ne tartalmazzon érzékeny adatokat
 */
const sanitizeError = (error) => {
  if (!error) return error
  
  // Ha string, ellenőrizzük, hogy nem tartalmaz-e érzékeny adatokat
  if (typeof error === 'string') {
    // Eltávolítjuk az email címeket, user ID-kat, tokeneket
    return error
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REMOVED]')
      .replace(/[a-zA-Z0-9]{20,}/g, (match) => {
        // Ha hosszú string (lehet token vagy ID), eltávolítjuk
        if (match.length > 30) return '[TOKEN_REMOVED]'
        return match
      })
  }
  
  // Ha error objektum, csak a biztonságos mezőket logoljuk
  if (error instanceof Error) {
    const safeError = {
      name: error.name,
      message: error.message
        ? error.message
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REMOVED]')
            .replace(/uid[:\s=]+[a-zA-Z0-9]{20,}/gi, 'uid=[UID_REMOVED]')
            .replace(/token[:\s=]+[a-zA-Z0-9]{20,}/gi, 'token=[TOKEN_REMOVED]')
            .replace(/password[:\s=]+[^\s,}]+/gi, 'password=[PASSWORD_REMOVED]')
        : undefined,
      code: error.code, // Firebase error code (pl. 'auth/invalid-email') - ez biztonságos
      stack: isDev ? error.stack : undefined // Stack trace csak dev módban
    }
    
    // Eltávolítjuk az undefined mezőket
    Object.keys(safeError).forEach(key => {
      if (safeError[key] === undefined) {
        delete safeError[key]
      }
    })
    
    return safeError
  }
  
  // Egyéb objektumok esetén próbáljuk sanitizálni
  if (typeof error === 'object') {
    try {
      const sanitized = JSON.parse(JSON.stringify(error))
      // Rekurzívan sanitizáljuk
      const sanitizeObject = (obj) => {
        if (!obj || typeof obj !== 'object') return obj
        for (const key in obj) {
          if (key.toLowerCase().includes('email') || 
              key.toLowerCase().includes('password') || 
              key.toLowerCase().includes('token') ||
              key.toLowerCase().includes('uid') ||
              key === 'user') {
            obj[key] = '[REMOVED]'
          } else if (typeof obj[key] === 'string' && obj[key].includes('@')) {
            obj[key] = obj[key].replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REMOVED]')
          } else if (typeof obj[key] === 'object') {
            obj[key] = sanitizeObject(obj[key])
          }
        }
        return obj
      }
      return sanitizeObject(sanitized)
    } catch {
      return '[Object - could not sanitize]'
    }
  }
  
  return error
}

/**
 * Sanitizálja az összes argumentumot
 */
const sanitizeArgs = (args) => {
  return args.map(arg => sanitizeError(arg))
}

export const logger = {
  log: (...args) => {
    if (isDev) {
      console.log(...sanitizeArgs(args))
    }
  },
  
  warn: (...args) => {
    if (isDev) {
      console.warn(...sanitizeArgs(args))
    } else {
      // Production-ben csak fontos figyelmeztetéseket logolunk (már sanitizálva)
      // Jelenleg nincs error tracking service, de itt lehetne hozzáadni
    }
  },
  
  error: (...args) => {
    // Hibákat mindig logoljuk, de sanitizálva
    console.error(...sanitizeArgs(args))
    // Production-ben itt lehetne error tracking service hívás
  },
  
  info: (...args) => {
    if (isDev) {
      console.info(...sanitizeArgs(args))
    }
  },
  
  debug: (...args) => {
    if (isDev) {
      console.debug(...sanitizeArgs(args))
    }
  }
}

export default logger

