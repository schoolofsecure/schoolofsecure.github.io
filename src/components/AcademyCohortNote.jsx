import React from 'react'
import { ACADEMY_COHORT } from '../data/academyCohort'

export default function AcademyCohortNote({ className = '' }) {
  const { startLabel } = ACADEMY_COHORT
  return (
    <p className={`academy-cohort-note${className ? ` ${className}` : ''}`}>
      <strong>Small early practice group.</strong>
      {' '}We talk first. Aiming to start {startLabel}.
    </p>
  )
}
