import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { calculateTaskScore, calculateLevelScore, getRank, checkAchievements, generateLevelCompletionFeedback } from '../utils/scoring'

const ScoringContext = createContext()

export const useScoring = () => {
  const context = useContext(ScoringContext)
  if (!context) {
    throw new Error('useScoring must be used within a ScoringProvider')
  }
  return context
}

export const ScoringProvider = ({ children }) => {
  const { user, isAuthenticated, loadScoringData: authLoadScoringData, saveScoringData: authSaveScoringData } = useAuth()
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentRank, setCurrentRank] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [levelStats, setLevelStats] = useState({}) // { level: { points, errors, timeSpent, completed } }
  const [perfectStreak, setPerfectStreak] = useState(0)
  const [showPointAnimation, setShowPointAnimation] = useState(null) // { points: number } | null
  const [showRankBadge, setShowRankBadge] = useState(null) // { rank: object } | null
  const [showLevelCompletion, setShowLevelCompletion] = useState(null) // { levelName: string, rank: object, totalPoints: number } | null
  
  // Betöltés Firebase-ből (csak bejelentkezés után)
  useEffect(() => {
    if (isAuthenticated && user) {
      loadScoringData()
    } else {
      // Bejelentkezés nélkül ne inicializáljon scoring-ot
      setTotalPoints(0)
      setCurrentRank(null)
      setAchievements([])
      setLevelStats({})
      setPerfectStreak(0)
    }
  }, [isAuthenticated, user])

  // Automatikus mentés, amikor változnak az adatok (debounce-zva)
  useEffect(() => {
    if (!isAuthenticated || !user) {
      return
    }
    
    // Debounce - ne mentse túl gyakran
    const timeoutId = setTimeout(() => {
      const highestLevel = Object.keys(levelStats).length > 0 
        ? Math.max(...Object.keys(levelStats).map(Number))
        : 1
      
      saveScoringData({
        totalPoints,
        achievements,
        levelStats,
        perfectStreak,
        highestLevel
      })
    }, 2000) // 2 másodperc késleltetés
    
    return () => clearTimeout(timeoutId)
  }, [totalPoints, achievements, levelStats, perfectStreak, isAuthenticated, user])

  const loadScoringData = async () => {
    if (!isAuthenticated || !user) {
      return
    }
    
    try {
      const data = await authLoadScoringData()
      if (data) {
        let pointsToUse = 0 // Alapértelmezett
        
        if (data.totalPoints !== undefined && data.totalPoints !== null) {
          // Ha van totalPoints, használjuk azt
          pointsToUse = data.totalPoints
        } else if (data.levelStats && Object.keys(data.levelStats).length > 0) {
          // Ha nincs totalPoints, de van levelStats, számoljuk ki
          // 0-ról indulunk, majd hozzáadjuk a pályák pontszámait
          pointsToUse = Object.values(data.levelStats).reduce((sum, stat) => {
            return sum + (stat.points || 0)
          }, 0)
        }
        
        setTotalPoints(pointsToUse)
        setAchievements(data.achievements || [])
        setLevelStats(data.levelStats || {})
        setPerfectStreak(data.perfectStreak || 0)
        updateRank(pointsToUse, data.highestLevel || 1, true) // skipAnimation: true betöltéskor
      } else {
        // Ha nincs mentett adat, kezdjünk 0 ponttal
        setTotalPoints(0)
        updateRank(0, 1, true)
      }
    } catch (e) {
      console.warn('Nem sikerült betölteni a pontozást:', e)
      // Hiba esetén is inicializáljuk az alapértelmezett értékekkel
      setTotalPoints(0)
      updateRank(0, 1, true)
    }
  }
  
  const saveScoringData = async (data) => {
    if (!isAuthenticated || !user) {
      return
    }
    
    try {
      await authSaveScoringData(data)
    } catch (e) {
      console.warn('Nem sikerült menteni a pontozást:', e)
    }
  }
  
  const updateRank = (points, level, skipAnimation = false) => {
    const newRank = getRank(points, level)
    
    // Rank badge animáció kikapcsolva
    // if (!skipAnimation && currentRank && currentRank.id && currentRank.id !== newRank.id) {
    //   // Új rang! Animáció triggerelése
    //   setShowRankBadge({ rank: newRank })
    // }
    
    setCurrentRank(newRank)
    return newRank
  }
  
  /**
   * Feladat pontozása
   */
  const scoreTask = ({ difficulty, isCorrect, level, timeSpent = null }) => {
    // Csak bejelentkezés után működik
    if (!isAuthenticated || !user) {
      return {
        points: 0,
        feedback: '',
        isCorrect
      }
    }
    
    // Ne ellenőrizzük a pálya teljesítését - a feladatok pontozása még akkor is történhet,
    // ha a pálya már teljesítve van (újrajátszás esetén)
    
    const result = calculateTaskScore({ difficulty, isCorrect, level, timeSpent })
    
    // Animáció triggerelése (helyes és helytelen válasz esetén is)
    setShowPointAnimation({ points: result.points })
    
    if (isCorrect) {
      setTotalPoints(prev => {
        const newTotal = prev + result.points
        updateRank(newTotal, level)
        return newTotal
      })
    } else {
      setTotalPoints(prev => {
        const newTotal = Math.max(0, prev + result.points) // Nem mehet negatívba
        updateRank(newTotal, level)
        return newTotal
      })
    }
    
    return result
  }
  
  /**
   * Pálya befejezési pontozás
   */
  const scoreLevel = ({ level, totalTasks, completedTasks, errors, timeSpent, allCluesCorrect }) => {
    // Csak bejelentkezés után működik
    if (!isAuthenticated || !user) {
      return {
        totalPoints: 0,
        bonuses: [],
        taskPoints: 0,
        errorPenalty: 0,
        levelBonus: 0,
        rank: null,
        feedback: 'Bejelentkezés szükséges a pontozáshoz.',
        newAchievements: []
      }
    }
    
    // Ellenőrizzük, hogy a pálya már teljesítve van-e
    const existingLevelStat = levelStats[level]
    if (existingLevelStat && existingLevelStat.completed) {
      // Ha a pálya már teljesítve van, ne pontozzuk újra
      // De mégis mutassuk az összegző animációt (csak pontszám változás nélkül)
      const rank = updateRank(totalPoints, level)
      const levelNames = {
        1: 'A Titkosított Adatcsomag',
        2: 'A Hamisított Archívum',
        3: 'A Kézbesítetlen Üzenet',
        4: 'A Hiányzó Idővonal',
        5: 'A Rejtett Metaadat',
        6: 'A Szivárgó Port',
        7: 'A Kettős Identitás',
        8: 'A Törött Kulcs',
        9: 'A Megszakított Átvitel',
        10: 'A Phantom‑Profil',
        11: 'A Lopott Árnyékfiók',
        12: 'A Főkolompos'
      }
      
      setShowLevelCompletion({
        levelName: levelNames[level] || `Ügy #${level}`,
        rank,
        totalPoints: totalPoints
      })
      
      return {
        totalPoints: 0,
        bonuses: [],
        taskPoints: 0,
        errorPenalty: 0,
        levelBonus: 0,
        rank,
        feedback: 'Pálya újrajátszva - pontszám nem változott.',
        newAchievements: []
      }
    }
    
    const result = calculateLevelScore({
      level,
      totalTasks,
      completedTasks,
      errors,
      timeSpent,
      allCluesCorrect
    })
    
    const newTotal = totalPoints + result.totalPoints
    setTotalPoints(newTotal)
    
    // Pálya statisztikák mentése
    const levelStat = {
      points: result.totalPoints,
      errors,
      timeSpent,
      completed: true,
      bonuses: result.bonuses
    }
    
    setLevelStats(prev => ({
      ...prev,
      [level]: levelStat
    }))
    
    // Hibátlan sorozat frissítése
    if (errors === 0) {
      setPerfectStreak(prev => prev + 1)
    } else {
      setPerfectStreak(0)
    }
    
    // Achievement ellenőrzés
    const stats = {
      totalPoints: newTotal,
      currentLevelErrors: errors,
      currentLevelCompleted: true,
      currentLevelTimeSpent: timeSpent,
      allCluesCorrect,
      perfectStreak: errors === 0 ? perfectStreak + 1 : 0,
      highestLevel: level
    }
    
    const newAchievements = checkAchievements(stats)
    
    // Frissített értékek kiszámítása a mentéshez
    const updatedLevelStats = {
      ...levelStats,
      [level]: levelStat
    }
    const updatedPerfectStreak = errors === 0 ? perfectStreak + 1 : 0
    const updatedAchievements = newAchievements.length > 0
      ? (() => {
          const existing = achievements.map(a => a.id)
          const unique = newAchievements.filter(a => !existing.includes(a.id))
          return [...achievements, ...unique]
        })()
      : achievements
    
    // State frissítések
    if (newAchievements.length > 0) {
      setAchievements(prev => {
        const existing = prev.map(a => a.id)
        const unique = newAchievements.filter(a => !existing.includes(a.id))
        return [...prev, ...unique]
      })
    }
    
    // Rang frissítése
    const rank = updateRank(newTotal, level)
    
    // Pálya neve meghatározása
    const levelNames = {
      1: 'A Titkosított Adatcsomag',
      2: 'A Hamisított Archívum',
      3: 'A Kézbesítetlen Üzenet',
      4: 'A Hiányzó Idővonal',
      5: 'A Rejtett Metaadat',
      6: 'A Szivárgó Port',
      7: 'A Kettős Identitás',
      8: 'A Törött Kulcs',
      9: 'A Megszakított Átvitel',
      10: 'A Phantom‑Profil',
      11: 'A Lopott Árnyékfiók',
      12: 'A Főkolompos'
    }
    
    // Összegző animáció triggerelése
    setShowLevelCompletion({
      levelName: levelNames[level] || `Ügy #${level}`,
      rank,
      totalPoints: newTotal
    })
    
    // Mentés - frissített értékekkel
    const dataToSave = {
      totalPoints: newTotal,
      achievements: updatedAchievements,
      levelStats: updatedLevelStats,
      perfectStreak: updatedPerfectStreak,
      highestLevel: level
    }
    saveScoringData(dataToSave)
    
    // Visszajelzés generálása
    const feedback = generateLevelCompletionFeedback({
      totalPoints: newTotal,
      rank,
      bonuses: result.bonuses,
      nextLevel: level < 12 ? level + 1 : null
    })
    
    return {
      ...result,
      totalPoints: newTotal,
      rank,
      feedback,
      newAchievements
    }
  }
  
  /**
   * Pálya statisztikák lekérése
   */
  const getLevelStats = (level) => {
    return levelStats[level] || null
  }
  
  /**
   * Összesített statisztikák
   */
  const getStats = () => {
    const completedLevels = Object.keys(levelStats).length
    const totalErrors = Object.values(levelStats).reduce((sum, stat) => sum + (stat.errors || 0), 0)
    const totalTime = Object.values(levelStats).reduce((sum, stat) => sum + (stat.timeSpent || 0), 0)
    
    return {
      totalPoints,
      currentRank,
      achievements,
      completedLevels,
      totalErrors,
      totalTime,
      perfectStreak
    }
  }
  
  return (
    <ScoringContext.Provider
      value={{
        totalPoints,
        currentRank,
        achievements,
        perfectStreak,
        scoreTask,
        scoreLevel,
        getLevelStats,
        getStats,
        showPointAnimation,
        setShowPointAnimation,
        showRankBadge,
        setShowRankBadge,
        showLevelCompletion,
        setShowLevelCompletion
      }}
    >
      {children}
    </ScoringContext.Provider>
  )
}

