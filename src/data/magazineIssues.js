/** Demo magazine issues. Separate from blog posts. */
export const magazineIssues = [
  {
    id: 'issue-01-the-pause',
    number: '01',
    title: 'The Pause',
    subtitle: 'Calm habits for hurried days',
    pages: [
      {
        id: 'cover',
        kind: 'cover',
        eyebrow: 'Iterali Magazine · Demo',
        title: 'The Pause',
        lead: 'A short issue about staying kind online without saying yes too fast.',
        tone: 'deep',
      },
      {
        id: 'spread-1',
        kind: 'spread',
        eyebrow: 'Scene',
        title: 'The message that pulls you in',
        body: 'A colleague asks for a quick favour. Your fingers move before the question settles. Kindness is not the problem. Speed is.',
        tone: 'warm',
      },
      {
        id: 'spread-2',
        kind: 'spread',
        eyebrow: 'Practice',
        title: 'Twenty seconds',
        body: 'Stop typing. Count slowly to twenty. Ask: Do I know this channel? Does this match our usual way? Can I verify first?',
        tone: 'cool',
      },
      {
        id: 'spread-3',
        kind: 'spread',
        eyebrow: 'Line you can use',
        title: 'Warm, and steady',
        body: '“Happy to help, give me a moment to check this the usual way.” Kindness and caution in one sentence.',
        tone: 'soft',
      },
      {
        id: 'close',
        kind: 'close',
        eyebrow: 'Close',
        title: 'Slower first yes',
        body: 'You do not need a harder personality. You need a habit you can practise. This is a demo of the magazine viewer, not a finished issue.',
        tone: 'deep',
        ctaLabel: 'Back to home',
        ctaTo: '/',
      },
    ],
  },
]

export function getMagazineIssue(id) {
  return magazineIssues.find((issue) => issue.id === id) || magazineIssues[0] || null
}
