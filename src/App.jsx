import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ScoringProvider, useScoring } from './contexts/ScoringContext'
import PointAnimation from './components/Scoring/PointAnimation'
import RankBadgeAnimation from './components/Scoring/RankBadgeAnimation'
import LevelCompletionSummary from './components/Scoring/LevelCompletionSummary'
import Landing from './pages/Landing'
import Play from './pages/Play'
import Boundaries from './pages/Boundaries'
import Contact from './pages/Contact'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Magazine from './pages/Magazine'
import Values from './pages/Values'
import Aurora from './pages/Aurora'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Profile from './pages/Profile'
import UgyView from './pages/UgyView'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import QADebugPanel from './pages/qa-debug'
import TaskPreviewList from './pages/task-preview'

function VisualEffects() {
  return (
    <>
      <div className="scanlines" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
    </>
  )
}

function AppContent() {
  const { isAuthenticated } = useAuth()
  const {
    showPointAnimation,
    setShowPointAnimation,
    showRankBadge,
    setShowRankBadge,
    showLevelCompletion,
    setShowLevelCompletion,
  } = useScoring()

  return (
    <>
      <BrowserRouter>
        <VisualEffects />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/*" element={<Navigate to="/play" replace />} />
          <Route path="/boundaries" element={<Boundaries />} />
          <Route path="/learn" element={<Navigate to="/" replace />} />
          <Route path="/learn/*" element={<Navigate to="/" replace />} />
          <Route path="/pricing" element={<Navigate to="/" replace />} />
          <Route path="/teams" element={<Navigate to="/" replace />} />
          <Route path="/teams/*" element={<Navigate to="/" replace />} />
          <Route path="/academy" element={<Navigate to="/aurora" replace />} />
          <Route path="/academy/*" element={<Navigate to="/aurora" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/values" element={<Values />} />
          <Route path="/aurora" element={<Aurora />} />
          <Route path="/aurora.html" element={<Navigate to="/aurora" replace />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ugy1" element={<UgyView />} />
          <Route path="/ugy2" element={<UgyView />} />
          <Route path="/ugy3" element={<UgyView />} />
          <Route path="/ugy4" element={<UgyView />} />
          <Route path="/ugy5" element={<UgyView />} />
          <Route path="/ugy6" element={<UgyView />} />
          <Route path="/ugy7" element={<UgyView />} />
          <Route path="/ugy8" element={<UgyView />} />
          <Route path="/ugy9" element={<UgyView />} />
          <Route path="/ugy10" element={<UgyView />} />
          <Route path="/ugy11" element={<UgyView />} />
          <Route path="/ugy12" element={<UgyView />} />
          {import.meta.env.DEV && (
            <>
              <Route path="/qa-debug" element={<QADebugPanel />} />
              <Route path="/task-preview" element={<TaskPreviewList />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
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
    <ErrorBoundary>
      <AuthProvider>
        <ScoringProvider>
          <AppContent />
        </ScoringProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
