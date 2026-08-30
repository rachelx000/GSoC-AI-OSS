export const frameworkCitations = {
  'GSOC-SEL': {
    label: 'GSoC selection guidance',
    url: 'https://developers.google.com/open-source/gsoc/help/oa-tips',
  },
  'GSOC-ROLE': {
    label: 'GSoC roles',
    url: 'https://developers.google.com/open-source/gsoc/help/responsibilities',
  },
  'GSOC-AI': {
    label: 'GSoC AI guidance',
    url: 'https://developers.google.com/open-source/gsoc/resources/ai_guidance',
  },
  'OPENSSF-AI': {
    label: 'OpenSSF AI guide',
    url: 'https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions',
  },
  'NIST-RMF': {
    label: 'NIST AI RMF',
    url: 'https://doi.org/10.6028/NIST.AI.100-1',
  },
  'NIST-GAI': {
    label: 'NIST GAI Profile',
    url: 'https://doi.org/10.6028/NIST.AI.600-1',
  },
  'ISO-AIMS': {
    label: 'ISO/IEC 42001',
    url: 'https://www.iso.org/standard/81230.html',
  },
  'NIST-SSDF': {
    label: 'NIST SSDF',
    url: 'https://doi.org/10.6028/NIST.SP.800-218',
  },
  'OPENSSF-SSD': {
    label: 'OpenSSF secure development',
    url: 'https://best.openssf.org/Concise-Guide-for-Developing-More-Secure-Software',
  },
};

export const frameworkDimensions = [
  {
    id: 'selection',
    label: 'Selection',
    color: '#BCD4E6',
    citationIds: ['GSOC-SEL', 'GSOC-ROLE'],
  },
  {
    id: 'aiBoundary',
    label: 'AI boundary',
    color: '#FAD2E1',
    citationIds: ['GSOC-AI', 'OPENSSF-AI', 'NIST-RMF'],
  },
  {
    id: 'mentoringOperations',
    label: 'Mentoring operations',
    color: '#C5DEDD',
    citationIds: ['GSOC-ROLE', 'GSOC-AI', 'OPENSSF-AI'],
  },
  {
    id: 'qualityGates',
    label: 'Review / quality gates',
    color: '#EDDCD2',
    citationIds: ['NIST-SSDF', 'OPENSSF-AI', 'OPENSSF-SSD', 'GSOC-AI'],
  },
  {
    id: 'governance',
    label: 'Governance',
    color: '#D6E2E9',
    citationIds: ['NIST-RMF', 'NIST-GAI', 'ISO-AIMS', 'GSOC-ROLE'],
  },
];

