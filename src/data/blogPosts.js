/** Blog posts for SEO / Resources. Newest first. */
export const blogPosts = [
  {
    slug: 'spot-fake-login-pages',
    title: 'How to spot a fake login page',
    date: '2026-07-10',
    excerpt: 'Look past the logo. Check the full URL, TLS details and urgency cues before you type a password.',
    body: [
      'Fake login pages copy familiar brands so people rush and skip basic checks. The first habit to build is slowing down when a message pushes you to verify now.',
      'Read the full address bar, not just the logo. Misspellings, odd subdomains and unexpected redirects are common tells. Prefer bookmarks for services you use often.',
      'If something feels off, close the tab and open the site from a known bookmark or the official app. That single pause is often enough to avoid credential theft.',
    ],
  },
  {
    slug: 'safe-to-fail-security-practice',
    title: 'Why safe-to-fail practice beats one-off awareness videos',
    date: '2026-07-03',
    excerpt: 'People learn security habits by deciding under pressure, then reviewing what they missed without blame.',
    body: [
      'Awareness videos can raise awareness, but they rarely change day-to-day decisions. People need repeated practice in realistic scenarios where mistakes are allowed.',
      'Safe-to-fail training lets learners try phishing, social engineering and unsafe shortcuts in a controlled environment. Feedback should explain the risk, not shame the person.',
      'Over time, structured challenges build pattern recognition: urgency language, lookalike domains and requests that skip normal process. That is the skill that transfers to work.',
    ],
  },
  {
    slug: 'human-centered-security-teams',
    title: 'Human-centered security for teams that are busy',
    date: '2026-06-26',
    excerpt: 'Security habits stick when training respects real workflows instead of dumping policy walls.',
    body: [
      'Teams ignore security advice that fights how they actually work. Short, realistic scenarios tied to email, chat and access requests fit better than long policy dumps.',
      'Human-centered security assumes people want to do the right thing when the path is clear. Training should show the safer action in context, then reinforce it with practice.',
      'For managers, progress tracking helps spot gaps without turning every miss into a performance issue. Leaders see skill patterns, not individual mistake replays.',
    ],
  },
]

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug) || null
}

export function getLatestBlogPosts(limit = 3) {
  return blogPosts.slice(0, limit)
}
