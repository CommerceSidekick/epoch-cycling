// Date helpers for events (mono label + full text). Always render <time datetime> too.
export function eventLabel(d: Date, tz: string) {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz }).format(d).toUpperCase();
  const dd = new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone: tz }).format(d);
  const mon = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: tz }).format(d).toUpperCase();
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(d);
  return `${day} ${dd} ${mon} · ${time}`;
}
export function eventLong(d: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: tz, timeZoneName: "short" }).format(d);
}
export function shortDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
}
export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