export const strategyStances = [
  {
    id: 'prohibitionist',
    name: 'AI Prohibitionist',
    shortName: 'Prohibitionist',
    definition: 'Prohibit AI use in most artifacts with only explicit minor carve-outs.',
    interviewees: 'P7, P9',
    respondentCount: 2,
    decisionRule: "Use when AI authorship conflicts with the project's learning, provenance, licensing, or community norms; define the ban's exact artifacts and stages.",
    dimensions: {
      selection: 'Require sustained engagement, meaningful PRs, project-specific tasks, and/or live comprehension evidence before selection.',
      aiBoundary: 'No GenAI in the stated scope. If accessibility, translation, or non-generative AI use is allowed, name the carve-out explicitly.',
      mentoringOperations: 'Teach fundamentals and project workflows through human-authored work; Give policy examples before contributors begin.',
      qualityGates: 'Verify provenance, comprehension, tests, and license/security fit. Treat heuristics as triage only; Act on substantiated policy breach, not style suspicion.',
      governance: 'Publish scope, evidence threshold, consequence ladder, and appeal/corrective path; Monitor false-positive disputes and mentor load.',
    },
    strategyIds: 'ST-S2.1; ST-S2.3; ST-S2.4; ST-S4.3; ST-S5.2; ST-S6.1; ST-G.3',
    note: "Under-evidenced: two interviewees' proposed approaches varied in the extent of AI banning; needs additional evidence for refinement/validation.",
  },
  {
    id: 'skeptic',
    name: 'AI Skeptic',
    shortName: 'Skeptic',
    definition: 'Restrict AI use by default; expand only after evidence from responsible, bounded use.',
    interviewees: 'P4, P10, P14',
    respondentCount: 3,
    decisionRule: 'Default to restriction when learning, quality, licensing, or review risks are not controlled; expand use only through evidence from bounded pilots.',
    dimensions: {
      selection: 'Prioritize contribution history and explanation. Route suspicious artifacts for closer review without treating detection cues as verdicts.',
      aiBoundary: 'Use an approved task/tool list, typically comprehension, language help, tests, debugging, or non-decisional administrative support; Restrict generated core logic by default.',
      mentoringOperations: 'Teach fundamentals first, then verification literacy; Require contributors to disclose and explain where AI helped and what they checked.',
      qualityGates: 'Require human final review, explanation tests, CI/security/license checks, and additional validation for materially AI-assisted changes.',
      governance: 'Document disclosure expectations and pilot criteria; Stop or tighten use when rework, defects, learning loss, or reviewer load rises.',
    },
    strategyIds: 'ST-S2.1; ST-S4.3; ST-S5.2; ST-S5.3; ST-S5.6 (added); ST-G.1; ST-G.2; ST-G.5; ST-G.6',
  },
  {
    id: 'accommodator',
    name: 'AI Accommodator',
    shortName: 'Accommodator',
    definition: 'Permit named lower-risk AI uses while preserving human reasoning.',
    interviewees: 'P5, P6, P8, P11, P12, P13',
    respondentCount: 6,
    decisionRule: 'Permit bounded AI uses that support access or learning while reserving core reasoning, architecture, ownership, and final judgment for humans.',
    dimensions: {
      selection: 'Use project-specific tasks, live/explanation checks, honest disclosure, and a corrective resubmission path where appropriate.',
      aiBoundary: 'Allow named uses such as comprehension, language polishing, debugging, tests, or boilerplate; Restrict wholesale generation and unreviewed output.',
      mentoringOperations: 'Model responsible use: ask, inspect, compare, test, cite or disclose when required, and connect tool use to explicit learning goals.',
      qualityGates: 'Require explanation, human-led review, quality/security/license checks, and proportionate disclosure or activity history for material assistance.',
      governance: 'Maintain task- and artifact-specific carve-outs and contributor guidance; Revise boundaries when evidence, tools, or project risk changes.',
    },
    strategyIds: 'ST-S2.2; ST-S2.3; ST-S2.4; ST-S4.3; ST-S5.2; ST-S5.3; ST-S5.6; ST-G.1; ST-G.2; ST-G.3; ST-G.5; ST-G.6; ST-G.7',
  },
  {
    id: 'pragmatist',
    name: 'AI Pragmatist',
    shortName: 'Pragmatist',
    definition: 'Permit broad AI use when the contributor demonstrates understanding, ownership, and quality.',
    interviewees: 'P1, P2, P3',
    respondentCount: 3,
    decisionRule: 'Accept AI assistance when the contributor can demonstrate project fit, understanding, ownership, and verifiable quality; judge outcomes and process evidence.',
    dimensions: {
      selection: 'Weight longitudinal contribution evidence and live or project-specific demonstrations over proposal authorship or polish.',
      aiBoundary: 'Permit production assistance within project rules when the contributor owns design choices, can explain the result, and validates it.',
      mentoringOperations: 'Teach architecture, decomposition, prompting/context, review, testing, and when not to use AI; Keep relationships and final judgment human-led.',
      qualityGates: 'Use risk-based CI, tests, security/license checks, explanation, and human sign-off; Prioritize functionality, maintainability, and reproducibility.',
      governance: 'Use a calibrated conditional-use policy and disclose material assistance where it changes review risk or accountability.',
    },
    strategyIds: 'ST-S2.1; ST-S2.2; ST-S2.3; ST-S4.3; ST-S5.3; ST-S5.6; ST-S6.1; ST-G.2; ST-G.3; ST-G.5; ST-G.6',
  },
  {
    id: 'advocate',
    name: 'AI Advocate',
    shortName: 'Advocate',
    definition: 'Treat AI as a legitimate part of modern software development and redesign workflows around it.',
    interviewees: 'P15',
    respondentCount: 1,
    decisionRule: 'Integrate AI as a normal development capability, but scale project scope only when verification capacity, learning goals, and human accountability also scale.',
    dimensions: {
      selection: 'Assess tool-assisted problem solving plus architecture and explanation; Use authentic tasks rather than testing unaided typing speed alone.',
      aiBoundary: 'Allow broad assistance within security, privacy, secret-handling, licensing, and repository rules; Require human ownership of all outputs.',
      mentoringOperations: 'Teach effective context setting, decomposition, secure tool configuration, evaluation, and failure recognition; Preserve deliberate learning checkpoints.',
      qualityGates: 'Use layered automated tests, static/security/license checks, reproducible runs, and human architecture/merge approval; Never use AI review as the sole gate.',
      governance: 'Record material tools/agents and high-risk workflows; Sandbox permissions; Pair productivity targets with quality, security, and learning thresholds.',
    },
    strategyIds: 'ST-S2.1; ST-S2.3; ST-S4.3; ST-S5.6 (added); ST-S6.1; ST-G.6',
    note: 'Under-evidenced: only one interviewee supports; needs additional evidence for refinement/validation.',
  },
];

