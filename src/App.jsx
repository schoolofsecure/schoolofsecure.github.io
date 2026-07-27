import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ScoringProvider, useScoring } from './contexts/ScoringContext'
import { LearningProgressProvider } from './contexts/LearningProgressContext'
import PointAnimation from './components/Scoring/PointAnimation'
import RankBadgeAnimation from './components/Scoring/RankBadgeAnimation'
import LevelCompletionSummary from './components/Scoring/LevelCompletionSummary'
import Landing from './pages/Landing'
import Play from './pages/Play'
import FreeCase from './pages/FreeCase'
import Learn from './pages/learn/Learn'
import LearnPath from './pages/learn/LearnPath'
import LearnLesson from './pages/learn/LearnLesson'
import LearnDashboard from './pages/learn/LearnDashboard'
import ForTeams from './pages/ForTeams'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
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
  const { pathname } = useLocation()
  const hideVisuals = pathname.startsWith('/learn')

  if (hideVisuals) return null

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
          <Route path="/play/case/:caseId" element={<FreeCase />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/dashboard" element={<LearnDashboard />} />
          <Route path="/learn/paths/:pathId" element={<LearnPath />} />
          <Route path="/learn/lessons/:lessonId" element={<LearnLesson />} />
          <Route path="/pricing" element={<Navigate to="/learn" replace />} />
          <Route path="/teams" element={<ForTeams />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
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
        <LearningProgressProvider>
          <ScoringProvider>
            <AppContent />
          </ScoringProvider>
        </LearningProgressProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
