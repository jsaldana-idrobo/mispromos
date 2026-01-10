export const isValidDateRange = (startIso: string, endIso: string) =>
  startIso <= endIso;

export const isValidTimeRange = (start: string, end: string) => start <= end;