export const capacityOverlay = {
  name: 'AI inevitability / capacity overlay',
  definition: 'Assume AI use or AI-mediated submission volume cannot be prevented and prioritize scalable adaptation.',
  decisionRule: 'Apply to any stance when actors frame AI volume or use as unavoidable and shift the problem from prevention to adaptation and reviewer capacity.',
  dimensions: {
    selection: 'Use objective prerequisites, contribution provenance, prioritized intake, and submission limits tied to available reviewer capacity.',
    aiBoundary: "Keep the host stance's use boundary; the overlay changes scaling and control mechanisms, not moral acceptance of AI.",
    mentoringOperations: 'Protect mentor capacity with triage, documented escalation, realistic cohort or project scope, and explicit human-contact minimums.',
    qualityGates: 'Automate low-risk checks and triage, retain human merge/accountability, log incidents, and tighten gates when backlog or quality thresholds fail.',
    governance: 'Coordinate program, organization, and platform controls; set capacity thresholds, rate limits, review queues, and a Plan–Do–Check–Act policy review.',
  },
  strategyIds: 'ST-S2.1; ST-S6.1; ST-G.2; ST-G.5; ST-G.6; ST-G.7',
  note: 'This overlay originated from the initial “AI Fatalist” analysis but was not carried as a standalone interviewee stance. It is presented as a cross-stance analytic layer.',
};

export const universalMinimum = [
  {
    id: 'selection',
    label: 'Selection',
    color: '#BCD4E6',
    citationIds: ['GSOC-SEL'],
    subdimensions: [
      {
        label: 'Selection evidence',
        definition: 'Use prior engagement and project-specific evidence. Do not infer competence or AI authorship from proposal polish alone.',
      },
    ],
  },
  {
    id: 'aiBoundary',
    label: 'AI boundary',
    color: '#FAD2E1',
    citationIds: ['GSOC-AI', 'NIST-RMF', 'ISO-AIMS', 'OPENSSF-AI', 'GSOC-ROLE'],
    subdimensions: [
      {
        label: 'Policy boundary',
        definition: 'Publish allowed, restricted, and prohibited AI uses before applications; State the learning, security, licensing, or capacity rationale and consequences.',
      },
      {
        label: 'Human accountability',
        definition: 'Require the contributor to understand, explain, test, and own every submitted artifact; AI is never the accountable author or final decision-maker.',
      },
    ],
  },
  {
    id: 'mentoringOperations',
    label: 'Mentoring operations',
    color: '#C5DEDD',
    citationIds: ['GSOC-ROLE', 'GSOC-AI'],
    subdimensions: [
      {
        label: 'Mentoring responsibility',
        definition: 'Protect learning objectives, regular human feedback, and explicit AI-literacy coaching appropriate to the stance.',
      },
    ],
  },
  {
    id: 'qualityGates',
    label: 'Review / quality gates',
    color: '#EDDCD2',
    citationIds: ['NIST-SSDF', 'OPENSSF-SSD', 'OPENSSF-AI'],
    subdimensions: [
      {
        label: 'Engineering assurance',
        definition: 'Apply human review plus CI, negative tests, security checks, dependency/license review, and reproducibility evidence proportionate to risk.',
      },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    color: '#D6E2E9',
    citationIds: ['NIST-RMF', 'NIST-GAI', 'ISO-AIMS', 'GSOC-ROLE'],
    subdimensions: [
      {
        label: 'Governance baseline',
        definition: 'Use proportionate disclosure, a documented escalation/appeal path, workload and quality metrics, and a policy review after each cycle.',
      },
    ],
  },
];
