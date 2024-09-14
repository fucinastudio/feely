export const Periods = ["Week", "Month", "Quarter", "Year"] as const;

export type PeriodType = (typeof Periods)[number];
