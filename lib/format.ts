export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function formatTimelineDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
  }).format(new Date(value));
}
