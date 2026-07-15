export const learningPaths = [
  {
    id: 'basics',
    title: 'Cybersecurity Basics',
    description: 'Understand what cybersecurity means and how everyday threats show up online.',
    topics: [
      'What cybersecurity means',
      'Common digital threats',
      'How attackers target people',
      'Basic online safety',
      'Security terminology for beginners',
    ],
    lessonIds: ['basics-intro', 'basics-threats', 'basics-targets', 'basics-safety', 'basics-terms'],
  },
  {
    id: 'passwords',
    title: 'Passwords and Account Security',
    description: 'Protect your accounts with stronger habits and simple tools.',
    topics: [
      'Strong passwords',
      'Password reuse',
      'Password managers',
      'Multi-factor authentication',
      'Account recovery',
      'Verification codes',
    ],
    lessonIds: ['passwords-strong', 'passwords-reuse', 'passwords-managers', 'passwords-mfa', 'passwords-recovery'],
  },
  {
    id: 'phishing',
    title: 'Phishing and Online Scams',
    description: 'Spot scams before they trick you or someone you know.',
    topics: [
      'Email phishing',
      'SMS scams',
      'Fake login pages',
      'Social media scams',
      'Shopping scams',
      'Job offer scams',
      'QR-code scams',
      'Impersonation attempts',
    ],
    lessonIds: ['phishing-email', 'phishing-sms', 'phishing-fake-login', 'phishing-social'],
  },
  {
    id: 'privacy',
    title: 'Privacy and Personal Data',
    description: 'Control what you share and who can see it.',
    topics: [
      'Personal information',
      'Social media privacy',
      'App permissions',
      'Data tracking',
      'Location sharing',
      'Data breaches',
      'Safe file sharing',
    ],
    lessonIds: ['privacy-personal', 'privacy-social', 'privacy-permissions', 'privacy-tracking'],
  },
  {
    id: 'devices',
    title: 'Device and Browser Security',
    description: 'Keep phones, laptops, and browsers in good shape.',
    topics: [
      'Software updates',
      'Secure downloads',
      'Malware basics',
      'Browser extensions',
      'Public Wi-Fi',
      'Backups',
      'Lost or stolen devices',
      'Suspicious USB devices',
    ],
    lessonIds: ['devices-updates', 'devices-downloads', 'devices-malware', 'devices-wifi'],
  },
  {
    id: 'workplace',
    title: 'Workplace Cybersecurity',
    description: 'Stay safe at work without needing a technical background.',
    topics: [
      'Suspicious attachments',
      'Business email compromise',
      'Invoice fraud',
      'Safe file sharing',
      'Remote work security',
      'Protecting company information',
      'Reporting security incidents',
    ],
    lessonIds: ['workplace-attachments', 'workplace-bec', 'workplace-sharing', 'workplace-reporting'],
  },
  {
    id: 'careers',
    title: 'Cybersecurity Careers',
    description: 'Explore roles in security and how beginners often get started. No job guarantees.',
    topics: [
      'Security analyst',
      'Penetration tester',
      'Incident responder',
      'Security engineer',
      'Digital forensics',
      'Governance, risk, and compliance',
      'Defensive and offensive security',
      'Beginner cybersecurity learning roadmap',
    ],
    lessonIds: ['careers-analyst', 'careers-roadmap'],
  },
]

