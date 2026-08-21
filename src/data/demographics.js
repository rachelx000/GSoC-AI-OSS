// Anonymized categorical fields transcribed from the Participants worksheet in
// references/0-interview-demographics.xlsx. Counts are computed in the UI.
export const participants = [
  { id: 'P1', gender: 'Male', role: 'Admin + Mentor', mentorTenure: '1-2 yrs', orgSize: 'Large', aiUse: 'Very Often', stance: 'AI Pragmatist' },
  { id: 'P2', gender: 'Male', role: 'Mentor Only', mentorTenure: '3-5 yrs', orgSize: 'Large', aiUse: 'Often', stance: 'AI Pragmatist' },
  { id: 'P3', gender: 'Male', role: 'Admin + Mentor', mentorTenure: '6-10 yrs', orgSize: 'Large', aiUse: 'Sometimes', stance: 'AI Pragmatist' },
  { id: 'P4', gender: 'Male', role: 'Mentor Only', mentorTenure: '3-5 yrs', orgSize: 'Small', aiUse: 'Sometimes', stance: 'AI Skeptic' },
  { id: 'P5', gender: 'Male', role: 'Mentor Only', mentorTenure: '<1 yr', orgSize: 'Very Large', aiUse: 'Very Often', stance: 'AI Accommodator' },
  { id: 'P6', gender: 'Male', role: 'Mentor Only', mentorTenure: '11+ yrs', orgSize: 'Very Large', aiUse: 'Rarely', stance: 'AI Accommodator' },
  { id: 'P7', gender: 'Male', role: 'Admin + Mentor', mentorTenure: '3-5 yrs', orgSize: 'Small', aiUse: 'Never', stance: 'AI Prohibitionist' },
  { id: 'P8', gender: 'Non-binary', role: 'Admin + Mentor', mentorTenure: '11+ yrs', orgSize: 'Very Large', aiUse: 'Very Often', stance: 'AI Accommodator' },
  { id: 'P9', gender: 'Male', role: 'Admin Only', mentorTenure: '11+ yrs', orgSize: 'Small', aiUse: 'Never', stance: 'AI Prohibitionist' },
  { id: 'P10', gender: 'Male', role: 'Admin Only', mentorTenure: '6-10 yrs', orgSize: 'Medium', aiUse: 'Sometimes', stance: 'AI Skeptic' },
  { id: 'P11', gender: 'Male', role: 'Mentor Only', mentorTenure: '1-2 yrs', orgSize: 'Large', aiUse: 'Sometimes', stance: 'AI Accommodator' },
  { id: 'P12', gender: 'Male', role: 'Mentor Only', mentorTenure: '1-2 yrs', orgSize: 'Very Large', aiUse: 'Very Often', stance: 'AI Accommodator' },
  { id: 'P13', gender: 'Male', role: 'Admin + Mentor', mentorTenure: '<1 yr', orgSize: 'Small', aiUse: 'Sometimes', stance: 'AI Accommodator' },
  { id: 'P14', gender: 'Male', role: 'Admin + Mentor', mentorTenure: '11+ yrs', orgSize: 'Very Large', aiUse: 'Never', stance: 'AI Skeptic' },
  { id: 'P15', gender: 'Male', role: 'Mentor Only', mentorTenure: '<1 yr', orgSize: 'Medium', aiUse: 'Very Often', stance: 'AI Advocate' },
];

export const roleOrder = ['Mentor Only', 'Admin + Mentor', 'Admin Only'];
export const tenureOrder = ['<1 yr', '1-2 yrs', '3-5 yrs', '6-10 yrs', '11+ yrs'];
export const orgSizeOrder = ['Small', 'Medium', 'Large', 'Very Large'];
export const aiUseOrder = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];
export const stanceOrder = [
  'AI Prohibitionist',
  'AI Skeptic',
  'AI Accommodator',
  'AI Pragmatist',
  'AI Advocate',
];

// Definitions from the workbook's "AI Stance Codes" worksheet. AI Fatalist is
// part of the codebook but is not assigned to any participant in this sample.
export const stanceCodes = [
  {
    name: 'AI Fatalist',
    definition:
      'Believes AI spam is irreversible and will continue to grow regardless of interventions; focuses on adaptation rather than prevention.',
  },
  {
    name: 'AI Prohibitionist',
    definition:
      'Explicitly bans all or nearly all AI use in contributions and/or proposals, treats any AI use as grounds for rejection.',
  },
  {
    name: 'AI Skeptic',
    definition:
      'Does not ban AI but expresses strong concern about its effects on learning, quality, or contributor development.',
  },
  {
    name: 'AI Accommodator',
    definition:
      'Accepts limited AI use for specific purposes, particularly for non-native English speakers or for understanding codebases, while restricting generative use.',
  },
  {
    name: 'AI Pragmatist',
    definition:
      'Accepts AI as a tool if the output is good and the contributor understands it; outcome-focused rather than process-focused.',
  },
  {
    name: 'AI Advocate',
    definition:
      'Actively welcomes AI use as a legitimate part of modern software development; frames AI restriction as unrealistic or regressive.',
  },
];
