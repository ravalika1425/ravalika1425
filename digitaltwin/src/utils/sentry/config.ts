export const sentryConfig = {
  dsn: process.env.SENTRY_DSN || "",
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
}
