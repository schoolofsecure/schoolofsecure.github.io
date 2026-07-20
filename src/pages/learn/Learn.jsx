import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../../components/SiteNav'
import { learningPaths } from '../../data/learningContent'
import { useLearningProgress } from '../../contexts/LearningProgressContext'
import '../../styles/site.css'
import '../../styles/learn.css'

export default function Learn() {
  const { getPathProgress, completedLessons, totalLessonsAvailable, getRecommendedNext } = useLearningProgress()
  const next = getRecommendedNext()

  return (
    <div className="site-page learn-page">
      <div className="container">
        <SiteNav />
        <header className="learn-header">
          <h1>Learn cybersecurity step by step</h1>
          <p>
            Structured paths for busy people. Short lessons, practical decisions and one clear next step. Separate from the free game.
          </p>
        </header>

        {next && (
          <div className="dash-card" style={{ marginBottom: 24, maxWidth: 560 }}>
            <p className="muted" style={{ margin: '0 0 4px' }}>Your next step</p>
            <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{next.title}</h2>
            <p className="muted" style={{ margin: '0 0 14px', fontSize: 14 }}>
              {next.pathTitle}
              {next.duration ? ` · about ${next.duration} min` : ''}
            </p>
            <Link to={`/learn/lessons/${next.lessonId}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Practise this next
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
          <Link to="/learn/dashboard" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            My dashboard
          </Link>
          <Link to="/pricing" className="btn-secondary btn" style={{ textDecoration: 'none' }}>
            View plans
          </Link>
        </div>

        <p className="muted" style={{ marginBottom: 16 }}>
          {completedLessons.length} of {totalLessonsAvailable} starter lessons completed
        </p>

        <div className="path-grid">
          {learningPaths.map((path) => (
            <Link key={path.id} to={`/learn/paths/${path.id}`} className="path-card">
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${getPathProgress(path.id)}%` }} />
              </div>
              <span className="path-meta">{getPathProgress(path.id)}% complete</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
