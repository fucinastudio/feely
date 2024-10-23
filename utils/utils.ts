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

export const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined
) => {
  // Check if trialPeriodDays is null, undefined, or less than 2 days
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined;
  }

  const currentDate = new Date(); // Current date and time
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000
  ); // Add trial days
  return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

export const getUrl = (path: string = "") => {
  const baseUrl =
    (process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
      ? "http://"
      : "https://") +
    process.env.NEXT_PUBLIC_VERCEL_URL +
    "/";
  return `${baseUrl}${path}`;
};

const toastKeyMap: { [key: string]: string[] } = {
  status: ["status", "status_description"],
  error: ["error", "error_description"],
};

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription: string = "",
  disableButton: boolean = false,
  arbitraryParams: string = ""
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType];

  let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(
      toastDescription
    )}`;
  }

  if (disableButton) {
    redirectPath += `&disable_button=true`;
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`;
  }

  return redirectPath;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription: string = "",
  disableButton: boolean = false,
  arbitraryParams: string = ""
) =>
  getToastRedirect(
    path,
    "status",
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams
  );

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription: string = "",
  disableButton: boolean = false,
  arbitraryParams: string = ""
) =>
  getToastRedirect(
    path,
    "error",
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams
  );

export const toDateTime = (secs: number) => {
  var t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const getPrice = (
  unit_amount: number,
  divideYearInMonths: boolean = false
) => {
  const divisionPerMonths = divideYearInMonths ? 12 : 1;
  return ((unit_amount ?? 0) / 100 / divisionPerMonths).toFixed(2);
};
