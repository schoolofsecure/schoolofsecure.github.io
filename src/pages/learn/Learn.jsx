import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'
import CookieBanner from '../../components/CookieBanner'
import PromoCard from '../../components/PromoCard'
import { learningPaths } from '../../data/learningContent'
import { useLearningProgress } from '../../contexts/LearningProgressContext'
import '../../styles/site.css'
import '../../styles/learn.css'

const learnPromos = [
  {
    label: 'Plans',
    title: 'View pricing',
    text: 'See Free and Iterali Learning options. Upgrade when you want tracked progress.',
    to: '/pricing',
    linkLabel: 'View plans',
  },
  {
    label: 'Free game',
    title: 'Practise one case first',
    text: 'Prefer a short workplace decision with no account? Start with the free case.',
    to: '/play',
    linkLabel: 'Try the free game',
  },
]

export default function Learn() {
  const { getPathProgress, completedLessons, totalLessonsAvailable, getRecommendedNext } = useLearningProgress()
  const next = getRecommendedNext()
  const progressPct = totalLessonsAvailable
    ? Math.round((completedLessons.length / totalLessonsAvailable) * 100)
    : 0

  return (
    <div className="container teams-page">
      <SiteNav />

      <header className="teams-hero">
        <div className="teams-hero-copy">
          <p className="landing-path-label">Iterali Learning</p>
          <h1>Learn cybersecurity step by step</h1>
          <p className="teams-hero-lead">
            Structured paths for busy people. Short lessons, practical decisions and one clear next step. Separate from the free game.
          </p>
          <div className="teams-hero-ctas">
            {next ? (
              <Link to={`/learn/lessons/${next.lessonId}`} className="btn btn-primary teams-btn">
                Practise this next
              </Link>
            ) : (
              <Link to={`/learn/paths/${learningPaths[0]?.id}`} className="btn btn-primary teams-btn">
                Start learning
              </Link>
            )}
            <Link to="/learn/dashboard" className="btn btn-secondary teams-btn">
              My dashboard
            </Link>
          </div>
        </div>
        <aside className="teams-hero-aside" aria-label="Progress">
          <div className="teams-aside-card">
            {next ? (
              <>
                <p className="teams-aside-label">Your next step</p>
                <p className="teams-aside-stat">{next.title}</p>
                <p className="teams-aside-note">
                  {next.pathTitle}
                  {next.duration ? ` · about ${next.duration} min` : ''}
                </p>
              </>
            ) : (
              <>
                <p className="teams-aside-label">Progress</p>
                <p className="teams-aside-stat">Ready to begin</p>
                <p className="teams-aside-note">Pick a path below and take one clear next step.</p>
              </>
            )}
            <p className="teams-aside-note teams-aside-note--flush">
              {completedLessons.length} of {totalLessonsAvailable} starter lessons completed
            </p>
            <div className="teams-aside-bars teams-aside-bars--spaced">
              <span style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </aside>
      </header>

      <section className="teams-section" aria-labelledby="learn-paths-title">
        <h2 id="learn-paths-title" className="teams-section-title">Learning paths</h2>
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
      </section>

      <section className="teams-section" aria-labelledby="learn-more-title">
        <h2 id="learn-more-title" className="teams-section-title">Also available</h2>
        <div className="teams-how-grid">
          {learnPromos.map((card) => (
            <PromoCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