export const lessons = {
  'basics-intro': {
    id: 'basics-intro',
    pathId: 'basics',
    title: 'What cybersecurity means',
    duration: 5,
    intro: 'Cybersecurity is about protecting your information, devices, and accounts from people who want to steal, trick, or misuse them.',
    example: 'You get a message that looks like your bank. It asks you to "verify" your account on a link. Cybersecurity thinking means pausing, checking the sender, and not clicking until you are sure.',
    explanation: 'Most attacks target people, not complex systems. Attackers rely on urgency, fear, and habit. Good security is mostly about noticing odd details and slowing down.',
    quiz: {
      question: 'What is the main goal of everyday cybersecurity?',
      options: [
        'Protect information, devices, and accounts from misuse',
        'Learn to write computer code',
        'Replace all passwords every day',
        'Avoid using the internet entirely',
      ],
      correctIndex: 0,
      feedback: 'Correct. For most people, cybersecurity is about protecting yourself online, not becoming a programmer.',
    },
    takeaway: 'Cybersecurity protects you, your data, and your accounts. Small habits matter more than perfect tools.',
    nextLessonId: 'basics-threats',
  },
  'basics-threats': {
    id: 'basics-threats',
    pathId: 'basics',
    title: 'Common digital threats',
    duration: 4,
    intro: 'Most online threats fall into a few familiar categories: scams, stolen passwords, unsafe links, and apps that collect too much data.',
    example: 'A friend posts that they "found your photo" with a link. The post looks real, but the link leads to a fake login page.',
    explanation: 'Threats often look normal. Scams imitate brands you trust. Malware often arrives as a download you did not expect. Privacy risks hide in app permissions you tap through.',
    quiz: {
      question: 'Which is a common sign of a scam?',
      options: [
        'Urgent language pushing you to act immediately',
        'A message from a company you have never heard of only',
        'Plain text with no links',
        'An email that arrives on a weekday',
      ],
      correctIndex: 0,
      feedback: 'Right. Urgency is one of the most common tricks. Scammers want you to react before you think.',
    },
    takeaway: 'If something pushes you to hurry, slow down. That pause is your best defense.',
    nextLessonId: 'passwords-strong',
  },
  'passwords-strong': {
    id: 'passwords-strong',
    pathId: 'passwords',
    title: 'Strong passwords',
    duration: 5,
    intro: 'A strong password is long, unique, and hard to guess. It should not be reused across sites.',
    example: 'You use the same password for email and shopping. If the shop gets breached, attackers may try that password on your email too.',
    explanation: 'Length beats cleverness. A passphrase like "river-coffee-guitar-window" is easier to remember and harder to crack than "P@ssw0rd1". Never reuse passwords on important accounts.',
    quiz: {
      question: 'What makes a password stronger?',
      options: [
        'Long, unique, and not reused on other accounts',
        'Your birthday with an exclamation mark',
        'The same password everywhere so you remember it',
        'A short password you change every week',
      ],
      correctIndex: 0,
      feedback: 'Correct. Length and uniqueness matter most. Reusing passwords is one of the fastest ways accounts get compromised.',
    },
    takeaway: 'Use long unique passwords on important accounts. A password manager makes this practical.',
    nextLessonId: 'passwords-mfa',
  },
  'passwords-mfa': {
    id: 'passwords-mfa',
    pathId: 'passwords',
    title: 'Multi-factor authentication',
    duration: 4,
    intro: 'Multi-factor authentication (MFA) adds a second check after your password, such as a code on your phone.',
    example: 'Someone steals your email password. With MFA on, they still need the code from your phone to get in.',
    explanation: 'MFA means "something you know" plus "something you have". Even if a password leaks, the account stays protected if the second factor is enabled.',
    quiz: {
      question: 'Why is MFA useful?',
      options: [
        'It helps protect an account even if the password is stolen',
        'It removes the need for any password',
        'It only works on work computers',
        'It guarantees you will never be hacked',
      ],
      correctIndex: 0,
      feedback: 'Correct. MFA adds a second layer. It is one of the most effective steps for everyday users.',
    },
    takeaway: 'Turn on MFA for email, banking, and social accounts first.',
    nextLessonId: 'phishing-email',
  },
  'phishing-email': {
    id: 'phishing-email',
    pathId: 'phishing',
    title: 'Email phishing',
    duration: 6,
    intro: 'Phishing emails try to look legitimate so you click a link, open an attachment, or share login details.',
    example: 'An email says your package could not be delivered. The link goes to a site that copies a real courier page and asks for payment details.',
    explanation: 'Check the sender address carefully. Hover over links before clicking. Real companies rarely ask for passwords by email. When in doubt, open the official app or website yourself.',
    quiz: {
      question: 'What should you do with a suspicious email?',
      options: [
        'Do not click links; verify through the official website or app',
        'Reply and ask if it is real',
        'Forward it to everyone in your contacts',
        'Click the link but do not enter any details',
      ],
      correctIndex: 0,
      feedback: 'Correct. Verify independently. Do not use links or phone numbers from the suspicious message.',
    },
    takeaway: 'Treat unexpected emails as untrusted until you verify them another way.',
    nextLessonId: 'phishing-fake-login',
  },
  'phishing-fake-login': {
    id: 'phishing-fake-login',
    pathId: 'phishing',
    title: 'Fake login pages',
    duration: 5,
    intro: 'Fake login pages copy real sites to steal usernames and passwords.',
    example: 'A page looks like your email provider, but the web address is slightly wrong, like "maill-google.com" instead of "mail.google.com".',
    explanation: 'Look at the full URL in your browser bar. Check for misspellings and odd domains. Bookmark important login pages so you use the real one every time.',
    quiz: {
      question: 'How can you spot a fake login page?',
      options: [
        'The web address does not match the real company domain',
        'The page uses blue buttons',
        'The page loads slowly',
        'The page asks for a username',
      ],
      correctIndex: 0,
      feedback: 'Right. The domain is the key clue. When unsure, type the address yourself or use a bookmark.',
    },
    takeaway: 'Bookmark login pages for services you use often. Never trust login links from random messages.',
    nextLessonId: 'privacy-personal',
  },
  'privacy-personal': {
    id: 'privacy-personal',
    pathId: 'privacy',
    title: 'Personal information',
    duration: 5,
    intro: 'Personal information is anything that identifies you or could be used to impersonate you.',
    example: 'A quiz app asks for your birth date, city, and first pet name. Those details are often used in security questions elsewhere.',
    explanation: 'Share less by default. Ask why an app needs each piece of data. Information you post publicly can be copied and reused in scams.',
    quiz: {
      question: 'Which counts as sensitive personal information?',
      options: [
        'Full name, birth date, and phone number combined',
        'Your favourite colour alone',
        'The weather in your city',
        'A public news headline',
      ],
      correctIndex: 0,
      feedback: 'Correct. Combined personal details help attackers impersonate you or answer security questions.',
    },
    takeaway: 'Share personal details only when necessary, and review privacy settings regularly.',
    nextLessonId: 'devices-updates',
  },
  'devices-updates': {
    id: 'devices-updates',
    pathId: 'devices',
    title: 'Software updates',
    duration: 4,
    intro: 'Updates fix security holes in your phone, laptop, and apps. Postponing them leaves known gaps open.',
    example: 'Your phone shows "Update available" for two weeks. That update may patch a flaw attackers already know about.',
    explanation: 'Turn on automatic updates when possible. Update browsers and operating systems promptly. If an app is no longer supported, consider replacing it.',
    quiz: {
      question: 'Why do software updates matter for security?',
      options: [
        'They often fix known security flaws',
        'They only add new emojis',
        'They slow down your device on purpose',
        'They are optional decorations',
      ],
      correctIndex: 0,
      feedback: 'Correct. Updates are a basic but essential security habit.',
    },
    takeaway: 'Keep devices and apps updated. It is one of the easiest wins for everyday security.',
    nextLessonId: 'workplace-attachments',
  },
  'workplace-attachments': {
    id: 'workplace-attachments',
    pathId: 'workplace',
    title: 'Suspicious attachments',
    duration: 5,
    intro: 'Attachments can hide malware or links to fake sites. At work, one wrong click can affect the whole organisation.',
    example: 'An invoice arrives from an unknown sender with a file named "Urgent_Payment.exe". Real invoices rarely arrive as executable files.',
    explanation: 'Expect files from people you know, about topics you were already discussing. Verify unexpected attachments through another channel before opening.',
    quiz: {
      question: 'What is the safest first step with an unexpected attachment?',
      options: [
        'Confirm with the sender through a known contact method',
        'Open it to see what is inside',
        'Forward it to your whole team',
        'Disable your antivirus first',
      ],
      correctIndex: 0,
      feedback: 'Correct. Verification beats curiosity when an attachment was not expected.',
    },
    takeaway: 'Unexpected attachments deserve a quick check before you open them.',
    nextLessonId: 'careers-analyst',
  },
  'careers-analyst': {
    id: 'careers-analyst',
    pathId: 'careers',
    title: 'Security analyst',
    duration: 6,
    intro: 'Security analysts monitor systems and alerts to spot suspicious activity. Many beginners enter security through analyst roles.',
    example: 'An analyst reviews login alerts, notices logins from unusual countries, and escalates a possible account takeover.',
    explanation: 'Analyst work focuses on detection and response. It suits people who like patterns, documentation, and steady problem solving. Paths vary by company and country. No course guarantees a job.',
    quiz: {
      question: 'What does a security analyst often do?',
      options: [
        'Review alerts and investigate suspicious activity',
        'Design video game characters',
        'Write marketing copy only',
        'Install home appliances',
      ],
      correctIndex: 0,
      feedback: 'Correct. Analyst roles are a common entry point into cybersecurity teams.',
    },
    takeaway: 'Cybersecurity careers are broad. Explore roles that match your interests. Learning takes time and practice.',
    nextLessonId: 'careers-roadmap',
  },
  'careers-roadmap': {
    id: 'careers-roadmap',
    pathId: 'careers',
    title: 'Beginner learning roadmap',
    duration: 5,
    intro: 'Most beginners start with everyday security habits, then add structured learning in areas like phishing, passwords, and workplace safety.',
    example: 'You play the free Iterali game, notice you miss phishing clues, then work through short lessons on email scams and fake login pages.',
    explanation: 'There is no single perfect path. Build foundations first: safe browsing, strong accounts, spotting scams. Then explore specialised topics based on your goals. Results depend on your effort and opportunities.',
    quiz: {
      question: 'What is a sensible first step toward a security career?',
      options: [
        'Build strong everyday security habits and structured basics',
        'Skip fundamentals and buy advanced hacking tools',
        'Assume one short course guarantees employment',
        'Avoid hands-on practice entirely',
      ],
      correctIndex: 0,
      feedback: 'Correct. Foundations and consistent practice matter more than shortcuts.',
    },
    takeaway: 'Learn steadily, practice regularly, and explore roles over time. No single lesson guarantees a career outcome.',
    nextLessonId: null,
  },
}

export function getLessonMeta(id) {
  const lesson = lessons[id]
  if (lesson) return lesson
  return null
}

export function getPathById(pathId) {
  return learningPaths.find((p) => p.id === pathId)
}

export function getPathProgress(pathId, completedIds) {
  const path = getPathById(pathId)
  if (!path) return 0
  const available = path.lessonIds.filter((id) => lessons[id])
  if (!available.length) return 0
  const done = available.filter((id) => completedIds.includes(id)).length
  return Math.round((done / available.length) * 100)
}

export function getAllLessonIds() {
  return Object.keys(lessons)
}
