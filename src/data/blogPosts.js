import { szatmariInterview } from './blogInterviewSzatmari.js'

/** Blog section filters (order on /blog). */
export const blogSections = ['Human', 'AI & Work', 'Cyber Careers', 'Digital Trust', 'Learning']

/** Blog posts for SEO / Resources. Interview first, then newest-first by date. */
export const blogPosts = [
  {
    slug: "ai-better-decisions-or-convincing-mistakes",
    section: "AI & Work",
    title: "Can AI Make Better Decisions Than You, or Just More Convincing Mistakes?",
    date: "2026-09-24",
    excerpt:
      "AI can be useful. It can also be wrong with unusual confidence. Judgement still has to sit with you.",
    seoTitle: "AI Decisions vs Convincing Mistakes | Iterali",
    seoDescription:
      "AI does not always make better decisions, sometimes it makes more convincing mistakes. Why useful output still needs human judgement.",
    body: [
      "There is a quiet hope floating around that AI will finally make cleaner choices than we do. Less bias. More data. Fewer bad mornings. Sometimes it helps. Sometimes it just dresses a shaky answer in calm language.",
      "The trick is not that the tools are useless. It is that fluency and correctness are easy to confuse. A clear paragraph can feel like a settled decision even when the grounding is thin.",
      "Take a simple work example. You ask for a summary of a long thread about a vendor risk. The summary is tidy. It names the main concern, suggests a next step, sounds fair. What it quietly drops is the one sentence where legal said “do not proceed until we see the new contract.” You might never notice, because the rest looks so finished.",
      "Or hiring. An AI rewrite of a job description sounds sharper. Then you realise it flattened the role into buzzwords and drifted from what the team actually needs. Helpful draft. Misleading if you treat it as truth.",
      "Security has the same pattern. A tool flags something as low risk in confident prose. Or suggests a response that sounds professional and slightly wrong. Speed is real. Ownership of the call is still human.",
      "I do not think the right move is to reject the tools. Use them to draft, sort, surface options. Then ask the dull questions: what did this leave out, what would change my mind, who gets hurt if this is wrong. Those questions are not anti-tech. They are how you keep your judgement in the room.",
      "AI can widen what you see. It cannot care about your context the way you do. When it sounds sure, check whether you feel informed, or just persuaded.",
      "Better decisions still come from noticing when an answer is smooth and unfinished. Confidence is not the same as being right.",
    ],
  },
  {
    slug: "deepfakes-changing-trust-job-interviews",
    section: "Digital Trust",
    title: "How Deepfakes Are Changing Trust in Job Interviews",
    date: "2026-09-21",
    excerpt:
      "Video and voice used to feel like proof. Generative AI makes that proof softer, especially in hiring.",
    seoTitle: "Deepfakes and Trust in Job Interviews | Iterali",
    seoDescription:
      "How deepfakes and generative AI are changing trust in job interviews, and how hiring can stay careful without panic.",
    body: [
      "For a long time, seeing someone’s face on a call felt like enough. Hearing their voice in a follow-up felt solid. That shortcut is getting less reliable, and hiring is one of the places where it shows.",
      "Deepfakes and generative voice tools do not need to be perfect to cause trouble. They only need to be good enough that a busy interviewer stops asking whether the person on screen is the person on the CV.",
      "This is not only about Hollywood-level fakes. It can be subtler. A candidate who looks slightly off in lighting. Lip movement that does not quite match the words. A voice note that sounds like them, but the pacing is oddly flat. Or a second-round call where the person seems… almost the same, and somehow not.",
      "Imagine a hiring manager on a video interview. The answers are strong. The face is clear. Halfway through, when the candidate turns, the background warps for a second, or the audio lags in a way that feels wrong. On a normal day you might ignore it. Now that small glitch is worth a second look, not panic, just verification.",
      "Companies are already dealing with impostors who pass early screens, then fall apart when asked to join a controlled call, show ID in a specific way, or complete a live task that cannot be fully scripted. The awkward part is cultural: nobody wants to accuse a real candidate of being fake. So people stay polite and slightly uneasy.",
      "Trust does not have to die here. It has to get more layered. Match what you see to other signals. Prefer live tasks over polished recordings. Confirm identity through more than one channel. Keep a human conversation that cannot be fully pre-generated, questions about a shared screen, a quick redraw of an idea, a follow-up that asks for thinking out loud.",
      "If you are a candidate, this shift can feel unfair. Clear process helps both sides. If you are hiring, calm checks beat dramatic suspicion.",
      "Seeing is no longer the whole story. Careful listening, small live proofs and a slower yes rebuild trust without turning interviews into interrogations.",
    ],
  },
  {
    slug: "ai-skills-gap-is-judgment-gap",
    section: "AI & Work",
    title: "The AI Skills Gap Is Really a Judgment Gap",
    date: "2026-09-18",
    excerpt:
      "Learning the tools matters. Knowing when to trust, question or stop matters more.",
    seoTitle: "The AI Skills Gap Is a Judgment Gap | Iterali",
    seoDescription:
      "The AI skills gap is often a judgment gap: when to trust results, when to ask, and when to stop, even without a technical background.",
    body: [
      "Everyone keeps talking about an AI skills gap. Usually they mean people who have not learned the tools yet. That is part of it. The quieter gap is judgement, knowing when an answer is solid enough to use.",
      "You can learn prompts in an afternoon. What takes longer is the habit of checking. Does this match what I already know? What is missing? Am I about to send something I do not actually understand?",
      "Tool skill without judgement looks like speed. Paste the output. Ship the email. Approve the summary. It feels modern. It can also spread a clean mistake across a whole team before anyone notices.",
      "Judgement sounds fancy. In practice it is small and a bit annoying. Read the source the model claims to lean on. Ask one follow-up that would break a weak answer. Stop when the stakes rise and you only have fluency, not evidence.",
      "You do not need a computer science degree for that. Teachers already check whether a neat explanation holds up. Nurses already distrust a tidy chart that does not match the patient. Ops people already know when a “simple” request is not simple. Those instincts transfer.",
      "If you are coming from a non-technical path, start there, not with every new model name. Learn one tool well enough to draft and explore. Build the pause that asks: would I defend this out loud to a sceptical colleague? If the answer is no, you are not behind. You are doing the job.",
      "The people who will be useful with AI are not the ones who never hesitate. They are the ones who know when hesitation is the skill.",
      "Learn the tools. Keep your judgement louder than the output. That combination travels further than either one alone.",
    ],
  },
  {
    slug: "burnout-bad-decisions-security-breaches",
    section: "Human",
    title: "Burnout, Bad Decisions, and Security Breaches: The Hidden Connection",
    date: "2026-09-15",
    excerpt:
      "Tired people miss cues. Overload makes risky clicks feel like chores. Security is partly about capacity.",
    seoTitle: "Burnout, Bad Decisions and Security Breaches | Iterali",
    seoDescription:
      "How burnout and overload connect to security mistakes, why tired people are more vulnerable online, without blame.",
    body: [
      "Security advice often assumes a rested person with time to think. A lot of real breaches start with someone who slept badly, has seventeen tabs open and just wants the notification to stop.",
      "Burnout does not make people stupid. It makes them narrower. You stop scanning for what feels off. You reach for the fastest yes. You reopen the same password manager muscle memory even when the page looks a little wrong. That is not laziness. That is a brain trying to conserve energy.",
      "Online risk loves that state. Urgent emails land harder when you already feel behind. A “quick approval” feels like relief, not a decision. The usual double-check gets skipped because double-checking feels like one more unpaid task.",
      "I have watched careful people click things they would never click on a calm Monday. Not because they forgot the training. Because at 6pm on a Friday their capacity was gone, and the message spoke to that emptiness: fix this now, help me now, do not slow the team down.",
      "So security is partly technical, patches, access, tools. It is also attention and mental room. Teams that pile on fear without reducing noise make the problem worse. People freeze or rush. Neither helps.",
      "If you manage others, notice overload as a security signal. If you are the tired one, a smaller rule helps: when you feel that hollow hurry, do not handle money, access or odd links until you have stood up for a minute. It sounds too simple. It works more often than another slide deck.",
      "You are not weak for being worn down. You are human. The safer habit is designing work, and your own pauses, around that fact.",
      "Protect your capacity the way you protect passwords. Both are part of staying safe.",
    ],
  },
  {
    slug: "7-ways-to-spot-ai-powered-scam",
    section: "Digital Trust",
    title: "7 Ways to Spot an AI-Powered Scam",
    date: "2026-09-12",
    excerpt:
      "AI made scams smoother. These seven checks still work when something feels a bit too polished or too urgent.",
    seoTitle: "7 Ways to Spot an AI-Powered Scam | Iterali",
    seoDescription:
      "Practical ways to spot AI-powered scams: urgency, perfect text, odd channels, verify separately, and more, in plain language.",
    body: [
      "Scams used to tip their hand with broken English and weird logos. AI cleaned a lot of that up. The tell is less “this looks fake” and more “this is pushing me in a familiar, slightly wrong way.” Here are seven checks I actually use.",
      "1. Urgency that skips your usual process. “Do this in the next ten minutes or we freeze the account.” Real problems can be urgent. Real organisations still have a normal path. If the message wants you outside that path, slow down.",
      "2. Text or voice that is oddly perfect. Smooth paragraphs. No typos. A voice that sounds like someone you know but a bit too even, like it never clears its throat. Polished is not proof. Flat perfection can be a clue.",
      "3. The channel is wrong. Your bank does not usually demand action in a random DM. Your CEO does not usually ask for gift cards in a side chat. Ask: would this person use this channel for this ask?",
      "4. Details that almost match. Right company colours, almost-right email domain, almost-right colleague name. “Almost” is doing a lot of work there. Hover, read the full address, do not trust the display name alone.",
      "5. Pressure against verification. “Don’t call anyone, just handle it here.” “Keep this quiet.” People who are legitimate rarely forbid you from checking. Scammers often do.",
      "6. A request that needs secrecy more than sense. Money movement, password “verification,” remote access software “so IT can help.” If the story needs you isolated, that is the story.",
      "7. Your body says wait. Tight chest, rush in the fingers, a sense you should act before you think. That feeling is information. Put the phone down. Open a bookmark. Call a known number. Use a second channel the message did not hand you.",
      "You will not catch every fake with a checklist. You will catch more of them by refusing to be hurried into a perfect-looking ask. When in doubt, verify outside the message. That one habit still beats most AI polish.",
    ],
  },
  {
    slug: "fewer-decisions-not-more-discipline",
    section: "Human",
    title: "You Don’t Need More Discipline, You Need Fewer Decisions",
    date: "2026-09-09",
    excerpt:
      "Online safety often fails when people are overloaded. Fewer choices can protect you better than more willpower.",
    seoTitle: "Fewer Decisions, Not More Discipline | Iterali",
    seoDescription:
      "Why online security fails under decision overload, and how fewer choices beat more discipline when requests and interruptions pile up.",
    body: [
      "We talk about security like it is a character test. Be more careful. Be more disciplined. Read every warning. That advice ignores what a normal day already feels like: too many pings, too many tabs, too many tiny choices before lunch.",
      "When the pile gets high, people do not become villains. They become efficient in the wrong way. They approve. They dismiss. They click through. Not because they love risk, because each extra decision has a cost, and the brain starts shopping for cheaper ones.",
      "This is why “just be vigilant” fails in busy teams. Vigilance is a limited resource. Attackers know that. So do bad interface designs, endless notifications and processes that ask for judgement twelve times an hour.",
      "Fewer decisions is not laziness. It is design. Use bookmarks instead of searching for login pages. Default to denying odd access requests until a known channel confirms. Batch the low-stakes stuff so the high-stakes stuff still has a clear head. Turn off alerts that do not deserve to interrupt you.",
      "Online, every “quick question” is also a pull on the same attention you need for the weird invoice and the strange link. If your day is made of interruptions, security becomes the thing you do when you have leftovers. Usually you do not.",
      "I used to think the fix was trying harder. Trying harder on an overloaded day is how you get a confident mistake. The better move was shrinking the number of moments where I had to invent a response from scratch.",
      "Build a few defaults you trust. Let discipline rest. Your future tired self will thank you for the smaller menu.",
      "You do not need a tougher personality. You need a day with fewer traps disguised as choices.",
    ],
  },
  {
    slug: "what-is-agentic-ai-security-risk",
    section: "AI & Work",
    title: "What Is Agentic AI, and Why Is It a Security Risk?",
    date: "2026-09-06",
    excerpt:
      "Agentic AI does not only answer, it takes steps. That power needs clear limits and human oversight.",
    seoTitle: "What Is Agentic AI and Its Security Risk | Iterali",
    seoDescription:
      "Agentic AI explained simply: when AI takes actions, not just answers, and why oversight matters for security.",
    body: [
      "Most people meet AI as a chat box. You ask, it replies. Agentic AI is different in one important way: it does not only talk. It can take steps, open tools, send messages, change settings, move through a workflow while you are doing something else.",
      "Think of the difference between asking a colleague for advice and giving them your keys with a to-do list. Advice is useful. Keys need trust and boundaries.",
      "A simple example. You tell an assistant to “tidy my inbox and chase unpaid invoices.” A chat model might draft emails for you to send. An agentic setup might actually send them, label threads, maybe pull data from another system. Helpful if it behaves. Messy if it misunderstands “chase” or talks to the wrong people.",
      "Another everyday picture: an agent booked to update a customer record, that also has permission to reset access. One wrong instruction, or one clever prompt from outside, and the action is real, not just text on a screen.",
      "That is the security point. When AI can act, mistakes leave the page. So do abuse cases. Someone tricks the agent. Someone over-scopes its permissions “just for convenience.” Someone forgets to log what it did. The risk is not mystical. It is ordinary: too much power, too little watching.",
      "You do not need to fear every new tool. You need the same habits you would use with a junior colleague who moves fast: clear limits on what it can touch, approval for sensitive steps, logs you can read, and a human who still owns the outcome.",
      "Ask a plain question before you switch an agent on: if this thing is wrong or nudged the wrong way, what can it break before anyone notices?",
      "Useful agents are supervised agents. The point of the tech is speed with a hand still on the rail.",
    ],
  },
  {
    slug: "ai-planned-my-workweek-what-it-got-wrong",
    section: "AI & Work",
    title: "I Let AI Plan My Workweek, Here’s What It Got Wrong",
    date: "2026-09-03",
    excerpt:
      "An AI calendar looked efficient. Real life pushed back, energy, surprises and actual priorities still mattered.",
    seoTitle: "I Let AI Plan My Workweek | Iterali",
    seoDescription:
      "What happened when AI planned a workweek: useful structure, missed energy levels, surprises and human limits, and a simple lesson.",
    body: [
      "I gave an AI my tasks, rough deadlines and the blank optimism of a Sunday evening. It returned a beautiful week. Colour-coded blocks. Sensible buffers. The kind of plan that makes you feel organised before you have done anything.",
      "Monday morning lasted about forty minutes.",
      "The plan assumed my brain peaks at the same time every day. Mine does not. It put deep work after a slog of meetings, as if focus were a tap. It stacked “quick” admin in the gaps, which is how quick admin becomes the whole afternoon. It did not know that one conversation can empty me for an hour, or that a good walk fixes more than another productivity tip.",
      "It also could not see the real priorities hiding under the listed ones. The urgent client thread that was not on my task list yet. The colleague who needed ten quiet minutes. The fact that shipping something half-right on Wednesday mattered more than finishing four neat boxes on the calendar.",
      "I am not saying the tool was useless. It spotted clashes I would have walked into. It forced me to admit how much I had pretended would “fit somehow.” That honesty helped. Treating the plan as law did not.",
      "What it got wrong, mostly, was me. Energy is not a spreadsheet. Surprises are not bugs in the schedule, they are the job. Human limits are not inefficiencies to optimise away.",
      "Now I let AI draft a skeleton. Then I edit like someone who has met myself before: move the hard thinking to when I am actually awake, leave air for the mess, cut anything that only looks responsible.",
      "Good planning is not only efficiency. It is a bit of self-knowledge with a calendar attached. The tool can hold the structure. You still have to know the person living inside the week.",
    ],
  },
  {
    slug: "resume-ai-ready-without-ai-washing",
    section: "Cyber Careers",
    title: "How to Make Your Résumé AI-Ready Without AI-Washing",
    date: "2026-08-31",
    excerpt:
      "Write so both humans and screening tools can follow you, without empty buzzwords or fake AI gloss.",
    seoTitle: "AI-Ready Résumé Without AI-Washing | Iterali",
    seoDescription:
      "Make your résumé AI-ready without AI-washing: clear experience, real skills and results in a human voice that screening tools can still parse.",
    body: [
      "“AI-ready” should not mean stuffing your CV with machine-sounding fluff. It means a human can skim it, and a screening tool can parse it, without either one bouncing off vague claims.",
      "Start with plain structure. Clear job titles, dates, and bullets that begin with what you did. Fancy formatting that looks like a magazine can confuse parsers. Simple sections travel better.",
      "Write skills as things you can defend in a conversation. “Used AI to draft customer replies and cut average handling time” beats “AI-powered synergy.” If you used a tool, name the task and the outcome. If you only watched a webinar, do not dress it up as production experience.",
      "Results help both sides. Numbers where you have them. Scope where you do not. “Reviewed access for 80 accounts each quarter” is clearer than “passionate about identity.” Hiring managers and keyword filters both like concrete language, for different reasons, same effect.",
      "Keep your voice. A résumé can be tidy without sounding like it was generated in one pass. Short sentences. Real verbs. No parade of soft adjectives. If a line could sit on anyone’s CV in your field, rewrite it until it could only be yours.",
      "For AI-related work, be specific about your role. Did you evaluate outputs, set limits, handle data carefully, train teammates, catch errors? That judgement is often what teams need. “Prompt engineer” with nothing underneath helps nobody.",
      "Before you send it, read it out loud. If you wince, the screening tool is not your main problem.",
      "Clarity is the hack. Say what you did, how you did it, and what changed, in language you would still own in an interview.",
    ],
  },
  {
    slug: "fake-video-call-million-dollar-fraud",
    section: "Digital Trust",
    title: "How a Fake Video Call Can Become a Million-Dollar Fraud",
    date: "2026-08-28",
    excerpt:
      "A familiar face on a call, a rush to move money, and process left behind, how trust and urgency can add up to serious fraud.",
    seoTitle: "Fake Video Call Million-Dollar Fraud | Iterali",
    seoDescription:
      "How a fake video call can enable major fraud: trust, urgency and apparent legitimacy, and a practical lesson for teams.",
    body: [
      "The call looks ordinary at first. A senior leader’s face. A known meeting link. A reason that sounds dull and important: a confidential deal, a tight deadline, a request to move funds outside the usual chain “just this once.”",
      "In cases like this, the technology is only half the story. The other half is human. Someone on the finance side recognises the face, or thinks they do. The voice matches well enough. The tone matches how that leader speaks when stressed. Questioning it feels like slowing a crisis.",
      "Urgency does the heavy lifting. There is no time for the second approval. There is no time to hang up and dial the number in the company directory. The story needs secrecy, speed and trust in what the screen is showing. Those three together are a known pattern. Under pressure they still work.",
      "Picture an employee who has never second-guessed this executive on a video call. The request is large. The explanation is almost boring, acquisitions are messy, banks are waiting, legal already knows. The employee complies. Later, when someone tries to confirm through another channel, the real executive has no idea what call.",
      "What failed was not only detection of a deepfake. Process failed. The organisation had a rule for large transfers. The rule lost to a face and a clock. Apparent legitimacy beat the checklist.",
      "These frauds scale because video still feels like presence. We are wired to treat a talking face as harder to invent than an email. That instinct is catching up with reality slowly.",
      "The practical lesson is unromantic. High-risk actions need a break in the magic of the call. Hang up. Use a known number. Require a second person. No confidential payment path that exists only inside one urgent meeting.",
      "If a face on a screen asks you to bypass the steps that protect money, the face is the least important part of the decision. The steps are the point.",
    ],
  },
  {
    slug: "urgency-makes-smart-people-ignore-security",
    section: "Human",
    title: "Why Urgency Makes Smart People Ignore Security Warnings",
    date: "2026-08-25",
    excerpt:
      "When something feels urgent, the brain takes shortcuts. Smart people are not exempt, they are busy.",
    seoTitle: "Why Urgency Overrides Security Warnings | Iterali",
    seoDescription:
      "Why urgency makes smart people ignore security warnings, mental shortcuts, everyday examples, and a calmer way to respond.",
    body: [
      "Smart people ignore security warnings all the time. Not because they think risk is fake. Because something else feels more real in the moment: a deadline, a boss, a customer waiting, a red badge that will not leave them alone.",
      "Urgency shrinks the frame. Your mind stops weighing options and starts clearing the obstacle. A browser warning becomes friction. A “are you sure?” dialog becomes noise. The goal is to get to the other side of the interruption so you can finish the thing that actually hurts if it slips.",
      "That shortcut is old and useful. It helped us move when hesitation was costly. Online, the same shortcut gets rented by anyone who can fake a clock. “Account locks today.” “Payment needed before 5.” “Reply before the audit.” Even when the deadline is invented, the feeling is local and physical.",
      "You have seen the everyday version. You are late to a call, a login fails, a reset link arrives, you are already annoyed. The page looks fine enough. You type. Later you realise you never checked the address. Or your phone buzzes with a delivery problem while you are juggling a child and a parcel. The button is big. The thinking is small.",
      "Training that only says “do not click” misses this. Under urgency, people are not debating policy. They are trying to make the discomfort stop. The warning has to be matched with a workable pause, a habit that fits inside the rush, not a lecture that assumes calm.",
      "One pause that works: when you feel the squeeze, change channel before you change anything important. Close the tab. Use a bookmark. Call a known number. The delay is tiny. It breaks the spell where speed feels like the only loyalty you have left.",
      "Being smart does not protect you from tunnel vision. Designing for the rushed version of yourself does.",
      "The warning was never the enemy. The false clock was. Take back thirty seconds, and a surprising number of bad requests fall apart on their own.",
    ],
  },
  {
    slug: "junior-cybersecurity-job-no-experience",
    section: "Cyber Careers",
    title: "How to find junior cybersecurity work when you have no experience",
    date: "2026-08-22",
    excerpt:
      "Junior security roles often ask for years you do not have. Here is a practical way in, including helping one or two hours a week.",
    seoTitle: "Junior Cybersecurity Job With No Experience | Iterali",
    seoDescription:
      "How to find junior cybersecurity work without experience: real small tasks, clearer CVs, and volunteering 1 to 2 hours a week for references.",
    body: [
      "You finished a course, a few labs, maybe a certification. Then you open the job board and every “junior cybersecurity” role wants two years in a SOC. It is a rotten loop, and a lot of people quit here.",
      "A few still get in. Not because they cracked some hidden hiring code. Mostly because they made themselves easier to trust with small, real security work.",
      "Start closer than the big job sites. Classmates, Discord servers, local meetups, people already in IT who know someone on a security team. Not “hire me as an analyst.” More like: who needs a hand with phishing simulations, access reviews, ticket notes, policy drafts, asset lists, anything that touches real risk without needing you to run the whole programme. Juniors often get their first yes from someone who already saw them show up, not from a cold CV alone.",
      "Keep the CV short. Put what you actually did: a home lab, a CTF weekend, a write-up of a phishing email you dissected, a small hardening checklist you ran on your own machine. Skip the buzzword fog. Security hiring managers skim. They notice when something concrete sticks.",
      "Apply anyway, even when you only match half the list. A lot of those “must have SIEM / must have IR” lines are wishful. A short note that sounds like a person helps more than a perfect template. Silence is normal. Ugly, but normal.",
      "If the applications go nowhere for a while, change the game. Find somewhere you can help one or two hours a week. A nonprofit with messy accounts, a small company with no security person, a community project, a school IT lead buried in tickets. Offer to sit with phishing reports, password basics, simple logging, user awareness, whatever they will actually let you touch. Call it volunteering, a tiny internship, or “I’ll come on Fridays.” You are there to learn on real problems, and to leave with a name who can say you were careful and useful.",
      "That reference can matter more than another certificate. And sometimes those unpaid hours turn into paid ones, because they already know how you work when nobody is grading your lab.",
      "You will feel behind. Most junior security people do. Waiting for a role that forgives zero experience rarely works. Collecting small proofs that you can show up, learn, and not make a mess works better.",
      "This week: message one person in security or IT, or find one place that would take two careful hours. Start there.",
    ],
  },
  szatmariInterview,
  {
    slug: "your-brain-is-the-new-attack-surface",
    section: "Human",
    title: "Your Brain Is the New Attack Surface",
    date: "2026-08-16",
    excerpt:
      "Modern cybercrime is less about breaking systems and more about nudging people. Attention, stress, trust and routine are the real targets.",
    seoTitle: "Your Brain Is the New Attack Surface | Iterali",
    seoDescription:
      "Why modern cybercrime is a psychological game: how attackers use attention, stress, urgency, trust and routine, and how to notice it.",
    body: [
      "Most people still picture hacking as someone typing in a dark room. Sometimes that happens. More often, the break-in starts with a feeling, a rush, a favour, a familiar name at a bad moment.",
      "Attackers did not suddenly get kinder. They got better at reading how we work when we are tired, busy or trying to help. Your attention is limited. Your trust has shortcuts. Your routines run on autopilot. That is not a character flaw. It is how brains survive a noisy day. It is also useful material for someone who wants you to click.",
      "Urgency is the classic move. “Reply now or the account locks.” “Boss needs this before the call.” The message is not asking you to think. It is asking you to hurry past thinking. Stress does the same job from the other side. When your inbox is on fire, a strange link looks like one more task to clear, not a question to sit with.",
      "Trust gets borrowed, not earned. A message that looks like it came from IT. A voice note that sounds almost like a colleague. A chat that uses the right first name and the right project. You are not being naive if that lands. You are pattern-matching, the way you do with every other message that turns out fine.",
      "Routine is quieter and just as powerful. Same login page shape, same “update your details” tone, same time of day you always approve invoices. Familiarity feels safe. That is why lookalike pages work, not because people are careless, but because the brain prefers the path it already knows.",
      "Picture this. You are between meetings. A Slack ping: “Quick, can you approve this vendor payment? I’m stuck in a call.” The name looks right. The tone sounds like them on a rushed day. You almost do it. Then something small itches: they never ask for payments in Slack. Or the account number is new. That itch is useful. It is your brain catching up with your hands.",
      "Or the email that arrives while you are packing up for the evening. Polite, slightly panicked, about a shared drive that “needs re-verification tonight.” You are already half out the door. Slowing down feels like being difficult. That feeling is part of the trap.",
      "None of this means you should distrust everyone. It means the attack surface is not only servers and passwords. It is the moments when you are asked to move before you check.",
      "Next time something online pushes hurry, favour or familiarity a little too hard, pause for one dull second. Ask who benefits if you skip the usual step. That small habit will not make you paranoid. It will make you harder to rush.",
    ],
  },
  {
    slug: "will-ai-replace-cybersecurity-professionals",
    section: "AI & Work",
    title: "Will AI replace cybersecurity professionals?",
    date: "2026-08-13",
    excerpt:
      "AI is speeding up parts of security work. People are still needed, here is what changes, and what is worth learning first.",
    seoTitle: "Will AI Replace Cybersecurity Professionals? | Iterali",
    seoDescription:
      "AI can speed up alerts and analysis, but cybersecurity still needs human judgement. What is changing, and what beginners should learn now.",
    body: [
      "Lately the same question keeps popping up: if AI can already sort alerts, summarise incidents and spot patterns, is there still room for humans in cybersecurity?",
      "Yes. Though the work will not stay the same.",
      "A lot of the dull sorting really is getting quicker. Tools can clear noise that used to eat half a morning. What they are less good at is sitting with a messy situation and deciding what matters. Is this alert a real problem, a harmless glitch, or something that needs people woken up at night? The tool can point. Someone still has to own the call when the picture is half-finished.",
      "Day to day, expect less copy-paste and more awkward questions. What are we looking at? Who gets hurt if we are wrong? Does this output feel solid, or did the tool skate past something obvious? You need enough technical grounding to read the room, and enough honesty to say when you do not.",
      "And AI is not only on the defender’s side of the desk. Firms are dropping it into customer chat, hiring, internal reports. Suddenly security has new stuff to worry about: the data going in, the models, the vendors. Attackers are using the same wave too, cleaner phishing, fake voices, faces that look real enough. The job is not vanishing. It is getting stranger.",
      "If you do not match the old “security person” stereotype, that is fine. Clear thinking, staying calm when something feels off, explaining risk without jargon, those skills always mattered. Teaching, legal, ops, design, customer work already train some of that. You still need the basics. You do not need a childhood spent in a server room.",
      "If I were starting again, I would not chase every new AI toy first. I would learn how phishing and social engineering show up on a normal Tuesday. Enough networking and access control that accounts stop feeling like magic. Real scenarios over flashcards. The habit of asking “how do we know?” when a tool sounds very sure. And saying the risk out loud in plain English, the way you would to a tired colleague.",
      "Use the tools. Just do not let them replace understanding. The useful people will be the ones who move faster with AI and still notice when the answer feels wrong.",
      "Waiting for things to settle before you begin will not help much. Pick one practical thing this week and start there.",
    ],
  },
  {
    slug: "people-pleaser-online-stay-kind",
    section: "Human",
    title: "People pleaser online? Stay kind without saying yes too fast",
    date: "2026-08-11",
    excerpt:
      "Hate saying no? Urgent chats can pull a yes out of you before you think. A short pause keeps you kind, and a bit safer.",
    seoTitle: "People Pleaser Online? Stay Kind Without Instant Yes | Iterali",
    seoDescription:
      "Learn how people-pleasing makes urgent online requests harder to refuse, and how a simple 20-second pause keeps you kind while you decide more safely.",
    body: [
      "3:40pm. Phone buzzes. A colleague you like: “Quick one, can you approve this link before the call?” You are already halfway to yes. Helping feels good. Being the slow one in the thread does not.",
      "If that landed somewhere in your chest, you are not weird. Plenty of us grew up being useful and easy. Online, that reflex gets louder. Someone asks, and yes shows up before you have properly finished the message. I would not call it broken. I would call it care without a brake.",
      "The annoying part: real favours and risky ones often look the same. Friendly tone. Mild hurry. A feeling that pausing would be rude. In a hallway, fine. In a chat, that same rush is how people open things they would never open after a coffee.",
      "We say yes fast because silence feels awkward. Difficult? Unhelpful? Fussy about process? Speed papers over that. Most days the instinct keeps teams moving. It costs more when the ask is access, money, a file, a “just open this”. Kindness is not the bug. The autopilot is.",
      "Try this once today. When you feel the lean toward yes, put the phone down for twenty seconds. Count. In that gap, check three dull things: do you know this person in this channel, does the request match how you usually work, and can you confirm another way first, bookmark, separate message, quick call. You are not being difficult. You are staying kind without going blind.",
      "You can even type: “Happy to help, just checking the usual way, one sec.” Real colleagues wait. A lot of the bad asks are banking on you not waiting.",
      "You do not have to get colder. You need a slower first yes. Practise it once this week, on the smallest request that shows up. That is enough.",
    ],
  },
  {
    slug: "pause-before-you-continue",
    section: "Learning",
    title: "The most dangerous button is often “Continue”",
    date: "2026-07-23",
    excerpt:
      "We tap Continue to accept, connect or move on. A short pause before that click can reveal when something is off.",
    body: [
      "Ask someone what the riskiest button online is and they might name Delete, Confirm payment or Share location. The quieter answer is often Continue, the button we press without thinking.",
      "It shows up everywhere: to accept terms, link an account, grant access or simply leave a screen. Because it feels routine, we rarely stop to ask what we are agreeing to, which account we are using or whether the page is genuine.",
      "Before you continue, take one breath. Check the URL, the account shown and what the next step actually grants. That pause is often enough to notice when a familiar flow does not feel right.",
      "Safer habits start with a slower click. Pause before you continue.",
    ],
  },
  {
    slug: "spot-fake-login-pages",
    section: "Learning",
    title: "How to spot a fake login page",
    date: "2026-07-10",
    excerpt:
      "Look past the logo. Check the full URL, TLS details and urgency cues before you type a password.",
    body: [
      "Fake login pages copy familiar brands so people rush and skip basic checks. The first habit to build is slowing down when a message pushes you to verify now.",
      "Read the full address bar, not just the logo. Misspellings, odd subdomains and unexpected redirects are common tells. Prefer bookmarks for services you use often.",
      "If something feels off, close the tab and open the site from a known bookmark or the official app. That single pause is often enough to avoid credential theft.",
    ],
  },
  {
    slug: "safe-to-fail-security-practice",
    section: "Learning",
    title: "Why safe-to-fail practice beats one-off awareness videos",
    date: "2026-07-03",
    excerpt:
      "People learn security habits by deciding under pressure, then reviewing what they missed without blame.",
    body: [
      "Awareness videos can raise awareness, but they rarely change day-to-day decisions. People need repeated practice in realistic scenarios where mistakes are allowed.",
      "Safe-to-fail training lets learners try phishing, social engineering and unsafe shortcuts in a controlled environment. Feedback should explain the risk, not shame the person.",
      "Over time, structured challenges build pattern recognition: urgency language, lookalike domains and requests that skip normal process. That is the skill that transfers to work.",
    ],
  },
  {
    slug: "human-centred-security-teams",
    section: "Human",
    title: "Human-centred security for teams that are busy",
    date: "2026-06-26",
    excerpt:
      "Security habits stick when training respects real workflows instead of dumping policy walls.",
    body: [
      "Teams ignore security advice that fights how they actually work. Short, realistic scenarios tied to email, chat and access requests fit better than long policy dumps.",
      "Human-centred security assumes people want to do the right thing when the path is clear. Training should show the safer action in context, then reinforce it with practice.",
      "For managers, progress tracking helps spot gaps without turning every miss into a performance issue. Leaders see skill patterns, not individual mistake replays.",
    ],
  },
]
/** Calendar date YYYY-MM-DD in local time (scheduled posts use this). */
export function getBlogTodayIso(now = new Date()) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** In Vite dev (localhost) show scheduled posts too; production keeps the date gate. */
function showUnpublishedBlogPosts() {
  try {
    return Boolean(import.meta.env && import.meta.env.DEV)
  } catch {
    return false
  }
}

