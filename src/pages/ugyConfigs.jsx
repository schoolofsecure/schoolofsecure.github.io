// Case configurations
import React from 'react'
export const ugy1Config = {
  level: 1,
  title: "Night at the Museum",
  badge: "Museum - night shift",
  headerTitle: "Night at the Museum - Case #1",
  narrativeTitle: "Night at the Museum - Case #1",
  narrativeText: "In the empty halls, only the sensors blink. Traces of movement in the archive, but the timeline is missing. The conservator says it's \"just a little tidying up\" - we disagree.",
  isDynamic: false,
  totalTasks: 5,
  images: ['/images/1a.jpg', '/images/1b.jpg', '/images/1c.jpg', '/images/1d.jpg', '/images/1e.jpg'],
  nextLevelRoute: "/ugy2",
  nextLevelText: "Continue to Midnight Handshake",
  specialComponents: { wordSearch: true, matchTable: true, archive: true },
  tasks: [
    {
      step: 0,
      title: "Task 1",
      leftTitle: "Cipher",
      leftContent: (
        <>
          <p className="muted">
            It's midnight, and an encrypted message has arrived unexpectedly from the museum server.<br /><br />
            Strange characters flicker on the screen, as if someone hurried to hide the message.<br /><br />
            <code>Zdwfk rxw, Crol pljkw eh d vhfuhw djhqw.</code><br /><br />
            The security team is stumped, but you, a fresh cyber investigator, are ready to dig in.
          </p>
          <div className="statusline">
            Decrypt the message to uncover the first clue in your mission.
            The display flashes, the lines begin to blink… every character hides another clue.
            If you succeed, you'll advance through the encrypted network and the next piece of evidence awaits.
          </div>
        </>
      ),
      rightTitle: "Answer",
      placeholder: "message…",
      expectedAnswer: (val, norm) => {
        const expected = 'Watch out, Zoli might be a secret agent.';
        return norm(val) === norm(expected);
      },
      hint: (
        <>
          <p className="muted" style={{margin:'8px 0 0'}}>
            Think about the alphabet, and imagine each letter stepping a little forward or back in the line.
            Spaces and punctuation stay the same. Try to unravel the secret message hidden among the characters.
          </p>
          <div className="hint-chips" aria-hidden="true">
            <span className="hint-chip">rot‑3</span>
            <span className="hint-chip">shift‑3</span>
            <span className="hint-chip">A↔X, B↔Y, C↔Z</span>
            <span className="hint-chip">Caesar</span>
          </div>
        </>
      ),
      difficulty: 'easy'
    },
    {
      step: 1,
      title: "Task 2",
      leftTitle: "Corrupted system log",
      leftContent: (
        <>
          <p className="muted">As you step into the museum's security server room, the air hums with tension.</p>
          <p className="muted">The fans spin too fast, and trembling lines scroll across the monitors.</p>
          <p className="muted" style={{marginTop:'8px'}}>
            Technicians say someone accessed the system at night and "cleaned up" their tracks.
            But the hacker made a rookie mistake: they left behind an unfinished log file. They deleted the important parts,
            but couldn't cover up one pattern.
          </p>
          <p className="muted" style={{marginTop:'8px'}}>The end of the log file flickers before you:</p>
          <div className="console float-soft" aria-label="System log">
            <span className="line"><span className="ts">2025-11-21 09:02:14</span> <span className="lvl info">INFO</span>  <span className="kv">ConnectionID=Cd0f94be7ac21f44f...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:17</span> <span className="lvl warn">WARN</span>  <span className="kv">LoginToken=L57ac90b32df1a...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:20</span> <span className="lvl info">INFO</span>  <span className="kv">UserHash=Uaa12f8c0bffe942...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:24</span> <span className="lvl error">ERROR</span> <span className="kv">EventRef=Ec21f9ee8b1127c3...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:28</span> <span className="lvl info">INFO</span>  <span className="kv">SessionID=Sd991e0bc113fe0...</span></span>
            <span className="line"><span className="ts">2025-11-21 09:02:32</span> <span className="lvl alert">ALERT</span> <span className="kv">KeyRef=Kb019aaef9e13cc1...</span></span>
          </div>
          <div className="statusline" style={{marginTop:'10px'}}>
            Collect the first letters of the log line values,
            read them together as a keyword, then enter it in the field.
          </div>
        </>
      ),
      rightTitle: "Answer",
      placeholder: "keyword…",
      expectedAnswer: (val, norm) => {
        const v = norm(val).replace(/[\s\-_.]/g,'');
        return v === 'CLUES';
      },
      hint: (
        <p className="muted" style={{margin:'8px 0 0'}}>
          Watch the key‑value pairs. Every value's leading character matters for the next task.
          Collect these characters and assemble the password!
          (Explanation: a "key‑value pair" looks like "Name=Secure" - the left side is the key, the right side is the value.)
        </p>
      ),
      difficulty: 'medium'
    },
    {
      step: 2,
      title: "Task 3",
      leftTitle: "Encrypted letter",
      leftContent: (
        <>
          <div className="card" style={{background:'#0b121c', borderColor:'rgba(207,230,255,0.12)'}}>
            <p className="muted" style={{whiteSpace:'pre-line', margin:0}}>
Dear stranger!

I was supposed to meet you at the café at eight o'clock today,
but in three moments time slipped away.

Every minute I think of you,
and seven steps away I feel your closeness.

First come the moments that live most strongly within me.
Then comes the feeling that first moved my heart.
The next signs hide in the tremors of the space stretched between us.
Finally, a single fleeting minute draws the full picture of the story.

Best regards, S.</p>
          </div>
          <div className="statusline" style={{marginTop:'10px'}}>
            Enter the 4-digit key code - the letter whispers the answer.
          </div>
        </>
      ),
      rightTitle: "Answer",
      placeholder: "4 digits…",
      expectedAnswer: (val, _norm) => {
        const v = String(val||'').replace(/\D/g,'');
        return v === '3871';
      },
      okText: "Good call. Continue when you are ready.",
      errText: "Common under time pressure. Watch the numbers hidden in words and their order.",
      hint: (
        <p className="muted" style={{margin:'8px 0 0'}}>
          Watch the letter's subtle hints - certain words hide the key signs behind them.
          The secret of the order lies in the rhythm of the story: only if you read it carefully does the code come together.
        </p>
      ),
      difficulty: 'medium'
    },
    {
      step: 3,
      title: "Task 4",
      leftTitle: "Encoded letters",
      leftContent: (
        <>
          <p className="muted" style={{margin:'8px 0 10px'}}>
            In one of the museum's archived data packets, investigators found a strange text grid.<br /><br />
            Technicians believe someone deliberately hid keywords in it that point to a breach of the system.
            The pattern is too orderly to be random.<br /><br />
            The security team asks you to find the hidden words — they lead to the next clue.<br />
            But be careful: the attacker always leaves a false trail to mislead investigators.
          </p>
          <div className="ws-wrap">
            <div className="ws-board">
              <div id="wsGrid" className="ws-grid"></div>
            </div>
            <div className="ws-words">
              <strong>Words to find:</strong>
              <ul id="wsList" style={{margin:'8px 0 0 16px', padding:0}}></ul>
              <div id="wsDone" className="ws-done">Done!</div>
            </div>
          </div>
          <div className="statusline" style={{marginTop:'10px'}}>
            Highlight the hidden words in the grid.
            The first letters of the found words become numbers - read the four digits together as a code.
          </div>
        </>
      ),
      rightTitle: "Code",
      placeholder: "4 digits…",
      expectedAnswer: (val, _norm) => {
        const v = String(val||'').replace(/\D/g,'');
        return v === '3542';
      },
      okText: "Good call. Continue when you are ready.",
      errText: "Common under time pressure. Find the words first, then turn their first letters into numbers.",
      hint: (
        <p className="muted" style={{margin:'8px 0 0'}}>
          Each word's first letter hides a number. Watch for the hidden keywords in the grid to reach the next code.
        </p>
      ),
      difficulty: 'hard',
      needsWordSearch: true
    },
    {
      step: 4,
      title: "Task 5",
      leftTitle: "Documenting clues",
      leftContent: (
        <>
          <p className="muted">HQ wants to know how closely you've been following the clues so far. A skilled cyber investigator organises every clue so it can be retrieved easily later.</p>
          <p className="muted">Document the clues from the previous four tasks! Write each clue on its own line and mark where it came from. You can only move on once all four clues are recorded correctly.</p>
        </>
      ),
      rightTitle: "Table",
      needsMatchTable: true,
      difficulty: 'hard'
    }
  ]
};

