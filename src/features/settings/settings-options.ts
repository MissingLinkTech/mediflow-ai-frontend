export const SUPPORTED_LOCALES = [
  { value: "en-US", label: "English (United States)" },
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "es-ES", label: "Español (España)" },
  { value: "es-MX", label: "Español (México)" },
  { value: "fr-FR", label: "Français (France)" },
  { value: "de-DE", label: "Deutsch (Deutschland)" },
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "hi-IN", label: "हिन्दी (भारत)" },
  { value: "ja-JP", label: "日本語 (日本)" },
  { value: "zh-CN", label: "中文 (简体)" },
] as const;

export const SUPPORTED_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
] as const;

export function detectBrowserLocale(): string {
  if (typeof navigator === "undefined") return "en-US";
  for (const locale of navigator.languages ?? [navigator.language]) {
    if (typeof locale !== "string") continue;
    const matched = SUPPORTED_LOCALES.find((entry) => entry.value === locale);
    if (matched) return matched.value;
    const base = locale.split("-")[0]?.toLowerCase();
    const fallback = SUPPORTED_LOCALES.find((entry) => entry.value.startsWith(base ?? ""));
    if (fallback) return fallback.value;
  }
  return "en-US";
}

export function detectBrowserTimezone(): string {
  if (typeof Intl === "undefined") return "UTC";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && SUPPORTED_TIMEZONES.includes(tz as (typeof SUPPORTED_TIMEZONES)[number])) {
      return tz;
    }
    return "UTC";
  } catch {
    return "UTC";
  }
}
