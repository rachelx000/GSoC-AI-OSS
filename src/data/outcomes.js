export const outcomeDimensions = [
  {
    id: 'OC1',
    name: 'Learning & Accountable Contribution',
    definition: 'Mentee can combine independent technical learning with reflective judgment, responsible AI use, and contribution ownership.',
  },
  {
    id: 'OC2',
    name: 'Career Development',
    definition: 'Provide mentees career direction, network building, and institutional navigation through mentor advice and community participation.',
  },
  {
    id: 'OC3',
    name: 'Relational Support',
    definition: 'Provide emotional and moral support, advocacy and procedural fairness, and bounded interpersonal connection.',
  },
  {
    id: 'OC4',
    name: 'Trustworthy Membership & Regenerative Retention',
    definition: 'Verified conduct and effort produce trustworthy membership, durable attachment, and progression toward long-term contribution.',
  },
  {
    id: 'OC5',
    name: 'Mentor Sustainability',
    definition: "Preserve mentors' intrinsic motivation and professional identity while developing their leadership and capability.",
  },
];

export const outcomes = [
  {
    id: 'O1',
    sourceOrder: 0,
    dimensionId: 'OC1',
    provenance: 'literature',
    name: 'Encouraging Skill Development',
    definition: 'Pre-AI definition: The mentor helps the mentee develop career-relevant skills, with the goal of making the mentee more self-sufficient, independent, and capable.\n\nAI-era meaning: Skill development means using AI without outsourcing understanding: mentees can still reason, debug, explain, evaluate, and proceed independently.',
    respondentCount: 11,
    representativeCodes: [
      {
        code: 'Contributor blocked by AI quota',
        source: 'P1 · 11:45–11:55',
        quote: 'Mentee "told me that I won\'t be able to create more PRs until 6 June, until my AI limit renews."',
      },
      {
        code: 'Comprehension gap in AI-generated design',
        source: 'P1 · 31:20–31:57',
        quote: 'Mentee\'s ChatGPT design/implementation missed key pieces; mentor: "These are the things you missed... That\'s your job."',
      },
      {
        code: 'Balance AI fluency with learning in response to AI trend',
        source: 'P2 · 33:03–33:49',
        quote: '"One principle of GSoC is that we want people to learn... [not] to be completely dependent upon AI... [but] we also want them to use AI because AI is going to be in trend... we don\'t want them to get backtracked."',
      },
    ],
  },
  {
    id: 'O2',
    sourceOrder: 1,
    dimensionId: 'OC2',
    provenance: 'literature',
    name: 'Coaching & Vision-Building (career)',
    definition: 'Pre-AI definition: The mentor advises on career progress, including the achievement of appropriate career milestones.\n\nAI-era meaning: The mentee gains clearer career direction and accesses to opportunities through human advice, referrals, and sponsorship alongside the broader career benefits of GSoC.',
    respondentCount: 5,
    representativeCodes: [
      {
        code: 'Mentoring in GSoC helps career exploration',
        source: 'P6 · 5:29–5:46',
        quote: '"For me, I believe in mentoring new people, helping either students [or] people who are about to enter the workforce try to figure out what they actually like."',
      },
      {
        code: 'Mentee career transformation',
        source: 'P7 · 6:44–7:56',
        quote: '"All of them are now in very good companies... one of my contributors referred me to his company, so we are coworkers now... without GSoC he would not have matured."',
      },
      {
        code: 'Mentor gave career guidance',
        source: 'P11 · 7:30–8:10',
        quote: 'Mentor helped with "decisions about my professional career... I grew a lot during that GSoC period" — motivation to give back.',
      },
    ],
  },
  {
    id: 'O3',
    sourceOrder: 2,
    dimensionId: 'OC1',
    provenance: 'literature',
    name: 'Promoting Self-Awareness',
    definition: 'Pre-AI definition: The mentor uncovers the mentee\'s underlying assumptions through careful probing and scaffolds them into deeper levels of thinking.\n\nAI-era meaning: Explanation and dialogue surface assumptions, limits, and gaps, enabling mentees to demonstrate reflection and self-correction rather than merely present working output.',
    respondentCount: 3,
    representativeCodes: [
      {
        code: 'Explanation test + demo + private tests',
        source: 'P3 · 28:47–30:07',
        quote: '"We ask them to explain the code, give a demo... run our integration tests. If they can explain it and it works, it is impossible to tell it was AI generated."',
      },
      {
        code: 'Detection by dialogue',
        source: 'P8 · 32:20–34:49',
        quote: '"Why did you choose to do it this way?"; comment bloat: "Nobody writes comments in their code. So if it\'s full of comments, I know it\'s LLM generated."',
      },
      {
        code: 'Explanation test over AI-detection',
        source: 'P11 · 23:20–24:46',
        quote: '"I leave one or two comments asking folks to explain the code... if they are able to explain it, it doesn\'t matter if it\'s AI generated or not."',
      },
    ],
  },
  {
    id: 'O4',
    sourceOrder: 3,
    dimensionId: 'OC2',
    provenance: 'literature',
    name: 'Navigating the Institution',
    definition: 'Pre-AI definition: The mentor helps the mentee adapt to the norms, standards, and expectations associated with their profession.\n\nAI-era meaning: Institutional navigation includes learning project workflows, review and communication norms, contribution provenance, and local expectations for responsible AI use.',
    respondentCount: 2,
    representativeCodes: [
      {
        code: 'Mentees socialized into industry practices',
        source: 'P1 · 8:51–9:33',
        quote: 'Mentees learn "how to reach out to reviewers... how to create a good PR with a good description, how to review your changes, how to help out others."',
      },
      {
        code: 'GSoC as structured gateway for OSS',
        source: 'P2 · 8:25–9:00',
        quote: '"It is a very structured way of promoting open source" — orgs + applicants organized on one platform.',
      },
    ],
  },
  {
    id: 'O5',
    sourceOrder: 4,
    dimensionId: 'OC2',
    provenance: 'literature',
    name: 'Cultivating Networks',
    definition: 'Pre-AI definition: The mentor helps the mentee gain access to otherwise closed circles and increase their contacts for the future.\n\nAI-era meaning: Mentorship and community participation give mentees durable access to experienced people, OSS communities, and future opportunities beyond one-time recruitment.',
    respondentCount: 3,
    representativeCodes: [
      {
        code: 'Expert learning, belonging and network',
        source: 'P4 · 3:55–4:21',
        quote: '"I saw [GSoC] as an opportunity... to learn from people who are already experienced... be part of this open source community, and gain access to a network of fellow engineers and developers that I can continue to stay in touch with."',
      },
      {
        code: 'GSoC as personal network + learning platform',
        source: 'P4 · 5:58–6:12',
        quote: '"It introduced me to this global platform of open source contributors... I\'ve just learned so much."',
      },
      {
        code: 'Gray-motivation converts to membership',
        source: 'P11 · 37:15–37:57',
        quote: 'Joining for GSoC is "a bit on the gray side... but once you start contributing you realize the value and then you become a proper member of the organization."',
      },
    ],
  },
  {
    id: 'O6',
    sourceOrder: 5,
    dimensionId: 'OC3',
    provenance: 'literature',
    name: 'Providing Emotional & Moral Support',
    definition: 'Pre-AI definition: The mentor helps the mentee clarify feelings, permits vulnerability, and encourages discussion of the personal meaning of experiences.\n\nAI-era meaning: Emotional and moral support remains distinctly human, including recognizing when AI use reflects language or accessibility needs rather than misconduct.',
    respondentCount: 1,
    representativeCodes: [
      {
        code: 'Empathy for AI as language crutch',
        source: 'P6 · 24:17–25:14',
        quote: '"Some people are using AI as a crutch for not being native English speakers... trying to recognize that and work with people."',
      },
    ],
  },
  {
    id: 'O7',
    sourceOrder: 6,
    dimensionId: 'OC1',
    provenance: 'literature',
    name: 'Acting as Role Model',
    definition: 'Pre-AI definition: The mentor provides the mentee with a model for what their future self may look like when they reach a similar career position.\n\nAI-era meaning: The mentee observes and adopts mentors\' professional judgment and responsible AI practices, including keeping humans accountable for reasoning and decisions.',
    respondentCount: 3,
    representativeCodes: [
      {
        code: 'Maintainer-side AI admired (rsync case)',
        source: 'P7 · 29:40–31:08',
        quote: 'Lead maintainer + Claude: "absolutely extracted superpowers... that is transformative use of AI. In the right hands."',
      },
      {
        code: 'Human creates, AI checks (role inversion)',
        source: 'P8 · 35:45–37:53',
        quote: 'Uses AI as rubber duck, debugger, test generator. "Thinking of edge cases... that\'s boring to me." But never use AI for generation.',
      },
      {
        code: 'Personal practice: AI as senior reviewer',
        source: 'P12 · 12:54–13:25',
        quote: '"I never let it write my code... AI works as a sort of senior engineer that reviews my work and tells me edge cases."',
      },
    ],
  },
  {
    id: 'O8',
    sourceOrder: 7,
    dimensionId: 'OC3',
    provenance: 'literature',
    name: 'Protecting & Advocating',
    definition: 'Pre-AI definition: The mentor advocates for the mentee in the team while protecting them from harsh interactions.\n\nAI-era meaning: Protection includes procedural fairness when AI use is suspected.',
    respondentCount: 2,
    representativeCodes: [
      {
        code: 'Mentor teaches checking, not rechecking',
        source: 'P8 · 29:31–31:56',
        quote: 'I might tell [mentees] once: fully check everything before sending it. I’ll help you understand how to check, but I’m "not being your checker... My role is to mentor you to develop your skills."',
      },
      {
        code: 'Fairness: no AI judging newcomers',
        source: 'P11 · 3:24–3:57, 22:24–23:03',
        quote: '"Rejecting their code based on an AI analysis doesn\'t sit right with me"; CodeRabbit reserved for established contributors, not newcomers.',
      },
    ],
  },
  {
    id: 'O9',
    sourceOrder: 8,
    dimensionId: 'OC3',
    provenance: 'literature',
    name: 'Offering Friendship',
    definition: 'Pre-AI definition: The mentor interacts with the mentee socially outside of work.\n\nAI-era meaning: The interviews do not identify friendship as a distinct outcome, but they reinforce the value of genuine human communication while professional boundaries remain.',
    respondentCount: 0,
    representativeCodes: [],
  },
  {
    id: 'O10',
    sourceOrder: 9,
    dimensionId: 'OC5',
    provenance: 'literature',
    name: 'Instilling a Sense of Satisfaction (mentor)',
    definition: 'Pre-AI definition: The mentor feels an intrinsic, personal satisfaction.\n\nAI-era meaning: Additional detection, review, and verification labor can erode the enjoyment that sustains volunteer mentoring, making mentor satisfaction a program-sustainability concern.',
    respondentCount: 7,
    representativeCodes: [
      {
        code: 'Mentoring became tiring with AI',
        source: 'P1 · 26:14–26:29',
        quote: '"When AI came into the picture, it has become very tiring to be a mentor, because contributors can easily write code."',
      },
      {
        code: 'Growing pains for mentors',
        source: 'P6 · 21:53–22:40',
        quote: '"Not being prepared for this amount of abuse has made it tough for a couple of the mentors... getting through some growing pains."',
      },
      {
        code: 'Organization exit due to AI burden',
        source: 'P7 · 26:41–27:20',
        quote: '"The overall amount of effort had gone up exponentially to something we can\'t keep up with... We have not participated in GSoC 2026. I don\'t think we will be participating again."',
      },
    ],
  },
  {
    id: 'O11',
    sourceOrder: 10,
    dimensionId: 'OC5',
    provenance: 'literature',
    name: "Reinforcing Mentors' Professional Identity",
    definition: 'Pre-AI definition: Mentoring reinforces mentors\' professional identity, status, and self-worth.\n\nAI-era meaning: Mentoring continues to strengthen professional identity by building recognition, confidence, community standing, and pathways into wider leadership.',
    respondentCount: 5,
    representativeCodes: [
      {
        code: 'Mentoring develops confidence, community identity, and wider leadership',
        source: 'P8 · 10:22–11:46',
        quote: '"GSoC was really one of the things that helped me get beyond myself... it was building that community... [and] allowed me to understand my voice in this space... That then gave me confidence to... advocate more widely... If it wasn\'t for GSoC... I don\'t think I would have had as big an impact within my community."',
      },
      {
        code: 'Student-to-org-admin lifecycle',
        source: 'P9 · 0:46, 28:14–29:02',
        quote: 'GSoC student 2008–10 -> ~18 years mentoring/organization admin; "we definitely had the contributor to mentor pipeline happen."',
      },
      {
        code: 'Giving back the same experience',
        source: 'P12 · 1:48–2:59',
        quote: '"Making that Google Summer of Code experience as nice for someone else as it was for me" — and staying involved in Git community.',
      },
    ],
  },
  {
    id: 'O12',
    sourceOrder: 11,
    dimensionId: 'OC4',
    provenance: 'new',
    name: 'Verified trustworthiness & membership',
    definition: 'The scarce new product: the mentee becomes a person the community can trust and merge from. When artifacts are free, certified persons are the value.',
    respondentCount: 7,
    representativeCodes: [
      {
        code: 'Skill-evidence requirement (merged PRs per skill)',
        source: 'P1 · 18:06–18:33, 21:37–22:17',
        quote: 'Proposal must list >=2 merged PRs per required skill with links; missing = "automatically out."',
      },
      {
        code: 'Provenance-based selection observed',
        source: 'P2 · 35:02–36:28',
        quote: 'Organizations "prefer those contributors who are involved in the project from way before... 1000 proposals... simply had like 15 or 20 potential contributors actually involved."',
      },
      {
        code: 'Provenance selection: judge before applying',
        source: 'P3 · 23:10–24:05',
        quote: '"We are judging the students even before they apply... six months contributing for us... even if he does an AI-generated application, we know he is capable"; prior contributors first preference.',
      },
    ],
  },
  {
    id: 'O13',
    sourceOrder: 12,
    dimensionId: 'OC1',
    provenance: 'new',
    name: 'Responsible AI fluency & judgment',
    definition: 'The mentee can delegate to AI wisely,  audit its output, follow org/program AI policies. That is the scarce industry skill of the AI era.',
    respondentCount: 5,
    representativeCodes: [
      {
        code: 'Balance AI fluency with learning in response to AI trend',
        source: 'P2 · 33:03–33:49',
        quote: '"One principle of GSoC is that we want people to learn... [not] to be completely dependent upon AI... [but] we also want them to use AI because AI is going to be in trend... we don\'t want them to get backtracked."',
      },
      {
        code: 'Explanation test + demo + private tests',
        source: 'P3 · 28:47–30:07',
        quote: '"We ask them to explain the code, give a demo... run our integration tests. If they can explain it and it works, it is impossible to tell it was AI generated."',
      },
      {
        code: 'Human creates, AI checks (role inversion)',
        source: 'P8 · 35:45–37:53',
        quote: 'Uses AI as rubber duck, debugger, test generator. "Thinking of edge cases... that\'s boring to me." But never use AI for generation.',
      },
    ],
  },
  {
    id: 'O14',
    sourceOrder: 13,
    dimensionId: 'OC4',
    provenance: 'new',
    name: 'Durable attachment & retention',
    definition: 'Effort-based investment turns program participation into lasting commitment to the project and organization. AI reduces that effort and may weaken the attachment through which contributors become maintainers.',
    respondentCount: 8,
    representativeCodes: [
      {
        code: 'Post-GSoC attrition',
        source: 'P1 · 35:53–35:58',
        quote: '"Many of the times I\'ve seen contributors just come in, they do GSoC, and they leave."',
      },
      {
        code: 'Mentor regeneration (70% former students)',
        source: 'P3 · 14:33–16:30',
        quote: '"Almost 70% of [2026 mentors] had been our previous students... we are growing mentors who can guide the next generation of contributors."',
      },
      {
        code: 'GSoC Mentee-to-OSS maintainer continuity',
        source: 'P4 · 0:33–1:13',
        quote: '"In 2022, I became a GSoC mentee... I was a student in both 2022 and 2023. And since 2024, I have been a GSoC mentor... And I\'m [a] maintainer for a number of [their org]\'s projects, and I also work on other open source projects outside [the org] in my free time."',
      },
    ],
  },
  {
    id: 'O15',
    sourceOrder: 14,
    dimensionId: 'OC1',
    provenance: 'new',
    name: 'Explainable & maintainable contribution',
    definition: 'The mentee can produce explainable and maintainable AI-assisted contributions while taking responsibility for their work after submission.',
    respondentCount: 3,
    representativeCodes: [
      {
        code: 'Unreviewed PRs pose security threats',
        source: 'P2 · 43:52–44:12',
        quote: '"When we give AI a prompt and it gets something working and we just push it, it can be disastrous... you never know what AI missed; it could be a security threat."',
      },
      {
        code: 'Module glut strains maintenance',
        source: 'P8 · 24:44–25:45',
        quote: '"Lots of incremental and small bits and modules, which is veary hard and very costly to maintain" -> discussions of stringency thresholds.',
      },
      {
        code: 'AI code lacks maintainability',
        source: 'P15 · 15:27–15:50',
        quote: '"AI doesn\'t always generate maintainable, scalable code [or follow] good practices."',
      },
    ],
  },
  {
    id: 'O16',
    sourceOrder: 15,
    dimensionId: 'OC5',
    provenance: 'new',
    name: 'Mentor leadership & coordination development',
    definition: 'The mentor develops leadership, coordination, management, communication, and review capabilities through mentoring and organizational administration.',
    respondentCount: 6,
    representativeCodes: [
      {
        code: 'Management and communication development',
        source: 'P1 · 7:48–8:00',
        quote: '"I can learn some management strategies [and] how to communicate to the contributors."',
      },
      {
        code: 'Mentoring develops leadership coordination',
        source: 'P7 · 6:24–6:44',
        quote: '"That is where I learned... leadership skills, how to organize multiple mentors who are working with contributors and ensuring there\'s no friction between all of them."',
      },
      {
        code: 'Mentoring develops confidence, community identity, and wider leadership',
        source: 'P8 · 10:22–11:46',
        quote: '"GSoC was really one of the things that helped me get beyond myself... it was building that community... [and] allowed me to understand my voice in this space... That then gave me confidence to... advocate more widely... If it wasn\'t for GSoC... I don\'t think I would have had as big an impact within my community."',
      },
    ],
  },
];