export const BLOG_PREVIEW_KEY = 'anita'

export function isValidBlogPreviewKey(key) {
  return typeof key === 'string' && key.trim().toLowerCase() === BLOG_PREVIEW_KEY
}

export function isBlogPostPublished(post, today = getBlogTodayIso()) {
  if (!post?.date) return false
  if (showUnpublishedBlogPosts()) return true
  return post.date <= today
}

/** Calendar publish only, ignores Vite DEV (used for password gate). */
export function isBlogPostPublicByDate(post, today = getBlogTodayIso()) {
  return Boolean(post?.date && post.date <= today)
}

/** Raw lookup, includes scheduled posts (for password gate). */
export function findBlogPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null
}

/** Posts visible on the public blog list (date today or earlier). */
export function getPublishedBlogPosts(today = getBlogTodayIso()) {
  return blogPosts.filter((post) => isBlogPostPublished(post, today))
}

/**
 * Public article access. Scheduled posts need a valid preview unlock (not URL alone).
 * @param {string} slug
 * @param {{ today?: string, unlocked?: boolean }} [options]
 */
export function getBlogPost(slug, options = {}) {
  const today = options.today || getBlogTodayIso()
  const post = findBlogPostBySlug(slug)
  if (!post) return null
  // Public by calendar date, or unlocked preview session.
  if (isBlogPostPublicByDate(post, today)) return post
  if (options.unlocked) return post
  return null
}

