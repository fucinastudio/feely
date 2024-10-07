import {
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from "date-fns";

export const ensureArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
};

export const getPointsToModify = (createdAt: Date) => {
  // Get the current date
  const now = new Date();

  // Determine the start of the current week (Monday-Sunday)
  const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 }); // Monday is the start of the week

  // Determine the start of the current month
  const startOfThisMonth = startOfMonth(now);

  // Determine the start of the current quarter
  const startOfThisQuarter = startOfQuarter(now);

  // Determine the start of the current year
  const startOfThisYear = startOfYear(now);

  // Initialize applyTo points
  let applyToWeekly = false;
  let applyToMonthly = false;
  let applyToQuarterly = false;
  let applyToYearly = false;

  // Check if the created_at date falls within the current week
  if (createdAt >= startOfThisWeek) {
    applyToWeekly = true;
  }

  // Check if the created_at date falls within the current month
  if (createdAt >= startOfThisMonth) {
    applyToMonthly = true;
  }

  // Check if the created_at date falls within the current quarter
  if (createdAt >= startOfThisQuarter) {
    applyToQuarterly = true;
  }

  // Check if the created_at date falls within the current year
  if (createdAt >= startOfThisYear) {
    applyToYearly = true;
  }
  return {
    applyToWeekly,
    applyToMonthly,
    applyToQuarterly,
    applyToYearly,
  };
};
