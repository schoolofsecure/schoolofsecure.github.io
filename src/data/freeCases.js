/** First free practise path: Recognise risky logins */

export const freeLoginPath = {
  id: 'recognise-risky-logins',
  title: 'Recognise risky logins',
  totalSteps: 4,
  caseIds: ['session-expired', 'lookalike-domain', 'urgency-lockout', 'bookmark-habit'],
}

export const freeCases = {
  'session-expired': {
    id: 'session-expired',
    pathId: freeLoginPath.id,
    step: 1,
    title: 'Session expired',
    scenario: [
      'You are finishing a ticket on your laptop when a browser tab pops up: Microsoft 365. Session expired. Sign in to keep working.',
      'The logo looks familiar. The message says your session ends in 2 minutes and unsaved work may be lost.',
      'Your manager is waiting on chat. You need to get back in quickly.',
    ],
    prompt: 'What do you do?',
    options: [
      {
        id: 'enter-password',
        label: 'Enter my password now so I do not lose the work.',
        outcome: 'risk',
        feedback: {
          lead: 'Common under time pressure. Many people trust the logo and the countdown.',
          cue: 'Urgency (2 minutes) and a familiar brand.',
          riskOrSafe: 'Lookalike pages copy logos. The address bar is the real check.',
          miss: 'A near-perfect logo sitting on the wrong domain.',
        },
      },
      {
        id: 'check-url',
        label: 'Check the full URL first, then sign in only if it looks right.',
        outcome: 'safer',
        feedback: {
          lead: 'Good call. You used the right cue: the full address, not the logo.',
          cue: 'The address bar under time pressure.',
          riskOrSafe: 'Urgency is meant to stop you looking. A short URL check breaks that rush.',
          miss: 'Extra letters or an odd subdomain behind a familiar logo.',
        },
      },
      {
        id: 'use-bookmark',
        label: 'Close the tab and open Microsoft 365 from my usual bookmark.',
        outcome: 'safer',
        feedback: {
          lead: 'Good call. You chose a safer path when something felt off.',
          cue: 'Use a channel I already trust.',
          riskOrSafe: 'Bookmarks and official apps skip fake pages.',
          miss: 'Closing feels slow when a countdown is running. That pause is often the safer step.',
        },
      },
    ],
    next: {
      label: 'Next: practise 2 more login decisions with lookalike domains.',
      caseId: 'lookalike-domain',
    },
  },

  'lookalike-domain': {
    id: 'lookalike-domain',
    pathId: freeLoginPath.id,
    step: 2,
    title: 'Lookalike domain',
    scenario: [
      'A password-reset email says your work account will lock in 10 minutes unless you confirm.',
      'You click through. The page shows your company colours and asks for your email and password.',
      'In the address bar you glance at: login-microsft-secure.com/office.',
    ],
    prompt: 'What do you do?',
    options: [
      {
        id: 'sign-in',
        label: 'Sign in quickly before the account locks.',
        outcome: 'risk',
        feedback: {
          lead: 'Common when a lockout clock is ticking.',
          cue: 'Fear of being locked out and a page that “looks like work”.',
          riskOrSafe: 'The domain spelling is wrong. That is enough to stop.',
          miss: 'Missing letters in a brand name (microsft) behind a polished page.',
        },
      },
      {
        id: 'read-url',
        label: 'Stop and read the full URL carefully before typing anything.',
        outcome: 'safer',
        feedback: {
          lead: 'Good call. You checked the cue attackers hope you skip.',
          cue: 'The full domain spelling.',
          riskOrSafe: 'A lookalike domain is the main risk here, not the logo.',
          miss: 'Hyphens and “secure” words added to look official.',
        },
      },
      {
        id: 'official-channel',
        label: 'Close it and reset the password only through the official company portal.',
        outcome: 'safer',
        feedback: {
          lead: 'Good call. You moved the decision to a trusted channel.',
          cue: 'Do not type secrets on a page I did not open myself.',
          riskOrSafe: 'Official portals and IT help avoid lookalike traps.',
          miss: 'Email links that create the pressure to “confirm now”.',
        },
      },
    ],
    next: {
      label: 'Next: try a case focused on urgency cues before a lockout.',
      caseId: 'urgency-lockout',
    },
  },

  'urgency-lockout': {
    id: 'urgency-lockout',
    pathId: freeLoginPath.id,
    step: 3,
    title: 'Urgency before lockout',
    scenario: [
      'You are on a call when a chat ping arrives: “IT Security: unusual sign-in. Verify in the next 60 seconds or your access will be revoked.”',
      'There is a link labelled Verify account now.',
      'People on the call are waiting for your screen share.',
    ],
    prompt: 'What do you do?',
    options: [
      {
        id: 'click-verify',
        label: 'Click Verify account now so I do not lose access mid-call.',
        outcome: 'risk',
        feedback: {
          lead: 'Common when work and urgency collide.',
          cue: 'A short deadline and fear of losing access in front of others.',
          riskOrSafe: 'Real IT rarely forces a 60-second click through chat.',
          miss: 'Pressure designed to skip checking who sent the message.',
        },
      },
      {
        id: 'verify-sender',
        label: 'Pause the call briefly and check how IT normally contacts people.',
        outcome: 'safer',
        feedback: {
          lead: 'Good call. You protected the decision from the countdown.',
          cue: 'Does this match our normal IT channel?',
          riskOrSafe: 'Known processes beat surprise links in chat.',
          miss: 'Messages that invent a brand-new “verify now” path.',
        },
      },
      {
        id: 'ignore-finish',
        label: 'Ignore the chat for now and finish the call, then check with IT later.',
        outcome: 'safer',
        feedback: {
          lead: 'Good call when the pressure feels off.',
          cue: 'I can check this after the call without typing secrets.',
          riskOrSafe: 'Delaying a suspicious verify link is usually safer than rushing.',
          miss: 'Believing access will vanish in 60 seconds if you do not click.',
        },
      },
    ],
    next: {
      label: 'Next: lock in the bookmark habit for everyday logins.',
      caseId: 'bookmark-habit',
    },
  },

  'bookmark-habit': {
    id: 'bookmark-habit',
    pathId: freeLoginPath.id,
    step: 4,
    title: 'Bookmark habit',
    scenario: [
      'Tomorrow morning you need email, chat and the HR portal.',
      'You usually search or click links from messages to get there faster.',
      'After the last cases, you want a safer default when you are busy.',
    ],
    prompt: 'What becomes your default for work logins?',
    options: [
      {
        id: 'search-click',
        label: 'Keep searching and clicking links from email when I am in a hurry.',
        outcome: 'risk',
        feedback: {
          lead: 'Common when the day is full.',
          cue: 'Speed over a trusted path.',
          riskOrSafe: 'Search results and email links are easy places for lookalikes.',
          miss: 'Building a habit of opening tools only from bookmarks or the official app.',
        },
      },
      {
        id: 'bookmarks',
        label: 'Open email, chat and HR from bookmarks or the official apps.',
        outcome: 'safer',
        feedback: {
          lead: 'Good call. This is the habit that transfers to busy days.',
          cue: 'Start from a channel I already trust.',
          riskOrSafe: 'Bookmarks cut out many fake login pages before they appear.',
          miss: 'Treating “just this once” link clicks as harmless.',
        },
      },
      {
        id: 'mix',
        label: 'Use bookmarks for important tools, and links when a message looks urgent.',
        outcome: 'risk',
        feedback: {
          lead: 'A mix feels practical, and urgency is where traps land.',
          cue: 'Urgent messages still feel like an exception.',
          riskOrSafe: 'Attackers rely on that exception. Prefer bookmarks even when rushed.',
          miss: 'Keeping one rule for calm days and another for pressure.',
        },
      },
    ],
    next: {
      label: 'Next: go deeper on fake login pages in a short lesson.',
      lessonId: 'phishing-fake-login',
      learnPathId: 'phishing',
    },
  },
}

export function getFreeCase(caseId) {
  return freeCases[caseId] || null
}

export function getFirstFreeCaseId() {
  return freeLoginPath.caseIds[0]
}