export const ugy2Config = {
  level: 2,
  title: "Midnight Handshake",
  badge: "Midnight Handshake",
  headerTitle: "Midnight Handshake - Case #2",
  narrativeTitle: "Midnight Handshake - Case #2",
  narrativeText: (
    <>
      <p>
        The museum's silence feels more unsettling tonight than last night. The camera system still stutters,
        and the network map shows unknown connections - ones that shouldn't exist.
      </p>
      <p>
        It seems the night intruder didn't just touch the machines, but is slowly trying to break into the entire system.
        If they go deeper, the museum's secrets could leak in moments. It's up to you to push back the attack.
      </p>
    </>
  ),
  isDynamic: true,
  totalTasks: 5,
  images: ['/images/2a.jpg', '/images/2b.jpg', '/images/2c.jpg', '/images/2d.jpg', '/images/2e.jpg'],
  nextLevelRoute: "/ugy3",
  nextLevelText: "Continue to Path of Shadows",
  specialComponents: {},
  taskLabels: {
    CAESAR: 'Encrypted whisper',
    VIGENERE: 'Key carousel',
    XOR: 'Flashing bits',
    HASH_MISMATCH: 'Slipped fingerprint',
    ICON_MEMORY: 'Symbol memory',
    PASSWORD_STRENGTH: 'Suspicious password change',
    PHISHING: 'Curatorial bait email',
    URL_TRUST: 'Gateway link inspection',
    LOG_ANALYSIS: 'Night log hunt',
    SOCIAL_ENGINEERING: 'Infiltrating request',
    FIREWALL: 'System connection hunter firewall',
    MISCONFIG: 'Hidden configuration error',
    RISKY_PERMISSION: 'Dangerous permission request',
    SECURITY_DECISION: 'Weighing the clues',
    CRYPTO_PUZZLE: 'Mini crypto mystery',
    PSEUDOCODE_BUG: 'Pseudocode trap',
    NETWORK_ANOMALY: 'Network sprawl',
    EMAIL_HEADER: 'Header X-ray',
    ATTACK_SCENARIO: 'Attack mosaic',
    ZERO_DAY: 'Zero-day dilemma'
  },
  taskImages: {
    PASSWORD_STRENGTH: '/images/2b.jpg',
    FIREWALL: '/images/2e.jpg',
    PHISHING: '/images/2c.jpg',
    SOCIAL_ENGINEERING: '/images/2a.jpg',
    SECURITY_DECISION: '/images/2d.jpg'
  },
  taskStories: {
    PASSWORD_STRENGTH: {
      title: 'Suspicious password change',
      text: `One of the system's admin accounts submitted an unusual password change request.

The request arrived exactly when the unknown "establish system connection" alert fired.

Now it's your turn to decide:

Does the proposed password meet security requirements, or is the attacker trying to slip weak authentication into the system?

Choose the safest decision to stop the attacker from gaining further access.`
    },
    FIREWALL: {
      title: 'System connection hunter firewall',
      text: `According to the firewall log, several external addresses unexpectedly moved to "allowed" status.
    If you lock down the wrong rule, the museum's critical sensors could go silent - but if you leave it open, the attacker could gain persistent access.

The visitor web kiosk was temporarily disconnected from the internal network, but it still serves the digital exhibition's web interface.

Allow the web protocols used by visitors, but keep the admin SSH channel closed so the kiosk can't be modified from outside.`
    },
    PHISHING: {
      title: 'Curatorial bait email',
      text: `A suspicious message appeared in a curator's inbox, supposedly from the internal technical department.

    Logs suggest the night attacker may have sent it to steal login credentials.

You can only stop the attack if you recognise the hidden signs.

Hidden messages wait among the log files for decryption. The system always leaves traces - you just have to find them.

A user reported a suspicious email.

Analyse the message content and identify phishing characteristics to stop the attack.`
    },
    SOCIAL_ENGINEERING: {
      title: 'Infiltrating request',
      text: `An urgent message arrived - supposedly from one of the museum's technicians. The tone is personal, rushed and asks for help.

But something isn't right. The wording is odd, and system logs show suspicious attempts from the sender's location before. This might be another attempt to get into the network through you.

Examine the message, analyse the request and decide:

Is this a genuine call for help, or just a manipulative attempt?

Choose the response that follows security protocol.`
    },
    SECURITY_DECISION: {
      title: 'Weighing the clues',
      text: `The system alerts: the attacker created a hidden system connection tunnel.

Now it's your turn to decide:

- Shut it down immediately, stopping them from going further?

- Or observe the activity to gather more information - accepting the risk that they may go deeper in the meantime?

Every choice affects what the attacker can access, and how much you learn about their methods.`
    }
  },
  unlockDate: '2025-12-06T19:00:00+01:00'
};

