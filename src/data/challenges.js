export const categoryLabels = {
  B1: 'Signal loss',
  B2: 'Volume & burden',
  B3: 'Learning loss',
  B4: 'Trust & deception',
  B5: 'Governance, quality & risk',
};

export const literatureReferences = {
  vonKrogh2003: {
    label: 'von Krogh, Spaeth & Lakhani (2003)',
    url: 'https://doi.org/10.1016/S0048-7333(03)00050-7',
  },
  spence1973: {
    label: 'Spence (1973)',
    url: 'https://doi.org/10.2307/1882010',
  },
  dabbish2012: {
    label: 'Dabbish et al. (2012)',
    url: 'https://doi.org/10.1145/2145204.2145396',
  },
  steinmacher2015: {
    label: 'Steinmacher et al. (2015)',
    url: 'https://doi.org/10.1145/2675133.2675215',
  },
  fagerholm2014: {
    label: 'Fagerholm et al. (2014)',
    url: 'https://doi.org/10.1145/2652524.2652540',
  },
  laveWenger1991: {
    label: 'Lave & Wenger (1991)',
    url: 'https://doi.org/10.1017/CBO9780511815355',
  },
  balali2018: {
    label: 'Balali et al. (2018)',
    url: 'https://doi.org/10.1007/s10606-018-9310-8',
  },
  steinmacher2019: {
    label: 'Steinmacher et al. (2019)',
    url: 'https://doi.org/10.1007/s10606-018-9335-z',
  },
  silva2020: {
    label: 'Silva et al. (2020)',
    url: 'https://doi.org/10.1016/j.jss.2019.110487',
  },
  feng2024: {
    label: 'Feng et al. (2024)',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0950584924000752',
  },
};

export const pipelinePhases = [
  {
    id: 'entry',
    name: 'Entry & Selection',
    stageIds: ['S0', 'S1', 'S2'],
    color: '#bcd4e6',
    stageColor: 'rgba(214, 226, 233, 0.9)',
  },
  {
    id: 'participation',
    name: 'Mentored Participation',
    stageIds: ['S3', 'S4', 'S5'],
    color: '#c5dedd',
    stageColor: 'rgba(197, 222, 221, 0.9)',
  },
  {
    id: 'regeneration',
    name: 'Outcomes & Regeneration',
    stageIds: ['S6', 'S7'],
    color: '#dbe7d8',
    stageColor: 'rgba(219, 231, 216, 0.96)',
  },
];