export function getLatestBlogPosts(limit = 3, today = getBlogTodayIso()) {
  return getPublishedBlogPosts(today).slice(0, limit)
}

export function getFeaturedBlogPost(today = getBlogTodayIso()) {
  const published = getPublishedBlogPosts(today)
  return published.find((post) => post.featured) || published[0] || null
}

function flattenBodyText(body = []) {
  return body
    .map((block) => (typeof block === 'string' ? block : block?.text || ''))
    .filter(Boolean)
    .join(' ')
}

export function getPostLocale(post, lang = 'en') {
  if (lang === 'hu' && post?.hu) {
    return {
      title: post.hu.title || post.title,
      subtitle: post.hu.subtitle || post.subtitle,
      excerpt: post.hu.excerpt || post.excerpt,
      body: post.hu.body || post.body,
      image: post.hu.image || post.image,
      imageAlt: post.hu.imageAlt || post.imageAlt,
    }
  }
  return {
    title: post?.title,
    subtitle: post?.subtitle,
    excerpt: post?.excerpt,
    body: post?.body || [],
    image: post?.image,
    imageAlt: post?.imageAlt,
  }
}

export function getReadingMinutes(post, wordsPerMinute = 200, lang = 'en') {
  const loc = getPostLocale(post, lang)
  const text = [loc.excerpt, flattenBodyText(loc.body)].filter(Boolean).join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
