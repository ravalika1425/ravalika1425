import { EnvironmentConfig } from "./types"

export const production: EnvironmentConfig = {
  apiUrl: process.env.API_URL || "",
  featureFlag: false,
  appEnv: "production" as const,
  LOG_LEVEL: "warn" as const,
  // other production-specific config
}
