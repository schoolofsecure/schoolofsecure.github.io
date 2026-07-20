import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { learningPaths, lessons, getPathProgress } from '../data/learningContent'

const STORAGE_KEY = 'iterali_learning_progress'
const GAME_BEST_KEY = 'iterali_game_session_best'

const LearningProgressContext = createContext(null)

export function useLearningProgress() {
  const ctx = useContext(LearningProgressContext)
  if (!ctx) throw new Error('useLearningProgress must be used within LearningProgressProvider')
  return ctx
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return {
    completedLessons: [],
    lessonStats: {},
    weeklyGoal: 3,
    lessonsThisWeek: 0,
    weekStarted: Date.now(),
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (_) {}
}

export function LearningProgressProvider({ children }) {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const completeLesson = useCallback((lessonId, correct, total) => {
    setState((prev) => {
      const completed = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId]
      return {
        ...prev,
        completedLessons: completed,
        lessonStats: {
          ...prev.lessonStats,
          [lessonId]: { correct, total, completedAt: Date.now() },
        },
        lessonsThisWeek: prev.lessonsThisWeek + (completed.includes(lessonId) && prev.completedLessons.includes(lessonId) ? 0 : 1),
      }
    })
  }, [])

  const getAccuracy = useCallback(() => {
    const stats = Object.values(state.lessonStats)
    if (!stats.length) return null
    const correct = stats.reduce((s, x) => s + (x.correct || 0), 0)
    const total = stats.reduce((s, x) => s + (x.total || 0), 0)
    if (!total) return null
    return Math.round((correct / total) * 100)
  }, [state.lessonStats])

  const getRecommendedNext = useCallback(() => {
    for (const path of learningPaths) {
      for (const id of path.lessonIds) {
        const lesson = lessons[id]
        if (lesson && !state.completedLessons.includes(id)) {
          return {
            lessonId: id,
            pathId: path.id,
            title: lesson.title,
            duration: lesson.duration,
            pathTitle: path.title,
          }
        }
      }
    }
    return null
  }, [state.completedLessons])

  const getRecommendedPractice = useCallback(() => {
    const accuracy = getAccuracy()
    const completed = state.completedLessons
    const strong = []
    const weak = []

    if (completed.includes('passwords-strong') || completed.includes('passwords-mfa')) {
      strong.push('password security')
    }
    if (!completed.includes('phishing-fake-login') && completed.includes('phishing-email')) {
      weak.push('fake login pages')
    }
    if (!completed.includes('phishing-email')) {
      weak.push('phishing and scams')
    }

    if (strong.length && weak.length) {
      return `You are doing well with ${strong[0]}. Practising ${weak[0]} could improve your scam detection skills.`
    }
    if (accuracy !== null && accuracy >= 80) {
      return 'You are building solid habits. Try the next lesson in your current path to keep momentum.'
    }
    return 'Start with Cybersecurity Basics or play the free game to see which topics feel familiar.'
  }, [state.completedLessons, getAccuracy])

  const getWeakTopics = useCallback(() => {
    const topics = []
    const pathChecks = [
      { pathId: 'phishing', label: 'Phishing and scams' },
      { pathId: 'passwords', label: 'Passwords and accounts' },
      { pathId: 'privacy', label: 'Privacy and data' },
    ]
    for (const { pathId, label } of pathChecks) {
      const path = learningPaths.find((p) => p.id === pathId)
      if (!path) continue
      const available = path.lessonIds.filter((id) => lessons[id])
      const done = available.filter((id) => state.completedLessons.includes(id)).length
      if (done < available.length / 2) topics.push(label)
    }
    return topics
  }, [state.completedLessons])

  const saveGameSessionBest = useCallback((score) => {
    try {
      const prev = parseInt(localStorage.getItem(GAME_BEST_KEY) || '0', 10)
      if (score > prev) localStorage.setItem(GAME_BEST_KEY, String(score))
      return Math.max(score, prev)
    } catch (_) {
      return score
    }
  }, [])

  const getGameSessionBest = useCallback(() => {
    try {
      return parseInt(localStorage.getItem(GAME_BEST_KEY) || '0', 10)
    } catch (_) {
      return 0
    }
  }, [])

  const value = {
    ...state,
    completeLesson,
    getAccuracy,
    getRecommendedNext,
    getRecommendedPractice,
    getWeakTopics,
    getPathProgress: (pathId) => getPathProgress(pathId, state.completedLessons),
    saveGameSessionBest,
    getGameSessionBest,
    totalLessonsAvailable: Object.keys(lessons).length,
  }

  return (
    <LearningProgressContext.Provider value={value}>
      {children}
    </LearningProgressContext.Provider>
  )
}