export const pipelineStages = [
  {
    id: 'S0',
    name: 'Pre-engagement',
    diskLines: ['Pre-engagement'],
    phaseId: 'entry',
    whatHappens: 'Discovery, attraction, first informal contributions, pre-programs',
    pipelineDefinition:
      'Before formal application, prospective contributors discover GSoC and candidate organizations, explore project work, and may make low-risk informal contributions or join pre-program activities.',
    literatureTheme: 'Joining script; program attraction & motivations',
    primaryReferences: ['vonKrogh2003', 'silva2020'],
    additionalReferences: ['steinmacher2015'],
    literatureSupport:
      'The "joining script" grounds low-risk contributions before formal entry (von Krogh et al., 2003); GSoC participants also report experience and portfolio motivations (Silva et al., 2020), with newcomer barriers providing additional context (Steinmacher et al., 2015).',
  },
  {
    id: 'S1',
    name: 'Proposal preparation',
    diskLines: ['Proposal', 'preparation'],
    phaseId: 'entry',
    whatHappens: 'Scoping a plan; drafting and refining the application',
    pipelineDefinition:
      'Prospective contributors turn an idea into a scoped application by clarifying goals, deliverables, feasibility, and timing through proposal drafting and refinement.',
    literatureTheme: 'GSoC program structure; proposal as a plan',
    primaryReferences: ['silva2020'],
    additionalReferences: ['feng2024'],
    literatureSupport:
      'GSoC uses a time-bounded, stipended, proposal-driven program structure (Silva et al., 2020), while OSS mentoring research identifies practices for guiding proposal development (Feng et al., 2024).',
  },
  {
    id: 'S2',
    name: 'Review & selection',
    diskLines: ['Review &', 'selection'],
    phaseId: 'entry',
    whatHappens: 'Mentors and administrators assess proposals and choose contributors',
    pipelineDefinition:
      'Mentors and organization administrators assess proposal quality, feasibility, visible prior activity, and applicant readiness before selecting contributors under limited information.',
    literatureTheme: 'Selection signals under information asymmetry',
    primaryReferences: ['spence1973', 'dabbish2012'],
    additionalReferences: ['silva2020'],
    literatureSupport: 
      "Selection under limited information is a signaling problem (Spence, 1973); visible repository activity supports social inference in OSS (Dabbish et al., 2012), within GSoC's proposal-based selection structure (Silva et al., 2020).",
  },
  {
    id: 'S3',
    name: 'Bonding & onboarding',
    diskLines: ['Bonding &', 'onboarding'],
    phaseId: 'participation',
    whatHappens: 'Setup, documentation, first tasks, community entry',
    pipelineDefinition:
      'Selected contributors establish working relationships, configure tools and environments, learn project documentation and norms, and complete early tasks that support community entry.',
    literatureTheme: 'Newcomer barriers; mentored onboarding',
    primaryReferences: ['steinmacher2015', 'fagerholm2014'],
    additionalReferences: ['balali2018', 'steinmacher2019'],
    literatureSupport:
      'Newcomers face social and technical barriers around first contribution (Steinmacher et al., 2015; Balali et al., 2018), while deliberate mentoring supports onboarding (Fagerholm et al., 2014; Steinmacher et al., 2019).',
  },
  {
    id: 'S4',
    name: 'Coding & mentoring',
    diskLines: ['Coding &', 'mentoring'],
    phaseId: 'participation',
    whatHappens: 'The mentored learning loop: feedback, iteration, growth',
    pipelineDefinition:
      'Contributors implement the proposed work through repeated cycles of coding, questions, mentor feedback, revision, and increasing technical and community participation.',
    literatureTheme: 'Legitimate peripheral participation',
    primaryReferences: ['laveWenger1991', 'fagerholm2014'],
    additionalReferences: ['feng2024'],
    literatureSupport:
      'Legitimate peripheral participation frames learning as movement toward fuller participation (Lave & Wenger, 1991); OSS mentoring supports that feedback-and-iteration process (Fagerholm et al., 2014; Feng et al., 2024).',
  },
  {
    id: 'S5',
    name: 'Contribution review',
    diskLines: ['Contribution', 'review'],
    phaseId: 'participation',
    whatHappens: 'Reviewing and accepting contributions; building trust',
    pipelineDefinition:
      'Mentors and maintainers review contributions for correctness, project fit, maintainability, and trustworthiness before accepting the work or requesting changes.',
    literatureTheme: 'Contribution barriers; transparency & trust',
    primaryReferences: ['vonKrogh2003', 'dabbish2012'],
    additionalReferences: ['steinmacher2019'],
    literatureSupport:
      'OSS participation involves contribution barriers and acceptance decisions (von Krogh et al., 2003), while repository transparency enables reviewer inferences (Dabbish et al., 2012); barrier-reduction work adds implementation context (Steinmacher et al., 2019).',
  },
  {
    id: 'S6',
    name: 'Evaluation & graduation',
    diskLines: ['Evaluation &', 'graduation'],
    phaseId: 'regeneration',
    whatHappens: 'Milestones, completion, pass/fail judgment',
    pipelineDefinition:
      'Mentors assess progress against milestones and program expectations, make completion judgments, and determine whether the contributor graduates from the formal program.',
    literatureTheme: 'GSoC outcomes & completion',
    primaryReferences: ['silva2020'],
    additionalReferences: ['feng2024'],
    literatureSupport:
      'GSoC completion and outcome patterns ground this evaluation stage (Silva et al., 2020), while mentoring-practice research provides broader context for evaluation (Feng et al., 2024).',
  },
  {
    id: 'S7',
    name: 'Retention & role transition',
    diskLines: ['Retention &', 'role transition'],
    phaseId: 'regeneration',
    whatHappens: 'Staying on; contributor → mentor → organization administrator',
    pipelineDefinition:
      'After formal completion, contributors may remain active, deepen community membership, and transition into maintainer, mentor, or organization-administrator roles that renew the pipeline.',
    literatureTheme: 'Sustained participation; mentoring outcomes',
    primaryReferences: ['feng2024', 'laveWenger1991'],
    additionalReferences: ['silva2020'],
    literatureSupport:
      'Movement toward fuller participation supports sustained community membership (Lave & Wenger, 1991); mentoring research connects the stage to retention and regeneration (Feng et al., 2024), with GSoC outcome evidence providing additional context (Silva et al., 2020).',
  },
];

