import React, { createContext, useContext, useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBTWS3GAmBjYOJB9FO6TvLKZKKg8HgqhAs",
  authDomain: "game-cdd1d.firebaseapp.com",
  projectId: "game-cdd1d",
  storageBucket: "game-cdd1d.firebasestorage.app",
  messagingSenderId: "482306235908",
  appId: "1:482306235908:web:0db066468f868ccbd61f51"
}

// Inicializálás
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const registerWithEmail = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Adj meg e-mail címet és jelszót.')
      }
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(cred.user)
      await signOut(auth)
      return { success: true, message: 'Sikeres regisztráció! Küldtünk egy megerősítő e-mailt. Ellenőrizd a postaládádat.' }
    } catch (error) {
      return { success: false, message: error?.message || 'Regisztráció sikertelen' }
    }
  }

  const loginWithEmail = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Adj meg e-mail címet és jelszót.')
      }
      const cred = await signInWithEmailAndPassword(auth, email, password)
      if (!cred.user.emailVerified) {
        try {
          await sendEmailVerification(cred.user)
        } catch (_) {}
        await signOut(auth)
        return { success: false, message: 'Még nem erősítetted meg az e-mail címed. Küldtünk megerősítő linket. Jelentkezz be újra a megerősítés után.' }
      }
      return { success: true, message: 'Sikeres bejelentkezés!' }
    } catch (error) {
      return { success: false, message: error?.message || 'Bejelentkezés sikertelen' }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true, message: 'Kijelentkeztél.' }
    } catch (error) {
      return { success: false, message: error?.message || 'Kijelentkezés sikertelen' }
    }
  }

  const saveLevelCompletion = async (levelId) => {
    try {
      if (!user) {
        throw new Error('Előbb jelentkezz be a mentéshez.')
      }
      if (!user.emailVerified) {
        throw new Error('Csak megerősített e-maillel lehet menteni. Ellenőrizd a postaládád.')
      }
      if (!levelId) {
        throw new Error('Hiányzik a pálya azonosító (levelId).')
      }
      const ref = doc(db, 'users', user.uid, 'completions', String(levelId))
      await setDoc(ref, { levelId: String(levelId), completedAt: serverTimestamp() }, { merge: true })
      return { success: true, message: `Pálya mentve: ${levelId}` }
    } catch (error) {
      return { success: false, message: error?.message || 'Mentés sikertelen' }
    }
  }

  const checkMissionCompletion = async () => {
    if (!user || !user.emailVerified) return false
    try {
      const ref = doc(db, 'users', user.uid, 'completions', 'mission')
      const snap = await getDoc(ref)
      return snap.exists()
    } catch (error) {
      console.warn('Mission completion check error:', error)
      return false
    }
  }

  const getHighestCompletedLevel = async () => {
    if (!user || !user.emailVerified) return 0
    try {
      // Ellenőrizzük a mission teljesítését - ha nincs, akkor 0
      const missionRef = doc(db, 'users', user.uid, 'completions', 'mission')
      const missionSnap = await getDoc(missionRef)
      if (!missionSnap.exists()) return 0
      
      // Ellenőrizzük a pályák teljesítését (ugy1-ugy12)
      let highest = 0
      for (let i = 1; i <= 12; i++) {
        const levelRef = doc(db, 'users', user.uid, 'completions', `ugy${i}`)
        const levelSnap = await getDoc(levelRef)
        if (levelSnap.exists()) {
          highest = i
        }
      }
      return highest
    } catch (error) {
      console.warn('Highest completed level check error:', error)
      return 0
    }
  }

  const saveScoringData = async (scoringData) => {
    try {
      if (!user) {
        throw new Error('Előbb jelentkezz be a mentéshez.')
      }
      if (!user.emailVerified) {
        throw new Error('Csak megerősített e-maillel lehet menteni. Ellenőrizd a postaládád.')
      }
      if (!scoringData) {
        throw new Error('Hiányznak a scoring adatok.')
      }
      const ref = doc(db, 'users', user.uid, 'scoring', 'data')
      await setDoc(ref, {
        ...scoringData,
        updatedAt: serverTimestamp()
      }, { merge: true })
      return { success: true }
    } catch (error) {
      console.warn('Scoring mentés hiba:', error)
      return { success: false, message: error?.message || 'Mentés sikertelen' }
    }
  }

  const loadScoringData = async () => {
    try {
      if (!user || !user.emailVerified) {
        return null
      }
      const ref = doc(db, 'users', user.uid, 'scoring', 'data')
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        // Eltávolítjuk az updatedAt mezőt, mert az nem kell a state-hez
        const { updatedAt, ...scoringData } = data
        return scoringData
      }
      return null
    } catch (error) {
      console.warn('Scoring betöltés hiba:', error)
      return null
    }
  }

  const getRetroPromptSeen = async () => {
    try {
      if (!user || !user.emailVerified) {
        return false
      }
      const ref = doc(db, 'users', user.uid, 'preferences', 'data')
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        return data.retroPromptSeen === true
      }
      return false
    } catch (error) {
      console.warn('Retro prompt seen check error:', error)
      return false
    }
  }

  const setRetroPromptSeen = async () => {
    try {
      if (!user) {
        throw new Error('Előbb jelentkezz be a mentéshez.')
      }
      if (!user.emailVerified) {
        throw new Error('Csak megerősített e-maillel lehet menteni. Ellenőrizd a postaládád.')
      }
      const ref = doc(db, 'users', user.uid, 'preferences', 'data')
      await setDoc(ref, {
        retroPromptSeen: true,
        updatedAt: serverTimestamp()
      }, { merge: true })
      return { success: true }
    } catch (error) {
      console.warn('Retro prompt seen mentés hiba:', error)
      return { success: false, message: error?.message || 'Mentés sikertelen' }
    }
  }

  const value = {
    user,
    loading,
    registerWithEmail,
    loginWithEmail,
    logout,
    saveLevelCompletion,
    checkMissionCompletion,
    getHighestCompletedLevel,
    saveScoringData,
    loadScoringData,
    getRetroPromptSeen,
    setRetroPromptSeen,
    isAuthenticated: !!user && user.emailVerified
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

