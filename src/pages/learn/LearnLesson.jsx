import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteNav from '../../components/SiteNav'
import { lessons, getPathById } from '../../data/learningContent'
import { useLearningProgress } from '../../contexts/LearningProgressContext'
import NotFound from '../NotFound'
import '../../styles/site.css'
import '../../styles/learn.css'

export default function LearnLesson() {
  const { lessonId } = useParams()
  const lesson = lessons[lessonId]
  const { completeLesson } = useLearningProgress()
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  if (!lesson) return <NotFound />

  const path = getPathById(lesson.pathId)
  const quiz = lesson.quiz
  const isCorrect = submitted && selected === quiz.correctIndex

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    completeLesson(lessonId, selected === quiz.correctIndex ? 1 : 0, 1)
  }

  return (
    <div className="site-page learn-page">
      <div className="container">
        <SiteNav />
        <Link to={`/learn/paths/${lesson.pathId}`} className="btn-ghost btn-sm" style={{ marginBottom: 16, display: 'inline-block' }}>
          ← {path?.title || 'Path'}
        </Link>

        <article className="lesson-layout">
          <p className="section-label">{path?.title}</p>
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 8px' }}>{lesson.title}</h1>
          <p className="muted" style={{ margin: '0 0 28px' }}>{lesson.duration} min read</p>

          <section className="lesson-section">
            <h2>Introduction</h2>
            <p style={{ lineHeight: 1.65, color: 'var(--ink)' }}>{lesson.intro}</p>
          </section>

          <section className="lesson-section">
            <h2>Real-world example</h2>
            <div className="lesson-example">{lesson.example}</div>
          </section>

          <section className="lesson-section">
            <h2>Explanation</h2>
            <p style={{ lineHeight: 1.65, color: 'var(--ink)' }}>{lesson.explanation}</p>
          </section>

          <section className="lesson-section lesson-quiz">
            <h2>Quick check</h2>
            <p style={{ marginBottom: 12 }}>{quiz.question}</p>
            {quiz.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                className={`quiz-option ${selected === i ? 'selected' : ''} ${submitted && i === quiz.correctIndex ? 'correct' : ''} ${submitted && selected === i && i !== quiz.correctIndex ? 'incorrect' : ''}`}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
              >
                {opt}
              </button>
            ))}
            {!submitted && (
              <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={handleSubmit} disabled={selected === null}>
                Check answer
              </button>
            )}
            {submitted && (
              <div className={`quiz-feedback ${isCorrect ? 'ok' : 'err'}`}>
                {quiz.feedback}
              </div>
            )}
          </section>

          <div className="takeaway-box">
            <strong>Key takeaway</strong>
            <p style={{ margin: '8px 0 0', lineHeight: 1.55 }}>{lesson.takeaway}</p>
          </div>

          {lesson.nextLessonId && lessons[lesson.nextLessonId] && (
            <div style={{ marginTop: 24 }}>
              <p className="muted" style={{ marginBottom: 8 }}>Your next step</p>
              <Link to={`/learn/lessons/${lesson.nextLessonId}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Practise: {lessons[lesson.nextLessonId].title}
              </Link>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