export const challenges = [
  {
    id: 'CH-S0.1',
    stageId: 'S0',
    category: 'B2',
    name: 'Industrialized application & contribution surge',
    definition:
      'Generative AI collapses the cost of applying and contributing, so organizations receive agent-generated PRs, issues, and mass proposal emails at volumes they are unprepared for, especially in small teams.',
    participantCount: 7,
    openCodeCount: 9,
    openCodes: [
      ['Pre-GSoC PR flood', 'P1 · 14:30–14:50'],
      ['Thousands of AI proposals at other organizations', 'P2 · 10:40–11:05'],
      ['More proposals, lower quality', 'P4 · 12:21–12:47'],
    ],
  },
  {
    id: 'CH-S0.2',
    stageId: 'S0',
    category: 'B1',
    name: 'Good-first-issues lose their sorting function',
    definition:
      'Entry tasks designed to onboard and identify capable newcomers are now solved by agents in minutes, so they no longer differentiate genuine interest or ability.',
    participantCount: 2,
    openCodeCount: 2,
    openCodes: [
      ['AI-assisted onboarding tasks lose learning value', 'P14 · 33:34–34:13'],
      ['Good-first-issues now redundant', 'P15 · 18:51–19:32'],
    ],
  },
  {
    id: 'CH-S1.1',
    stageId: 'S1',
    category: 'B1',
    name: 'Proposal effort collapse',
    definition:
      'Writing a proposal - once an effortful signal of engagement - now takes minutes; volume rises and applicants can spray many organizations, so the proposal stops indicating commitment.',
    participantCount: 6,
    openCodeCount: 8,
    openCodes: [
      ['AI application flood 8×', 'P3 · 22:12–22:59'],
      ['AI spams low-effort proposals', 'P5 · 11:34–12:14'],
      ['Copy-paste AI proposal artifacts', 'P5 · 20:45–21:59'],
    ],
  },
  {
    id: 'CH-S2.1',
    stageId: 'S2',
    category: 'B1',
    name: 'Proposal authenticity & capability uncertainty',
    definition:
      'AI-polished proposals and selection tasks look strong regardless of authorship or capability, so mentors cannot reliably tell whether an applicant can understand the work or deliver after selection.',
    participantCount: 5,
    openCodeCount: 10,
    openCodes: [
      ['AI-generated proposal from selected mentee', 'P1 · 10:48–11:15'],
      ['Uncertainty about proposal strength', 'P1 · 12:14–12:16'],
      ['Task-based selection lost differentiation', 'P8 · 18:56–19:56'],
    ],
  },
  {
    id: 'CH-S2.2',
    stageId: 'S2',
    category: 'B4',
    name: 'Application fraud & abuse',
    definition:
      'AI enables outright deception, such as fabricated capabilities, concealed employment, and plagiarized proposals, including applicants who cannot perform basic tasks.',
    participantCount: 3,
    openCodeCount: 4,
    openCodes: [
      ['Selection fraud case: Git-illiterate selectee', 'P4 · 31:15–32:28'],
      ['Application abuse enabled by AI', 'P6 · 18:27–21:06'],
      ['Proposal authorship doubt as plagiarism', 'P9 · 12:23–12:44'],
    ],
  },
  {
    id: 'CH-S4.1',
    stageId: 'S4',
    category: 'B3',
    name: 'The mentored learning loop goes quiet',
    definition:
      "Mentees stop asking questions and cannot explain their own work, removing the feedback loop through which mentors gauge and grow a mentee's understanding.",
    participantCount: 3,
    openCodeCount: 4,
    openCodes: [
      ['AI PR and debugging without understanding', 'P1 · 10:13–10:34'],
      ['Comprehension gap in AI-generated design', 'P1 · 31:20–31:57'],
      ['Question-asking decline hides thinking', 'P14 · 37:24–38:28'],
    ],
  },
  {
    id: 'CH-S4.2',
    stageId: 'S4',
    category: 'B3',
    name: 'Dependency & deskilling',
    definition:
      'Over-reliance on AI erodes skill formation: mentees can generate but not fix code, suffer identity or skill loss, and become blocked without the tool.',
    participantCount: 6,
    openCodeCount: 8,
    openCodes: [
      ['Contributor blocked by AI quota', 'P1 · 11:45–11:55'],
      ['Newcomers dependent on AI', 'P1 · 11:55–12:00'],
      ['Developer identity crisis', 'P5 · 34:15–34:43'],
    ],
  },
  {
    id: 'CH-S4.3',
    stageId: 'S4',
    category: 'B3',
    name: 'Loss of productive struggle / spirit of the program',
    definition:
      "AI removes the friction that produced learning; doing the majority of the work with AI defeats the mentoring program's developmental purpose.",
    participantCount: 2,
    openCodeCount: 3,
    openCodes: [
      ['AI displaces shared mentor–mentee learning', 'P7 · 35:15–36:16'],
      ['Struggle pedagogy', 'P7 · 41:17–42:10'],
      ['Spirit-of-the-program argument', 'P12 · 26:32–28:10'],
    ],
  },
  {
    id: 'CH-S4.4',
    stageId: 'S4',
    category: 'B4',
    name: 'Mentor role distortion & contributor deception',
    definition:
      'Mentors are pushed into policing and verifying AI output rather than teaching; some contributors deceive under bans, and AI-generated requirements disconnect from implementation.',
    participantCount: 5,
    openCodeCount: 6,
    openCodes: [
      ['Mentor points out prompt omissions', 'P1 · 31:44–31:57'],
      ['Code reviews become confrontation over AI', 'P6 · 27:43–28:11'],
      ['Contributor deception under AI ban', 'P7 · 16:00–16:40'],
    ],
  },
  {
    id: 'CH-S5.1',
    stageId: 'S5',
    category: 'B2',
    name: 'Machine-speed generation vs human-speed review & validation',
    definition:
      'AI writes code and expands feasible scope far faster than humans can review and validate it, inverting the review economy through huge PRs, compressed expectations, scope instability, and an unwinnable validation burden for volunteers.',
    participantCount: 3,
    openCodeCount: 10,
    openCodes: [
      ['5,000-line AI PRs, two-day review expectation', 'P1 · 26:29–26:46'],
      ['Bad-to-good PR ratio around 10:2 per day', 'P1 · 32:20–32:53'],
      ['Arms-race pressure on mentors', 'P1 · 38:47–38:59'],
    ],
  },
  {
    id: 'CH-S5.2',
    stageId: 'S5',
    category: 'B4',
    name: 'Trust erosion & authenticity-verification limits',
    definition:
      "Polished artifacts no longer reliably demonstrate the author's understanding, weakening trust and raising stress. AI detection is unreliable, heuristic, and potentially biased, so verification becomes costly.",
    participantCount: 9,
    openCodeCount: 14,
    openCodes: [
      ['Competent AI use is invisible', 'P3 · 27:36–28:17'],
      ["AI PRs weaken maintainers' trust and cause stress", 'P4 · 09:14–10:11'],
      ['Authenticity discrimination cost', 'P5 · 22:38–23:01'],
    ],
  },
  {
    id: 'CH-S5.3',
    stageId: 'S5',
    category: 'B2',
    name: 'Quality & maintenance debt',
    definition:
      'AI inflates documentation and modules, adds unreviewed dependencies, and produces unwelcome auto-generated contributions that burden long-term maintenance.',
    participantCount: 8,
    openCodeCount: 9,
    openCodes: [
      ['AI requirements disconnect', 'P3 · 39:56–41:39'],
      ['Documentation bloat', 'P4 · 22:19–22:58'],
      ['AI dumps stale dependency code', 'P5 · 27:33–28:08'],
    ],
  },
  {
    id: 'CH-S5.4',
    stageId: 'S5',
    category: 'B5',
    name: 'Reliability, security, quality',
    definition:
      'AI misses domain logic, invents facts, introduces regressions or vulnerabilities, and can produce plausible but unexecutable or unsafe code.',
    participantCount: 5,
    openCodeCount: 7,
    openCodes: [
      ['AI misses domain-specific logic', 'P2 · 37:16–38:07'],
      ['Unreviewed PRs pose security threats', 'P2 · 43:52–44:12'],
      ['AI fails low-level languages and interfaces', 'P8 · 36:23–36:48'],
    ],
  },
  {
    id: 'CH-S5.5',
    stageId: 'S5',
    category: 'B5',
    name: 'AI review limitations & fallacies',
    definition:
      'AI review catches surface issues but cannot replace human judgment and can cause false positives, false confidence, or sunk costs that make later acceptance or rejection harder.',
    participantCount: 3,
    openCodeCount: 3,
    openCodes: [
      ['AI review catches syntax but not complex domain logic', 'P2 · 38:59–39:02'],
      ['AI review lacks mentor trust', 'P3 · 34:16–35:13'],
      ['Sunk-cost review trap', 'P13 · 18:37–18:56'],
    ],
  },
  {
    id: 'CH-S6.1',
    stageId: 'S6',
    category: 'B5',
    name: 'Wobbling evaluation criteria',
    definition:
      'Mentors face recurring, unresolved disputes over whether and how to fail contributors for AI-guideline violations, destabilizing evaluation.',
    participantCount: 1,
    openCodeCount: 1,
    openCodes: [['Mailing-list controversy on failing AI users', 'P12 · 14:23–14:53']],
  },
  {
    id: 'CH-S7.1',
    stageId: 'S7',
    category: 'B3',
    name: 'Attachment erosion (mentee retention)',
    definition:
      'Because AI removes the effort that builds investment, mentees form weaker attachment to the project and may be less likely to stay on as contributors.',
    participantCount: 1,
    openCodeCount: 2,
    openCodes: [
      ['AI raises learning and retention doubts', 'P13 · 29:03–29:50'],
      ['Investment-attachment-retention worry', 'P13 · 29:51–30:27'],
    ],
  },
  {
    id: 'CH-X.1',
    stageId: 'X',
    category: 'B5',
    name: 'Licensing & intellectual-property contamination',
    definition:
      'AI-generated code carries unclear provenance and license risk, including copyleft code entering permissive projects or output with uncertain copyright status - a recurring rationale for restrictions and bans.',
    participantCount: 4,
    openCodeCount: 7,
    openCodes: [
      ['License contamination fear', 'P5 · 28:53–30:22'],
      ['Training data lacks attribution', 'P7 · 03:30–03:54'],
      ['Copyright objection to AI code', 'P9 · 10:39–11:16'],
    ],
  },
  {
    id: 'CH-X.2',
    stageId: 'X',
    category: 'B5',
    name: 'Policy fragmentation & unenforceability',
    definition:
      'Platforms, the program, organizations, and mentors lack consistent, transferable, enforceable, and actionable rules for responsible AI use, disclosure, and bans; practice remains decentralized.',
    participantCount: 10,
    openCodeCount: 13,
    openCodes: [
      ['GSoC and mentors lack shared AI-use rules', 'P2 · 16:21–16:37'],
      ['Remote AI use cannot be controlled in OSS', 'P3 · 37:03–37:15'],
      ['Inconsistent AI rules across projects', 'P4 · 26:57–27:42'],
    ],
  },
  {
    id: 'CH-X.3',
    stageId: 'X',
    category: 'B5',
    name: 'Privacy, data leaks & platform control',
    definition:
      'Submitting community or private material to proprietary AI models risks confidentiality, data reuse, and loss of contributor control.',
    participantCount: 2,
    openCodeCount: 2,
    openCodes: [
      ['Private work leaks into proprietary AI models', 'P8 · 44:05–44:55'],
      ['Unwanted use of community code as training data', 'P14 · 51:48–53:31'],
    ],
  },
  {
    id: 'CH-X.4',
    stageId: 'X',
    category: 'B2',
    name: 'Cross-stage verification burden, fatigue & withdrawal',
    definition:
      'AI-amplified volume and uncertain authorship spread verification burden from screening through contribution review, eroding mentor enjoyment, patience, willingness to invest, and in extreme cases, organizational participation in GSoC.',
    participantCount: 11,
    openCodeCount: 16,
    openCodes: [
      ['AI makes maintainers busier', 'P1 · 31:00–31:13'],
      ['Instant proposals burden mentors and hinder selection', 'P4 · 12:47–13:47'],
      ['Universal effort increase', 'P4 · 32:44–33:13'],
    ],
  },
];

export const stageChallenges = challenges.filter((challenge) => challenge.stageId !== 'X');
export const crossCuttingChallenges = challenges.filter((challenge) => challenge.stageId === 'X');

export function getStageChallenges(stageId) {
  return stageChallenges.filter((challenge) => challenge.stageId === stageId);
}
