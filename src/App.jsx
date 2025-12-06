import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ScoringProvider, useScoring } from './contexts/ScoringContext'
import PointAnimation from './components/Scoring/PointAnimation'
import RankBadgeAnimation from './components/Scoring/RankBadgeAnimation'
import LevelCompletionSummary from './components/Scoring/LevelCompletionSummary'
import Landing from './pages/Landing'
import Aurora from './pages/Aurora'
import Privacy from './pages/Privacy'
import Profile from './pages/Profile'
import UgyView from './pages/UgyView'
import QADebugPanel from './pages/qa-debug'
import TaskPreviewList from './pages/task-preview'


function AppContent() {
  const { isAuthenticated } = useAuth()
  const { 
    showPointAnimation, 
    setShowPointAnimation, 
    showRankBadge, 
    setShowRankBadge,
    showLevelCompletion,
    setShowLevelCompletion
  } = useScoring()

  return (
    <>
        <BrowserRouter>
        <div className="scanlines" aria-hidden="true"></div>
        <div className="grid-overlay" aria-hidden="true"></div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/aurora" element={<Aurora />} />
          <Route path="/aurora.html" element={<Navigate to="/aurora" replace />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ugy1" element={<UgyView />} />
          <Route path="/ugy2" element={<UgyView />} />
          <Route path="/ugy3" element={<UgyView />} />
          {import.meta.env.DEV && (
            <>
          <Route path="/qa-debug" element={<QADebugPanel />} />
          <Route path="/task-preview" element={<TaskPreviewList />} />
            </>
          )}
          {/*<Route path="/ugy3" element={<Ugy3 />} />
          <Route path="/ugy4" element={<Ugy4 />} />
          <Route path="/ugy5" element={<Ugy5 />} />
          <Route path="/ugy6" element={<Ugy6 />} />
          <Route path="/ugy7" element={<Ugy7 />} />
          <Route path="/ugy8" element={<Ugy8 />} />
          <Route path="/ugy9" element={<Ugy9 />} />
          <Route path="/ugy10" element={<Ugy10 />} />
          <Route path="/ugy11" element={<Ugy11 />} />
          <Route path="/ugy12" element={<Ugy12 />} />*/}
        </Routes>
      </BrowserRouter>
      {isAuthenticated && showPointAnimation && (
        <PointAnimation
          points={showPointAnimation.points}
          onComplete={() => setShowPointAnimation(null)}
        />
      )}
      {isAuthenticated && showRankBadge && (
        <RankBadgeAnimation
          rank={showRankBadge.rank}
          onComplete={() => setShowRankBadge(null)}
        />
      )}
      {isAuthenticated && showLevelCompletion && (
        <LevelCompletionSummary
          levelName={showLevelCompletion.levelName}
          rank={showLevelCompletion.rank}
          totalPoints={showLevelCompletion.totalPoints}
          onComplete={() => setShowLevelCompletion(null)}
        />
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <ScoringProvider>
        <AppContent />
      </ScoringProvider>
    </AuthProvider>
  )
}

export default App

