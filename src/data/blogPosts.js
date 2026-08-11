/** Blog posts for SEO / Resources. Newest first. */
export const blogPosts = [
  {
    slug: 'people-pleaser-online-stay-kind',
    title: 'People pleaser online? Stay kind without saying yes too fast',
    date: '2026-08-11',
    excerpt:
      'If you say yes too quickly to urgent emails and chat requests, a twenty-second pause helps you stay kind and decide more safely online.',
    seoTitle: 'People Pleaser Online? Stay Kind Without Instant Yes | Iterali',
    seoDescription:
      'Learn how people-pleasing makes urgent online requests harder to refuse — and how a simple 20-second pause keeps you kind while you decide more safely.',
    body: [
      'The message lands mid-afternoon. A colleague you like writes: “Quick favour — can you approve this link so I can finish before the call?” Your fingers are already moving. You want to help. You don’t want to be the person who slows things down.',
      'If that sounds familiar, you are not alone — and you are not broken. A lot of kind people share the same reflex online: when someone asks, the answer rises before the question has fully settled. Being a people pleaser is often just care under pressure. The trouble is that urgency and friendliness can sit side by side in a real request and in a risky one. Online, the difference is not always obvious in the first two seconds.',
      'We say yes quickly because yes feels like connection. It keeps the peace. It proves we are useful. Our minds treat a delayed reply as a tiny social risk: Will they think I’m difficult? Will I look unhelpful? So we smooth the discomfort with speed. That habit works well in many daily moments. It works less well when a chat ping, an email marked “urgent,” or a shared file asks for access, payment details, or a click you cannot easily undo. Kindness is still a strength. Automatic agreement is the part that leaves the door ajar.',
      'Here is one small practice you can try today. Call it the twenty-second pause. When a request arrives and your body leans toward yes, stop typing. Count slowly to twenty. In that short space, ask yourself three quiet checks: Do I know this person well enough in this channel? Does the ask match what we normally do? Can this wait until I verify another way — a known bookmark, a separate message, a quick voice note? You are not inventing excuses. You are giving your care room to think. Most genuine colleagues can live with a short delay. Many unsafe requests rely on you skipping that delay.',
      'You can still be warm while you pause. A line like “Happy to help — give me a moment to check this the usual way” keeps the relationship intact and buys you clarity. That is not cold. That is steady. Over time, the pause stops feeling like hesitation and starts feeling like self-respect. You are teaching yourself that kindness and caution can share the same sentence.',
      'You do not need a harder personality. You need a slower first yes. Every time you take those twenty seconds, you practise a habit that travels with you: into email, into group chats, into the link that arrives “just this once.” This is a skill you can learn, not a flaw you have to hide. Confidence online is not about distrusting everyone. It is about trusting yourself enough to choose when to move.',
      'Next step: the next time a request pulls you toward an instant yes, take twenty seconds — then decide with both kindness and care.',
    ],
  },
  {
    slug: 'pause-before-you-continue',
    title: 'The most dangerous button is often “Continue”',
    date: '2026-07-23',
    excerpt: 'We tap Continue to accept, connect or move on. A short pause before that click can reveal when something is off.',
    body: [
      'Ask someone what the riskiest button online is and they might name Delete, Confirm payment or Share location. The quieter answer is often Continue — the button we press without thinking.',
      'It shows up everywhere: to accept terms, link an account, grant access or simply leave a screen. Because it feels routine, we rarely stop to ask what we are agreeing to, which account we are using or whether the page is genuine.',
      'Before you continue, take one breath. Check the URL, the account shown and what the next step actually grants. That pause is often enough to notice when a familiar flow does not feel right.',
      'Safer habits start with a slower click. Pause before you continue.',
    ],
  },
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
    slug: 'human-centred-security-teams',
    title: 'Human-centred security for teams that are busy',
    date: '2026-06-26',
    excerpt: 'Security habits stick when training respects real workflows instead of dumping policy walls.',
    body: [
      'Teams ignore security advice that fights how they actually work. Short, realistic scenarios tied to email, chat and access requests fit better than long policy dumps.',
      'Human-centred security assumes people want to do the right thing when the path is clear. Training should show the safer action in context, then reinforce it with practice.',
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

/** Rough reading time from body (+ excerpt). At least 1 minute. */
export function getReadingMinutes(post, wordsPerMinute = 200) {
  const text = [post?.excerpt, ...(post?.body || [])].filter(Boolean).join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
