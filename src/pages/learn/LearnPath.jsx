import React from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteNav from '../../components/SiteNav'
import { getPathById, lessons } from '../../data/learningContent'
import { useLearningProgress } from '../../contexts/LearningProgressContext'
import NotFound from '../NotFound'
import '../../styles/site.css'
import '../../styles/learn.css'

export default function LearnPath() {
  const { pathId } = useParams()
  const path = getPathById(pathId)
  const { completedLessons, getPathProgress } = useLearningProgress()

  if (!path) return <NotFound />

  return (
    <div className="site-page learn-page">
      <div className="container">
        <SiteNav />
        <Link to="/learn" className="btn-ghost btn-sm" style={{ marginBottom: 16, display: 'inline-block' }}>
          ← All paths
        </Link>
        <header className="learn-header">
          <h1>{path.title}</h1>
          <p>{path.description}</p>
          <div className="progress-bar-wrap" style={{ maxWidth: 320 }}>
            <div className="progress-bar-fill" style={{ width: `${getPathProgress(pathId)}%` }} />
          </div>
        </header>

        <section style={{ marginBottom: 32 }}>
          <h2 className="section-title" style={{ fontSize: 20 }}>Topics in this path</h2>
          <ul className="feature-list">
            {path.topics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="section-title" style={{ fontSize: 20 }}>Lessons</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {path.lessonIds.map((id) => {
              const lesson = lessons[id]
              if (!lesson) return null
              const done = completedLessons.includes(id)
              return (
                <Link
                  key={id}
                  to={`/learn/lessons/${id}`}
                  className="path-card"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{lesson.title}</h3>
                    <span className="path-meta">{lesson.duration} min{done ? ' · Completed' : ''}</span>
                  </div>
                  <span style={{ color: 'var(--neon)' }}>→</span>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
