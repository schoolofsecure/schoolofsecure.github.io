import React, { createContext, useContext, useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { logger } from '../utils/logger'
import { sanitizeErrorMessage } from '../utils/sanitize'

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
        throw new Error('Please enter an email address and password.')
      }
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(cred.user)
      await signOut(auth)
      return { success: true, message: 'Registration successful! We sent a confirmation email. Check your inbox.' }
    } catch (error) {
      let errorMessage = 'Registration failed.'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'If the confirmation email does not arrive, try signing in to your account.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.'
      } else {
        errorMessage = sanitizeErrorMessage(error)
      }
      return { success: false, message: errorMessage }
    }
  }

  const loginWithEmail = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Please enter an email address and password.')
      }
      const cred = await signInWithEmailAndPassword(auth, email, password)
      if (!cred.user.emailVerified) {
        try {
          await sendEmailVerification(cred.user)
        } catch (_) {}
        await signOut(auth)
        return { success: false, message: 'Your email is not verified yet. We sent a confirmation link. Sign in again after verifying.' }
      }
      return { success: true, message: 'Signed in successfully!' }
    } catch (error) {
      return { success: false, message: sanitizeErrorMessage(error) || 'Sign-in failed' }
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      return { success: true, message: 'Signed in successfully!' }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return { success: false, message: 'Sign-in cancelled.' }
      }
      if (error.code === 'auth/unauthorized-domain') {
        return { success: false, message: 'This domain is not allowed for Google sign-in. Add it in Firebase Console.' }
      }
      return { success: false, message: sanitizeErrorMessage(error) || 'Google sign-in failed' }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true, message: 'Signed out.' }
    } catch (error) {
      return { success: false, message: sanitizeErrorMessage(error) || 'Sign-out failed' }
    }
  }

  const sendPasswordReset = async (email) => {
    try {
      if (!email || !email.trim()) {
        throw new Error('Please enter an email address.')
      }
      await sendPasswordResetEmail(auth, email.trim())
      return { success: true, message: 'Password reset email sent. Check your inbox.' }
    } catch (error) {
      let errorMessage = 'Could not send password reset email.'
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account is registered with this email address.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else {
        errorMessage = sanitizeErrorMessage(error)
      }
      return { success: false, message: errorMessage }
    }
  }

  const saveLevelCompletion = async (levelId) => {
    try {
      if (!user) {
        throw new Error('Sign in first to save.')
      }
      if (!user.emailVerified) {
        throw new Error('You need a verified email to save. Check your inbox.')
      }
      if (!levelId) {
        throw new Error('Missing level ID (levelId).')
      }
      const ref = doc(db, 'users', user.uid, 'completions', String(levelId))
      await setDoc(ref, { levelId: String(levelId), completedAt: serverTimestamp() }, { merge: true })
      return { success: true, message: `Level saved: ${levelId}` }
    } catch (error) {
      return { success: false, message: sanitizeErrorMessage(error) || 'Save failed' }
    }
  }

  const checkMissionCompletion = async () => {
    if (!user || !user.emailVerified) return false
    try {
      const ref = doc(db, 'users', user.uid, 'completions', 'mission')
      const snap = await getDoc(ref)
      return snap.exists()
    } catch (error) {
      logger.warn('Mission completion check error:', error)
      return false
    }
  }

  const checkLevelCompleted = async (levelId) => {
    if (!user || !user.emailVerified) return false
    try {
      const ref = doc(db, 'users', user.uid, 'completions', String(levelId))
      const snap = await getDoc(ref)
      return snap.exists()
    } catch (error) {
      logger.warn('Level completion check error:', error)
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
      logger.warn('Highest completed level check error:', error)
      return 0
    }
  }

  const saveScoringData = async (scoringData) => {
    try {
      if (!user) {
        throw new Error('Sign in first to save.')
      }
      if (!user.emailVerified) {
        throw new Error('You need a verified email to save. Check your inbox.')
      }
      if (!scoringData) {
        throw new Error('Scoring data is missing.')
      }
      const ref = doc(db, 'users', user.uid, 'scoring', 'data')
      await setDoc(ref, {
        ...scoringData,
        updatedAt: serverTimestamp()
      }, { merge: true })
      return { success: true }
    } catch (error) {
      logger.warn('Scoring mentés hiba:', error)
      return { success: false, message: sanitizeErrorMessage(error) || 'Save failed' }
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
      logger.warn('Scoring betöltés hiba:', error)
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
      logger.warn('Retro prompt seen check error:', error)
      return false
    }
  }

  const setRetroPromptSeen = async () => {
    try {
      if (!user) {
        throw new Error('Sign in first to save.')
      }
      if (!user.emailVerified) {
        throw new Error('You need a verified email to save. Check your inbox.')
      }
      const ref = doc(db, 'users', user.uid, 'preferences', 'data')
      await setDoc(ref, {
        retroPromptSeen: true,
        updatedAt: serverTimestamp()
      }, { merge: true })
      return { success: true }
    } catch (error) {
      logger.warn('Retro prompt seen mentés hiba:', error)
      return { success: false, message: sanitizeErrorMessage(error) || 'Save failed' }
    }
  }

  const deleteAccount = async () => {
    try {
      if (!user) {
        throw new Error('No user is signed in.')
      }
      
      const userId = user.uid
      
      // Firestore adatok törlése
      try {
        // Completions törlése
        const completionsRef = collection(db, 'users', userId, 'completions')
        const completionsSnap = await getDocs(completionsRef)
        const completionsPromises = completionsSnap.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(completionsPromises)
        
        // Scoring törlése
        const scoringRef = doc(db, 'users', userId, 'scoring', 'data')
        await deleteDoc(scoringRef).catch(() => {}) // Ha nincs, ne dobjon hibát
        
        // Preferences törlése
        const preferencesRef = doc(db, 'users', userId, 'preferences', 'data')
        await deleteDoc(preferencesRef).catch(() => {}) // Ha nincs, ne dobjon hibát
      } catch (firestoreError) {
        logger.warn('Firestore törlés hiba (folytatjuk):', firestoreError)
      }
      
      // Firebase Auth user törlése
      await deleteUser(auth.currentUser)
      
      return { success: true, message: 'Account deleted successfully.' }
    } catch (error) {
      let errorMessage = 'Failed to delete account.'
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'For security reasons, you need to sign in again before deleting your account.'
      } else {
        errorMessage = sanitizeErrorMessage(error)
      }
      return { success: false, message: errorMessage }
    }
  }

  const value = {
    user,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    sendPasswordReset,
    saveLevelCompletion,
    checkMissionCompletion,
    checkLevelCompleted,
    getHighestCompletedLevel,
    saveScoringData,
    loadScoringData,
    getRetroPromptSeen,
    setRetroPromptSeen,
    deleteAccount,
    isAuthenticated: !!user && user.emailVerified
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

