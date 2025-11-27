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
  const { user, isAuthenticated } = useAuth()
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentRank, setCurrentRank] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [levelStats, setLevelStats] = useState({}) // { level: { points, errors, timeSpent, completed } }
  const [perfectStreak, setPerfectStreak] = useState(0)
  
  // Betöltés Firebase-ből (ha be van jelentkezve)
  useEffect(() => {
    if (isAuthenticated && user) {
      loadScoringData()
    } else {
      // Ha nincs bejelentkezve, localStorage-ból (ha van)
      const saved = localStorage.getItem('cyber_scoring')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setTotalPoints(data.totalPoints || 0)
          setAchievements(data.achievements || [])
          setLevelStats(data.levelStats || {})
          setPerfectStreak(data.perfectStreak || 0)
          updateRank(data.totalPoints || 0, data.highestLevel || 1)
        } catch (e) {
          console.warn('Nem sikerült betölteni a pontozást:', e)
        }
      }
    }
  }, [isAuthenticated, user])
  
  const loadScoringData = async () => {
    // TODO: Firebase-ből betöltés
    // Most localStorage-ból
    const saved = localStorage.getItem(`cyber_scoring_${user?.uid}`)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setTotalPoints(data.totalPoints || 0)
        setAchievements(data.achievements || [])
        setLevelStats(data.levelStats || {})
        setPerfectStreak(data.perfectStreak || 0)
        updateRank(data.totalPoints || 0, data.highestLevel || 1)
      } catch (e) {
        console.warn('Nem sikerült betölteni a pontozást:', e)
      }
    }
  }
  
  const saveScoringData = async (data) => {
    if (isAuthenticated && user) {
      // TODO: Firebase-be mentés
      localStorage.setItem(`cyber_scoring_${user.uid}`, JSON.stringify(data))
    } else {
      localStorage.setItem('cyber_scoring', JSON.stringify(data))
    }
  }
  
  const updateRank = (points, level) => {
    const rank = getRank(points, level)
    setCurrentRank(rank)
    return rank
  }
  
  /**
   * Feladat pontozása
   */
  const scoreTask = ({ difficulty, isCorrect, level, timeSpent = null }) => {
    const result = calculateTaskScore({ difficulty, isCorrect, level, timeSpent })
    
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
    if (newAchievements.length > 0) {
      setAchievements(prev => {
        const existing = prev.map(a => a.id)
        const unique = newAchievements.filter(a => !existing.includes(a.id))
        return [...prev, ...unique]
      })
    }
    
    // Rang frissítése
    const rank = updateRank(newTotal, level)
    
    // Mentés
    const dataToSave = {
      totalPoints: newTotal,
      achievements: [...achievements, ...newAchievements],
      levelStats: { ...levelStats, [level]: levelStat },
      perfectStreak: errors === 0 ? perfectStreak + 1 : 0,
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
        getStats
      }}
    >
      {children}
    </ScoringContext.Provider>
  )
}

