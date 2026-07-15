import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { calculateTaskScore, calculateLevelScore, getRank, checkAchievements, generateLevelCompletionFeedback } from '../utils/scoring'
import { logger } from '../utils/logger'

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
      return null
    }
    
    try {
      const data = await authLoadScoringData()
      logger.info('Scoring adatok betöltése:', data)
      if (data) {
        let pointsToUse = 0 // Alapértelmezett
        
        // Számoljuk ki a levelStats-ból
        let calculatedFromLevelStats = 0
        if (data.levelStats && Object.keys(data.levelStats).length > 0) {
          calculatedFromLevelStats = Object.values(data.levelStats).reduce((sum, stat) => {
            return sum + (stat.points || 0)
          }, 0)
          logger.info('levelStats-ból számolt pontok:', calculatedFromLevelStats, data.levelStats)
        }
        
        // Használjuk a nagyobb értéket: totalPoints vagy levelStats-ból számolt
        // Ez biztosítja, hogy ha a totalPoints tartalmazza a korábbi pontokat, azok ne vesznek el
        if (data.totalPoints !== undefined && data.totalPoints !== null) {
          pointsToUse = Math.max(data.totalPoints, calculatedFromLevelStats)
          logger.info('totalPoints:', data.totalPoints, 'levelStats-ból:', calculatedFromLevelStats, 'használt:', pointsToUse)
        } else {
          pointsToUse = calculatedFromLevelStats
          logger.info('Nincs totalPoints, levelStats-ból számolt pontok használata:', pointsToUse)
        }
        
        setTotalPoints(pointsToUse)
        setAchievements(data.achievements || [])
        setLevelStats(data.levelStats || {})
        setPerfectStreak(data.perfectStreak || 0)
        const highestLevel = data.highestLevel || (data.levelStats && Object.keys(data.levelStats).length > 0 
          ? Math.max(...Object.keys(data.levelStats).map(Number))
          : 1) || 1
        logger.info('Rang frissítése:', pointsToUse, highestLevel)
        updateRank(pointsToUse, highestLevel, true) // skipAnimation: true betöltéskor
        
        // Visszaadjuk az adatokat, hogy közvetlenül használhassuk
        return {
          totalPoints: pointsToUse,
          levelStats: data.levelStats || {},
          highestLevel
        }
      } else {
        // Ha nincs mentett adat, kezdjünk 0 ponttal
        logger.info('Nincs mentett adat, 0 ponttal kezdünk')
        setTotalPoints(0)
        updateRank(0, 1, true)
        return {
          totalPoints: 0,
          levelStats: {},
          highestLevel: 1
        }
      }
    } catch (e) {
      logger.warn('Nem sikerült betölteni a pontozást:', e)
      // Hiba esetén is inicializáljuk az alapértelmezett értékekkel
      setTotalPoints(0)
      updateRank(0, 1, true)
      return {
        totalPoints: 0,
        levelStats: {},
        highestLevel: 1
      }
    }
  }
  
  const saveScoringData = async (data) => {
    if (!isAuthenticated || !user) {
      return
    }
    
    try {
      await authSaveScoringData(data)
    } catch (e) {
      logger.warn('Nem sikerült menteni a pontozást:', e)
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
    
    // Ellenőrizzük, hogy a pálya már teljesítve van-e
    // Ha újrajátszás, ne adjunk pontokat
    const existingLevelStat = levelStats[level]
    if (existingLevelStat && existingLevelStat.completed) {
      return {
        points: 0,
        feedback: '',
        isCorrect
      }
    }
    
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
  const scoreLevel = async ({ level, totalTasks, completedTasks, errors, timeSpent, allCluesCorrect }) => {
    // Csak bejelentkezés után működik
    if (!isAuthenticated || !user) {
      return {
        totalPoints: 0,
        bonuses: [],
        taskPoints: 0,
        errorPenalty: 0,
        levelBonus: 0,
        rank: null,
        feedback: 'Sign in to earn points.',
        newAchievements: []
      }
    }
    
    // Mindig újratöltjük az adatokat, hogy biztosan a legfrissebb adatokkal dolgozzunk
    // Ez biztosítja, hogy az előző ügyek pontszámai is benne legyenek
    const loadedData = await loadScoringData()
    
    // Használjuk a betöltött adatokat közvetlenül
    let currentTotalPoints = loadedData?.totalPoints || totalPoints
    const currentLevelStats = loadedData?.levelStats || levelStats
    
    // Szinkronizáljuk a totalPoints-ot a levelStats alapján, ha szükséges
    if (currentLevelStats && Object.keys(currentLevelStats).length > 0) {
      const calculatedTotal = Object.values(currentLevelStats).reduce((sum, stat) => {
        return sum + (stat.points || 0)
      }, 0)
      // Ha a számított összeg nagyobb, mint a jelenlegi totalPoints, akkor használjuk azt
      if (calculatedTotal > currentTotalPoints) {
        currentTotalPoints = calculatedTotal
        setTotalPoints(calculatedTotal)
      }
    }
    
    // Ellenőrizzük, hogy a pálya már teljesítve van-e
    const existingLevelStat = currentLevelStats[level]
    if (existingLevelStat && existingLevelStat.completed) {
      // Ha a pálya már teljesítve van, ne pontozzuk újra
      // De mégis mutassuk az összegző animációt (csak pontszám változás nélkül)
      // Szinkronizáljuk a totalPoints-ot, ha szükséges
      let displayTotalPoints = currentTotalPoints
      if (currentLevelStats && Object.keys(currentLevelStats).length > 0) {
        const calculatedTotal = Object.values(currentLevelStats).reduce((sum, stat) => {
          return sum + (stat.points || 0)
        }, 0)
        // Ha a számított összeg nagyobb, mint a jelenlegi totalPoints, akkor használjuk azt
        if (calculatedTotal > displayTotalPoints) {
          displayTotalPoints = calculatedTotal
          setTotalPoints(calculatedTotal)
        }
      }
      const rank = updateRank(displayTotalPoints, level)
      const levelNames = {
        1: 'The Encrypted Data Packet',
        2: 'The Forged Archive',
        3: 'The Undelivered Message',
        4: 'The Missing Timeline',
        5: 'The Hidden Metadata',
        6: 'The Leaking Port',
        7: 'The Double Identity',
        8: 'The Broken Key',
        9: 'The Interrupted Transfer',
        10: 'The Phantom Profile',
        11: 'The Stolen Shadow Account',
        12: 'The Mastermind'
      }
      
      setShowLevelCompletion({
        levelName: levelNames[level] || `Case #${level}`,
        rank,
        totalPoints: displayTotalPoints
      })
      
      return {
        totalPoints: 0,
        bonuses: [],
        taskPoints: 0,
        errorPenalty: 0,
        levelBonus: 0,
        rank,
        feedback: 'Level replayed — score unchanged.',
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
    
    const newTotal = currentTotalPoints + result.totalPoints
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
      ...currentLevelStats,
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
      1: 'The Encrypted Data Packet',
      2: 'The Forged Archive',
      3: 'The Undelivered Message',
      4: 'The Missing Timeline',
      5: 'The Hidden Metadata',
      6: 'The Leaking Port',
      7: 'The Double Identity',
      8: 'The Broken Key',
      9: 'The Interrupted Transfer',
      10: 'The Phantom Profile',
      11: 'The Stolen Shadow Account',
      12: 'The Mastermind'
    }
    
    // Összegző animáció triggerelése
    setShowLevelCompletion({
      levelName: levelNames[level] || `Case #${level}`,
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