export const ugy3Config = {
  level: 3,
  title: "Path of Shadows",
  badge: "Path of Shadows",
  headerTitle: "Path of Shadows - Case #3",
  narrativeTitle: "Path of Shadows - Case #3",
  narrativeText: "A hidden route appears in the system, as if the attacker is building their own invisible path between servers. The logs feel like traps, yet they may hide important clues. It's up to you: follow the shadows, or close the path before they go deeper.",
  isDynamic: true,
  totalTasks: 5,
  images: ['/images/1a.jpg', '/images/1b.jpg', '/images/1c.jpg', '/images/1d.jpg', '/images/1e.jpg'],
  nextLevelRoute: "/ugy4",
  nextLevelText: "Continue to The Mystery Door",
  specialComponents: {},
  requiresPrevious: true, // Previous levels must be completed
  forcedTypes: ['VIGENERE', 'NETWORK_ANOMALY', 'EMAIL_HEADER', 'URL_TRUST', 'RISKY_PERMISSION'],
  forcedDifficulty: 'easy',
  taskLabels: {
    VIGENERE: 'Key carousel',
    NETWORK_ANOMALY: 'Network sprawl',
    EMAIL_HEADER: 'Header X-ray',
    URL_TRUST: 'Gateway link inspection',
    RISKY_PERMISSION: 'Dangerous permission request'
  },
  taskImages: {
    VIGENERE: '/images/1a.jpg',
    NETWORK_ANOMALY: '/images/1b.jpg',
    EMAIL_HEADER: '/images/1c.jpg',
    URL_TRUST: '/images/1d.jpg',
    RISKY_PERMISSION: '/images/1e.jpg'
  },
  taskStories: {
    VIGENERE: {
      title: 'Key carousel',
      text: `Deep in the system, a message encrypted with a Vigenère cipher lies hidden.
    
The key to the undelivered message is hidden somewhere in the system, and only the right decoding reveals its contents.
    
Decrypt the Vigenère cipher with the given key to find out what the message contains.`
    },
    NETWORK_ANOMALY: {
      title: 'Network sprawl',
      text: `While analysing network traffic, you found suspicious connections.
    
System logs show unknown sources trying to connect to the internal network.
    
Analyse the network traffic and identify anomalies to stop the attack.`
    },
    EMAIL_HEADER: {
      title: 'Header X-ray',
      text: `A reported email header contains strange redirects and hidden hops. The sender looks familiar, but the metadata tells a different story. Examine the clues before someone walks into the trap.`
    },
    URL_TRUST: {
      title: 'The gate that leads elsewhere',
      text: `The system detected a suspicious link just credible enough to pass itself off as safe. Shadows move behind the address. Decide whether it leads to a real destination or yet another deception.`
    },
    RISKY_PERMISSION: {
      title: 'Too many keys in one hand',
      text: `An application suddenly requests high permissions - ones it doesn't need for its task. Someone might slip through this gap. Decide whether to allow it or lock down access.`
    }
  }
};

