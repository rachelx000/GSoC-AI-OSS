export const respondentBands = [
  { min: 1, max: 2, label: '1–2', color: '#e6f1f5', ink: '#17384c' },
  { min: 3, max: 4, label: '3–4', color: '#c6dfe8', ink: '#17384c' },
  { min: 5, max: 6, label: '5–6', color: '#91bdce', ink: '#17384c' },
  { min: 7, max: 8, label: '7–8', color: '#397893', ink: '#ffffff' },
  { min: 9, max: 15, label: '9+', color: '#225a71', ink: '#ffffff' },
];

function respondentBand(count) {
  const integerCount = Math.max(1, Math.min(11, Math.round(count)));
  return respondentBands.find((band) => integerCount >= band.min && integerCount <= band.max);
}

export function respondentColor(count) {
  return respondentBand(count).color;
}

export function respondentTextColor(count) {
  return respondentBand(count).ink;
}
