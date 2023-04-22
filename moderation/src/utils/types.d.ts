export interface Tox {
  label: string;
  results: [ToxResult, ...ToxResult[]];
}

export interface ToxResult {
  match: boolean | null;
  probabilities: [number, number];
}
