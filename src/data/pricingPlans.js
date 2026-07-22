export const pricingPlans = [
  {
    id: 'free',
    title: 'Free',
    amount: '€0',
    desc: 'Try the decision-practice game and daily challenges with no commitment.',
    forYou: 'For you if… you want to experience real cybersecurity decisions safely before committing to a learning plan.',
    features: [
      'Full access to the free cybersecurity game',
      'Short challenges with immediate answer explanations',
      'Basic score tracking',
      'Daily challenge',
    ],
    cta: { to: '/play', label: 'Play Free' },
  },
  {
    id: 'learning',
    title: 'Iterali Learning',
    highlight: true,
    amount: '€5.99',
    billingNotes: [
      { text: 'per month' },
      { yearly: true },
    ],
    desc: 'Build consistent decision skills with structured lessons and workplace modules.',
    forYou: 'For you if… you want regular practice, clear learning paths and progress you can see over time.',
    features: [
      'Full access to all learning paths',
      'Beginner lessons and practical exercises',
      'Workplace security modules',
      'Progress tracking and personalised recommendations',
      'Career introduction modules',
      'New monthly content',
      'No ads inside the learning platform',
    ],
    cta: { to: '/learn', label: 'Start Learning' },
  },
]
