import React from 'react'
import { ACADEMY_COHORT } from '../data/academyCohort'

export default function AcademyCohortNote({ className = '' }) {
  const { spotsRemaining, startLabel } = ACADEMY_COHORT
  return (
    <p className={`academy-cohort-note${className ? ` ${className}` : ''}`}>
      <strong>Only {spotsRemaining} seats for the next cohort</strong>
      {' '}· Starts {startLabel}
    </p>
  )
}
