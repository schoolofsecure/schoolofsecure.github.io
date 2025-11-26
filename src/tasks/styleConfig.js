/**
 * Stílus- és szabályrendszer a dinamikus pályageneráláshoz.
 * 
 * Ez a modul határozza meg, hogy a 2. pályától kezdve hogyan generálódnak
 * a feladatok, hogy illeszkedjenek az 1. pálya hangulatához és struktúrájához.
 */
export const styleConfig = {
  /** 1) Feladattípus-eloszlás (összesen 100%) */
  taskDistribution: {
    CAESAR: 0.08,
    VIGENERE: 0.06,
    XOR: 0.04,
    HASH_MISMATCH: 0.05,
    ICON_MEMORY: 0.05,
    PASSWORD_STRENGTH: 0.04,
    PHISHING: 0.07,
    URL_TRUST: 0.05,
    LOG_ANALYSIS: 0.07,
    SOCIAL_ENGINEERING: 0.05,
    FIREWALL: 0.04,
    MISCONFIG: 0.04,
    RISKY_PERMISSION: 0.03,
    SECURITY_DECISION: 0.04,
    CRYPTO_PUZZLE: 0.04,
    PSEUDOCODE_BUG: 0.04,
    NETWORK_ANOMALY: 0.05,
    EMAIL_HEADER: 0.04,
    ATTACK_SCENARIO: 0.04,
    ZERO_DAY: 0.03
  },

  /** 2) Nehézség-eloszlás pályaszám szerint */
  difficultyByLevel: {
    default: { easy: 0.6, medium: 0.35, hard: 0.05 },
    2: { easy: 0.55, medium: 0.35, hard: 0.10 },
    3: { easy: 0.45, medium: 0.45, hard: 0.10 },
    4: { easy: 0.30, medium: 0.55, hard: 0.15 },
    5: { easy: 0.25, medium: 0.55, hard: 0.20 },
    6: { easy: 0.20, medium: 0.50, hard: 0.30 },
    7: { easy: 0.15, medium: 0.45, hard: 0.40 },
    8: { easy: 0.10, medium: 0.40, hard: 0.50 }
  },

  /** 3) Feladat-komplexitás paraméterek (kimenet: LevelGenerator → TaskFactory) */
  complexity: {
    easy: {
      textLength: { min: 50, max: 150 },
      iconCount: 3,
      logRows: 6,
      cryptoSteps: 1
    },
    medium: {
      textLength: { min: 120, max: 220 },
      iconCount: 4,
      logRows: 10,
      cryptoSteps: 2
    },
    hard: {
      textLength: { min: 200, max: 350 },
      iconCount: 5,
      logRows: 14,
      cryptoSteps: 3
    }
  },

  /** 4) Sorrend / rotáció (ritmus az 1. pályához hasonlóan) */
  sequencing: [
    { slot: 1, preferredTypes: ['CAESAR', 'VIGENERE', 'XOR'] },           // nyitó puzzle
    { slot: 2, preferredTypes: ['LOG_ANALYSIS', 'HASH_MISMATCH'] },       // bizonyíték / log
    { slot: 3, preferredTypes: ['PHISHING', 'URL_TRUST', 'EMAIL_HEADER'] }, // kommunikáció
    { slot: 4, preferredTypes: ['ICON_MEMORY', 'NETWORK_ANOMALY', 'CRYPTO_PUZZLE'] },
    { slot: 5, preferredTypes: ['SECURITY_DECISION', 'MISCONFIG', 'FIREWALL', 'RISKY_PERMISSION'] }
  ],

  /** 5) Szövegstílus és visszajelzés */
  textStyle: {
    tone: 'neo-noir detective',
    narrationLength: {
      intro: 150,
      taskDescription: 120,
      hint: 80
    },
    voice: {
      narrator: 'formális, sejtelmes',
      hint: 'tanácsadó, barátságos'
    },
    feedback: {
      success: 'Pozitív, rövid megerősítés ("Nyom megerősítve").',
      failure: 'Instruktív ("Valami nem stimmel, figyeld a ...").'
    }
  },

  /** 6) Extra interakció / UI jelzés */
  interactions: {
    icons: {
      success: '✅',
      failure: '⚠️',
      lives: '🕵️' // kompatibilis az 1. pálya élet HUD-jával
    },
    animationHints: {
      puzzleReveal: 'fading spotlight',
      logScroll: 'glitch scroll',
      memoryGrid: 'soft pulse'
    }
  },

  /** 7) Randomizálási szabályok feladattípusonként */
  randomRules: {
    CAESAR: { shifts: { easy: [1, 5], medium: [6, 15], hard: [16, 25] }, plaintextBank: 10 },
    VIGENERE: { keyLengths: { easy: [3, 4], medium: [5, 6], hard: [7, 10] } },
    XOR: { keyBytes: { easy: 1, medium: 2, hard: 4 }, outputFormat: 'hex' },
    HASH_MISMATCH: { algorithms: { easy: ['md5'], medium: ['md5', 'sha1'], hard: ['md5', 'sha1', 'sha256'] } },
    ICON_MEMORY: { pairs: { easy: 3, medium: 4, hard: 5 } },
    PASSWORD_STRENGTH: { rulesPerDifficulty: { easy: 2, medium: 4, hard: 6 } },
    PHISHING: { suspiciousElements: { easy: 3, medium: 4, hard: 5 } },
    URL_TRUST: { spoofIntensity: { easy: 'obvious', medium: 'domain trick', hard: 'punycode/subdomain' } },
    LOG_ANALYSIS: { rows: { easy: 8, medium: 12, hard: 16 }, anomalies: { easy: 1, medium: 2, hard: 3 } },
    SOCIAL_ENGINEERING: { scenarios: { easy: 1, medium: 2, hard: 3 } },
    FIREWALL: { rules: { easy: 3, medium: 5, hard: 7 } },
    MISCONFIG: { decoyLines: { easy: 0, medium: 1, hard: 2 } },
    RISKY_PERMISSION: { permissionsShown: { easy: 3, medium: 4, hard: 5 } },
    SECURITY_DECISION: { questions: { easy: 1, medium: 2, hard: 3 } },
    CRYPTO_PUZZLE: { steps: { easy: ['base64'], medium: ['base64', 'xor'], hard: ['base64', 'xor', 'hash'] } },
    PSEUDOCODE_BUG: { snippetCount: { easy: 1, medium: 2, hard: 3 } },
    NETWORK_ANOMALY: { flows: { easy: 5, medium: 8, hard: 10 } },
    EMAIL_HEADER: { anomalies: { easy: 1, medium: 2, hard: 3 } },
    ATTACK_SCENARIO: { questionCount: { easy: 1, medium: 2, hard: 3 } },
    ZERO_DAY: { events: { easy: 2, medium: 3, hard: 4 } }
  }
}

