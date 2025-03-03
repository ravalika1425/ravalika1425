import { EnvironmentConfig } from "./types"

export const staging: EnvironmentConfig = {
  apiUrl: process.env.API_URL || "",
  featureFlag: true,
  appEnv: "staging" as const,
  LOG_LEVEL: "log" as const,
  // other staging-specific config
}
