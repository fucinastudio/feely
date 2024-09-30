export const Periods = [
  'Last week',
  'Last month',
  'Last quarter',
  'Last year',
] as const;

export type PeriodType = (typeof Periods)[number];
