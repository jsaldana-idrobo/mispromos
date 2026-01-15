const DEFAULT_ORIGINS = [
  "https://mispromos-web.vercel.app",
  "https://mispromos-web-git-main-juansaldanas-projects.vercel.app",
];

const normalizeOrigin = (value: string) => {
  let end = value.length;
  while (end > 0 && value.codePointAt(end - 1) === 47) {
    end -= 1;
  }
  return end === value.length ? value : value.slice(0, end);
};

const isAllowedVercelOrigin = (value: string) => {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  const hostname = parsed.hostname;
  if (hostname === "mispromos-web.vercel.app") return true;
  const prefix = "mispromos-web-git-";
  const suffix = "-juansaldanas-projects.vercel.app";
  if (!hostname.startsWith(prefix) || !hostname.endsWith(suffix)) return false;
  const branch = hostname.slice(prefix.length, hostname.length - suffix.length);
  if (!branch) return false;
  for (let i = 0; i < branch.length; i += 1) {
    const code = branch.codePointAt(i);
    const isDigit = code >= 48 && code <= 57;
    const isLower = code >= 97 && code <= 122;
    if (!(isDigit || isLower || code === 45)) return false;
  }
  return true;
};

const resolveAllowedOrigins = (rawOrigins: string) => {
  const allowedOrigins = rawOrigins
    .split(",")
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);
  return new Set([...allowedOrigins, ...DEFAULT_ORIGINS]);
};

export const createOriginChecker = (rawOrigins: string) => {
  const originSet = resolveAllowedOrigins(rawOrigins);
  const hasMispromosOrigin = Array.from(originSet).some((entry) =>
    entry.includes("mispromos-web"),
  );

  return (origin?: string) => {
    if (!origin) return true;
    const normalized = normalizeOrigin(origin);
    if (originSet.size === 0) return true;
    return (
      originSet.has(normalized) ||
      (hasMispromosOrigin && isAllowedVercelOrigin(normalized))
    );
  };
};
