import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../../components/SiteNav'
import { learningPaths, lessons } from '../../data/learningContent'
import { useLearningProgress } from '../../contexts/LearningProgressContext'
import '../../styles/site.css'
import '../../styles/learn.css'

export default function LearnDashboard() {
  const {
    completedLessons,
    weeklyGoal,
    lessonsThisWeek,
    getAccuracy,
    getRecommendedNext,
    getRecommendedPractice,
    getWeakTopics,
    totalLessonsAvailable,
  } = useLearningProgress()

  const accuracy = getAccuracy()
  const next = getRecommendedNext()
  const weak = getWeakTopics()
  const overallProgress = totalLessonsAvailable
    ? Math.round((completedLessons.length / totalLessonsAvailable) * 100)
    : 0

  const recent = [...completedLessons]
    .reverse()
    .slice(0, 5)
    .map((id) => lessons[id])
    .filter(Boolean)

  const currentPath = next ? learningPaths.find((p) => p.id === next.pathId) : learningPaths[0]

  return (
    <div className="site-page learn-page">
      <div className="container">
        <SiteNav />
        <header className="learn-header">
          <h1>Your next step</h1>
          <p>One clear practise case at a time. Review what you decided, then move on.</p>
        </header>

        {next ? (
          <div className="dash-card" style={{ marginBottom: 24, maxWidth: 560 }}>
            <p className="muted" style={{ margin: '0 0 4px' }}>{next.pathTitle}</p>
            <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>{next.title}</h2>
            <p className="muted" style={{ margin: '0 0 16px', fontSize: 14 }}>
              {next.duration ? `About ${next.duration} min` : 'Short lesson'} · decide, review, continue
            </p>
            <Link to={`/learn/lessons/${next.lessonId}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Practise this next
            </Link>
          </div>
        ) : (
          <div className="dash-card" style={{ marginBottom: 24, maxWidth: 560 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>You have finished the starter lessons</h2>
            <p className="muted" style={{ margin: '0 0 16px' }}>
              Keep the habit sharp in the free game, or revisit a path.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/play" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Play free
              </Link>
              <Link to="/learn" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Browse paths
              </Link>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="dash-card">
              <p className="muted" style={{ margin: '0 0 4px' }}>Current path</p>
              <h2 style={{ margin: '0 0 12px', fontSize: 20 }}>{currentPath?.title}</h2>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
              </div>
              <p className="muted" style={{ margin: '8px 0 0', fontSize: 14 }}>
                {completedLessons.length} lessons completed · {overallProgress}% overall
              </p>
            </div>

            <div className="dash-card">
              <h3 style={{ margin: '0 0 12px', fontSize: 17 }}>Practice note</h3>
              <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--ink)' }}>{getRecommendedPractice()}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="dash-card">
              <p className="muted" style={{ margin: 0 }}>Weekly goal</p>
              <p className="dash-stat">{lessonsThisWeek} / {weeklyGoal}</p>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>Lessons this week</p>
            </div>

            <div className="dash-card">
              <p className="muted" style={{ margin: 0 }}>Accuracy rate</p>
              <p className="dash-stat">{accuracy !== null ? `${accuracy}%` : 'Not yet'}</p>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>From lesson quizzes</p>
            </div>

            {weak.length > 0 && (
              <div className="dash-card">
                <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>Topics needing more practice</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)' }}>
                  {weak.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {recent.length > 0 && (
              <div className="dash-card">
                <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>Recently completed</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)', fontSize: 14 }}>
                  {recent.map((l) => (
                    <li key={l.id}>{l.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