// Template function for dynamic tracks
function createDynamicUgyConfig(level, title, badge, narrativeText) {
  const img = `/images/${level}.jpg`;
  const isLast = level === 12;
  return {
    level,
    title,
    badge,
    headerTitle: `${title} - Case #${level}`,
    narrativeTitle: `${title} - Case #${level}`,
    narrativeText,
    isDynamic: true,
    totalTasks: 5,
    images: Array(5).fill(img),
    nextLevelRoute: isLast ? "/aurora" : `/ugy${level + 1}`,
    nextLevelText: isLast ? "Back to Aurora" : "Next case",
    specialComponents: {},
    requiresPrevious: true,
    taskLabels: ugy2Config.taskLabels,
    taskImages: {
      CAESAR: img,
      VIGENERE: img,
      XOR: img,
      PHISHING: img,
      LOG_ANALYSIS: img
    },
    taskStories: ugy2Config.taskStories
  };
}

export const ugy4Config = {
  ...createDynamicUgyConfig(4, "The Missing Timeline", "Timeline - missing clues", "Gaps have appeared in the timeline. The clues suggest someone manipulated the order of events. Solutions from previous levels will be crucial to continue."),
  nextLevelText: "Continue to Book of Whispers",
  forcedTypes: ['PASSWORD_STRENGTH', 'FIREWALL', 'PHISHING', 'SOCIAL_ENGINEERING', 'SECURITY_DECISION'],
  forcedDifficulty: 'medium',
  shuffleTypes: true, // Shuffled order
  unlockDate: '2025-12-18T19:00:00+01:00'
};
export const ugy5Config = createDynamicUgyConfig(5, "Hidden Metadata", "Metadata - hidden information", "Hidden information surfaces in file metadata. Someone deliberately concealed important data that could be keys to the investigation.");
export const ugy6Config = createDynamicUgyConfig(6, "The Leaking Port", "Port - leaking connection", "Unusual traffic is detected on network ports. Someone is trying to break into the system through a vulnerable port.");
export const ugy7Config = createDynamicUgyConfig(7, "Double Identity", "Identity - dual role", "Traces of two different identities appear. Someone is disguising themselves and showing up in the system in multiple roles.");
export const ugy8Config = createDynamicUgyConfig(8, "The Broken Key", "Key - broken encryption", "Encryption keys are damaged or missing. Someone tried to break through the protection and left traces behind.");
export const ugy9Config = createDynamicUgyConfig(9, "The Interrupted Transfer", "Transfer - interrupted connection", "An important data transfer was cut off. The clues suggest someone deliberately disrupted the communication.");
export const ugy10Config = createDynamicUgyConfig(10, "The Phantom Profile", "Profile - phantom identity", "A phantom profile appeared in the system. Someone created an invisible identity revealed only by the smallest traces.");
export const ugy11Config = createDynamicUgyConfig(11, "The Stolen Shadow Account", "Account - stolen shadow", "A shadow account was stolen. Someone took another user's identity and is using it to break into the system.");
export const ugy12Config = createDynamicUgyConfig(12, "The Mastermind", "Mastermind - final mystery", "The final mystery. Every clue points to one place: identifying the mastermind. Everything is decided here.");

// Configurations map
export const ugyConfigs = {
  1: ugy1Config,
  2: ugy2Config,
  3: ugy3Config,
  4: ugy4Config,
  5: ugy5Config,
  6: ugy6Config,
  7: ugy7Config,
  8: ugy8Config,
  9: ugy9Config,
  10: ugy10Config,
  11: ugy11Config,
  12: ugy12Config
};
