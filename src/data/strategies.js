export const strategyDimensions = [
  {
    id: 'ST1',
    name: 'Engagement & Capability Verification',
    definition: 'Assess candidates through sustained contribution provenance, live demonstrations, and project-specific tasks that verify commitment, comprehension, and practical ability beyond proposal quality.',
    strategies: [
      {
        id: 'ST-S2.1',
        name: 'Longitudinal engagement-based selection',
        definition: `Select contributors based on months of verifiable work (merged PRs & demonstrated skills), participation, and interaction — not just polished proposals ("judge before they apply")`,
        respondentCount: 8,
        representativeCodes: [
          {
            code: 'Skill-evidence requirement (merged PRs per skill)',
            source: 'P1 · 18:06–18:33, 21:37–22:17',
            quote: `Proposal must list >=2 merged PRs per required skill with links; missing = "automatically out."`,
          },
          {
            code: 'Proposal-template compliance filter',
            source: 'P1 · 19:03–19:09, 20:52–21:14',
            quote: `AI-generated proposals not in the org's required template "were automatically rejected" — 200 proposals filtered in ~1 hour.`,
          },
          {
            code: 'Internal-team membership prerequisite',
            source: 'P1 · 23:05–23:37',
            quote: 'Must join an internal tech team before proposing, so org observes communication and reliability.',
          },
        ],
      },
      {
        id: 'ST-S2.2',
        name: 'Live comprehension & coding interviews',
        definition: 'A synchronous comprehension or live-coding check with screen-share, scenario tasks, or verbal explanation to test whether the person, not the AI, can perform.',
        respondentCount: 4,
        representativeCodes: [
          {
            code: 'Planned synchronous interviews',
            source: 'P1 · 12:00–12:14',
            quote: `"Next years... we will try to conduct interviews before selecting... are they really strong enough without AI."`,
          },
          {
            code: 'Live-coding video interviews',
            source: 'P3 · 24:05–24:47',
            quote: `Don't go by applications — video interviews with screen sharing, scenario-based questions, "make them write the code in front of us in the editor."`,
          },
          {
            code: 'Progessive selection II: interview',
            source: 'P5 · 14:05–14:50',
            quote: `"If we think that the micro task is good, then we give you an interview... [asking] how did you solve the problem [and] how much familiarity with the code base."`,
          },
        ],
      },
      {
        id: 'ST-S2.3',
        name: 'Project-specific, AI-resistant selection tasks',
        definition: `Redesign selection / entry tasks that require understanding of the project's own processes so a prompt cannot trivially solve them — stagger and deepen good-first-issues, curate them, or use deep-end tasks with close mentoring.`,
        respondentCount: 7,
        representativeCodes: [
          {
            code: 'Curated tasks resist AI',
            source: 'P3 · 25:51–27:07',
            quote: `Curated good-first-issues; even if AI is used it's "to generate a part of the logic, not the entire logic"; no redesign needed — needs a human touch to judge.`,
          },
          {
            code: 'Progessive selection I: proposal + microtasks',
            source: 'P5 · 12:54–14:05',
            quote: `Newcomers have to post their proposal and complete micro tasks, "so that we can verify that they actually know our project."`,
          },
          {
            code: 'Deep-end pedagogy over good-first-issues',
            source: 'P7 · 38:00–39:39',
            quote: `Abandoned good first issues: "They will drown at first for sure... we want people to experience difficulty" — with intensive mentor support.`,
          },
        ],
      },
    ],
  },
  {
    id: 'ST2',
    name: 'Human-Centered Assessment & Judgment',
    definition: 'Review and evaluation strategies that keep acceptance decisions human and focus judgment on explainable comprehension and observable quality rather than inferred AI authorship.',
    strategies: [
      {
        id: 'ST-S5.2',
        name: 'Heuristics for triage, not verdict',
        definition: '[Detection heuristics as routing (never verdicts)]\nUse folk-forensic cues (oversized PRs, comment bloat, style mismatch, wrong summaries, cutoff-date idioms) or code-similarity / provenance checks to route attention and licensing review — never to auto-reject. Several mentors doubt AI-detecting-AI.',
        respondentCount: 4,
        representativeCodes: [
          {
            code: 'Folk forensics for AI detection',
            source: 'P5 · 27:33–28:29',
            quote: `Cutoff-date symptoms (outdated dependency versions), emoji use, "a lot of dashes that normal human keyboard doesn't have."`,
          },
          {
            code: 'AI detection impossible, heuristics + hard proof',
            source: 'P7 · 25:18–26:05',
            quote: `"Next to impossible to confidently attribute something being AI generated"; heuristics (compiles, modest scope); ban enforced on definitive proof.`,
          },
          {
            code: 'Oversized-PR detection heuristic',
            source: 'P10 · 17:54–19:18',
            quote: `Mentor knows the expected solution: "if the PR is a lot bigger than what it should be, then it literally screams of AI."`,
          },
        ],
      },
      {
        id: 'ST-S5.3',
        name: 'Explanation test at review',
        definition: `[Detection by dialogue]\nIn review, ask 'why did you do it this way?'; inability to explain — not AI use — is the disqualifier. For example, Before issue assignment, require the contributor to reproduce the issue locally and submit a short video of the working local fix.`,
        respondentCount: 5,
        representativeCodes: [
          {
            code: 'Pre-assignment local-fix gate with video proof',
            source: 'P1 · 15:24–15:42',
            quote: `Before being assigned an issue: reproduce locally, describe approach, list files, provide "video proof that I have fixed it on my local system."`,
          },
          {
            code: 'Explanation test + demo + private tests',
            source: 'P3 · 28:47–30:07',
            quote: `"We ask them to explain the code, give a demo... run our integration tests. If they can explain it and it works, it is impossible to tell it was AI generated."`,
          },
          {
            code: 'Detection by dialogue + non-accusatory inquiry promotes learning',
            source: 'P8 · 32:20–34:49',
            quote: `"I'll ask.. why did you choose to do it this way If they can't answer that, then... [it is] a sign... [bloated code and extensive comments raise suspicions]... But I don't accuse them immediately... it's through a discussion... 'How did you check it?'... that's when you can have a learning relationship."`,
          },
        ],
      },
      {
        id: 'ST-S5.6',
        name: 'Human-led verification',
        definition: '[Human final review / refuse to outsource verification to AI]\nKeep the final acceptance judgment human; mentors read and understand the code themselves and refuse to trust AI to validate contributions.',
        respondentCount: 4,
        representativeCodes: [
          {
            code: 'Personal review gate for AI output',
            source: 'P2 · 42:17–43:47',
            quote: `"Whatever I implement with the AI, it has to go through a review process before even pushing it to GitHub."`,
          },
          {
            code: 'Human validation of code logic due to limited trust in AI',
            source: 'P3 · 33:36–35:13',
            quote: `Regrading the use of AI for validation, "I'll not have that confidence... we might mark a bad contributor as pass... until I go and see the code and understand the logic" — old-school human judgment.`,
          },
          {
            code: 'Case-by-case AI code acceptance',
            source: 'P6 · 31:54–33:50',
            quote: `No unilateral ban: AI code "reviewed like anything else... if it looks acceptable, like if someone else were to write it, it'll be accepted."`,
          },
        ],
      },
      {
        id: 'ST-S6.1',
        name: 'AI-aware evaluation criteria',
        definition: 'Evaluate observable quality-associated aspects (e.g., functionality, maintainability, reproducibility, code smell, and demonstrated comprehension) instead of line count or AI authorship',
        respondentCount: 3,
        representativeCodes: [
          {
            code: 'Judge by contribution quality, not authorship',
            source: 'P3 · 37:03–37:15',
            quote: `"Whether it has been generated by AI, whether it has been human written... if things are working fine, then people are happy with it."`,
          },
          {
            code: 'Measure working quality, not line count',
            source: 'P9 · 19:08–20:36',
            quote: `"[GitHub seems] to be equating... large lines of code as a metric of success. That's not good... A good metric would be: does it work? How much of your code is duplicated?"`,
          },
          {
            code: 'Judge code quality, not AI use',
            source: 'P15 · 27:47–28:11',
            quote: `"Code quality... is more important than flagging someone for using AI."`,
          },
        ],
      },
    ],
  },
  {
    id: 'ST3',
    name: 'Governance & policy',
    definition: 'Multi-level rules and infrastructure for AI use and manage machine-speed contribution volume across projects, organizations, the program, and platforms.',
    strategies: [
      {
        id: 'ST-G.1',
        name: 'AI-use disclosure & accountability',
        definition: 'Require or enable disclosure and process accountability via AI guidelines, accountability devices (self-certification, bot traps, prompt disclosure), acknowledgement checkboxes, or agent histories — with debate over how far prompt disclosure helps.',
        respondentCount: 4,
        representativeCodes: [
          {
            code: 'AI disclosure policy',
            source: 'P4 · 20:06–20:10, 21:10–22:13, 23:50–24:37',
            quote: 'Org-specific AI policy: use allowed, disclosure required; on disclosure "we run an extra set of tests" to "make sure that there are no undesirable changes"',
          },
          {
            code: 'Disclosure as accountability mirror',
            source: 'P4 · 24:51–25:24',
            quote: `"Holding up a mirror... I am telling this person I've used AI. Now if I don't read my code, they're going to say... So now I'm going to go read my code."`,
          },
          {
            code: 'PR acknowledgment checkbox',
            source: 'P4 · 29:47–30:07',
            quote: '“When you\'re creating a PR, I want a checkbox that says I have read this code and I know what it does.”',
          },
        ],
      },
      {
        id: 'ST-G.2',
        name: 'Calibrated Conditional-use Policy',
        definition: 'Establish and iteratively refine project-specific boundaries for AI use, permitting bounded uses where contributors demonstrate understanding, explainability, verification, ownership, quality, and project fit — "AI as assistant, not owner".',
        respondentCount: 8,
        representativeCodes: [
          {
            code: 'Policy: AI as assistant, not owner',
            source: 'P1 · 12:54–13:41',
            quote: `"You are using AI as your assistant. AI is not your owner." If contributors' responses to review comments are automated or they doesn't know, "we point that out. If this behavior repeats, we close the PR."`,
          },
          {
            code: 'Allow AI with understanding + Conditional-use instructions',
            source: 'P2 · 4:10–4:17, 32:40–33:03',
            quote: `"We do follow a practice that always recommend to use AI as long as you know what you are working on and how it is working" with written instructions to contributors on expected AI use.`,
          },
          {
            code: 'Policy: use AI for learning, you control the AI',
            source: 'P2 · 31:51–32:20',
            quote: `"For the sake of the project, we just follow a sample practice: use AI to help you learn what you are working on...You control the AI, you don't let the AI control you." `,
          },
        ],
      },
      {
        id: 'ST-G.3',
        name: 'Targeted AI restrictions with carve-outs',
        definition: '[Restrictive / ban policy with carve-outs & norm preservation]\nRestrict or ban AI-generated code in specific artifacts (e.g., fully generated proposals / code / communication / styling & formatting) or stages (e.g., onboarding) while allowing bounded uses such as documentation, L2-language help, or review.',
        respondentCount: 6,
        representativeCodes: [
          {
            code: 'Human-communication norm',
            source: 'P2 · 26:02–26:41',
            quote: `"AI content is AI content... we do prefer that we communicate in a human way."`,
          },
          {
            code: 'No AI in onboarding',
            source: 'P3 · 25:00–25:16',
            quote: `"For onboarding newcomers, we are not using any AI... at least, as of now."`,
          },
          {
            code: 'Preserve project code style',
            source: 'P3 · 31:44–32:25',
            quote: `Only project-side concern: AI must not change the project's established code style/conventions — "it should remain the same."`,
          },
        ],
      },
      {
        id: 'ST-G.5',
        name: 'Multilevel AI goverance, coordination & shared learning',
        definition: 'Coordinate AI responses across organizations and GSoC via resource allocation, shared guidance, policy experiments, and education, while preserving local autonomy.',
        respondentCount: 4,
        representativeCodes: [
          {
            code: 'Share program-level guideline, preserve org fit',
            source: 'P2 · 40:12–41:06',
            quote: `"[GSoC] may come up with a guideline [for AI usage]... but each and every organization is differently structured. They follow their own rules along with the GSoC rules... generalized practices could be spread along."`,
          },
          {
            code: 'Collect feedback before the program-level intervention',
            source: 'P10 · 32:16–32:46',
            quote: `"It is good that [GSoC]... collect feedback. I think it's the first step; jumping into the solution is probably the worst thing to do..."`,
          },
          {
            code: 'Program-level AI disclosure form',
            source: 'P12 · 23:51–25:00',
            quote: `"At the program level... require a strict form where the mentee discloses in what capacity they're using AI... [so that] eases the burden from each community individually enforcing those rules"`,
          },
        ],
      },
      {
        id: 'ST-G.7',
        name: 'Platform submission throttling',
        definition: 'Rate-limit agent-driven submissions or cap concurrent open PRs so machine-speed contribution volume remains aligned with human review capacity.',
        respondentCount: 2,
        representativeCodes: [
          {
            code: 'Rate-limit agent-driven PR submissions',
            source: 'P11 · 34:23–35:17',
            quote: `"Rate limiting agents on the submission of pull requests... Contributors... submit one pull request [to] 100 organizations at the same time... limiting that somehow would be helpful."`,
          },
          {
            code: 'Cap concurrent open PRs per contributor',
            source: 'P13 · 17:55–18:29',
            quote: '“GitHub could… limit how many open pull requests a person can have… [until one is merged].”',
          },
        ],
      },
    ],
  },
  {
    id: 'ST4',
    name: 'AI-assistance',
    definition: 'Operational uses of AI while humans retain final responsibility.',
    strategies: [
      {
        id: 'ST-G.6',
        name: 'AI-assisted mentoring & operations',
        definition: 'Beyond stage-specific gates, use AI for proposal & issue triage, flagging AI use, onboarding, debugging, documentation, progress management, first-pass review (with second-pass human review), summaries, or other operations, while humans retain responsibility.',
        respondentCount: 10,
        representativeCodes: [
          {
            code: 'AI-powered triage dashboard built by mentor',
            source: 'P1 · 28:42–30:34',
            quote: `Mentor built dashboard tracking unanswered issues/team health "with very less effort, and it's working so good."`,
          },
          {
            code: 'AI-assisted documentation with human review',
            source: 'P1 · 33:08–33:41',
            quote: `For "full-fledged docs, I just give my idea", and [AI] gives [content] according to my way... it has cut a significant amount of time for writing the complete docs and fix the grammar."`,
          },
          {
            code: 'CodeRabbit as first-pass reviewer',
            source: 'P1 · 34:23–34:50',
            quote: `"The first pass is done by CodeRabbit mostly... it cuts down the first task."`,
          },
        ],
      },
    ],
  },
  {
    id: 'ST5',
    name: 'Human-AI Learning Balance',
    definition: 'Make responsible AI use part of learning while preserving human accountability and ownership.',
    strategies: [
      {
        id: 'ST-S4.3',
        name: 'Responsible AI use modeling & coaching',
        definition: 'Support contributors to use AI responsibly — read/verify everything generated, keep architecture human, test, disclose — as explicit mentoring curriculum or implicitly modeling practices.',
        respondentCount: 6,
        representativeCodes: [
          {
            code: 'Human writes crux, AI formats',
            source: 'P2 · 29:16–29:49',
            quote: `"It is easier for humans to write down the whole crux of what particular thing we are working on... if someone wants to format it in a better way using AI...", so AI-assisted issue/PR writing is acceptable.`,
          },
          {
            code: 'Balance AI fluency with learning in response to AI trend',
            source: 'P2 · 33:03–33:49',
            quote: `"One principle of GSoC is that we want people to learn... [not] to be completely dependent upon AI... [but] we also want them to use AI because AI is going to be in trend... we don't want them to get backtracked."`,
          },
          {
            code: 'Use AI for learning and deep understanding',
            source: 'P7 · 31:37–32:24',
            quote: `Contributors should use AI tools "transformatively to understand the deep intricacies of algorithms … not just to get your evaluations through... [and] not fool yourself into vibe coding."`,
          },
        ],
      },
    ],
  },
  {
    id: 'ST6',
    name: 'Relational safeguarding',
    definition: 'Selection practices that safeguard trust and fairness by weighting honesty. When appropriate, clarification or a corrective second chance is allowed.',
    strategies: [
      {
        id: 'ST-S2.4',
        name: 'Honesty-weighted selection with reconsideration',
        definition: 'Weight honesty and rule-following about AI use in selection, where undisclosed / rule-breaking AI use lowers priority while borderline / called-out candidates may receive a chance to redo.',
        respondentCount: 4,
        representativeCodes: [
          {
            code: 'Deprioritize rule-breaking AI users',
            source: 'P6 · 23:15–23:50',
            quote: `Postgres mentors "did try not to select folks who were using AI... to compensate for the abundance of applicants clearly using AI" without following rules.`,
          },
          {
            code: 'Call-out with second chance',
            source: 'P9 · 26:01–26:22',
            quote: `"Some of [AI-generated proposals] came back and rewrote it. And I was like, okay, this is fine" — deterrence plus redemption.`,
          },
          {
            code: 'Slop-filtering + second chance',
            source: 'P11 · 13:15–13:54',
            quote: `Committee marked AI-slop proposals unfit; stack-ranked the rest; borderline authors "given a chance to improve those proposals."`,
          },
        ],
      },
    ],
  }
];
