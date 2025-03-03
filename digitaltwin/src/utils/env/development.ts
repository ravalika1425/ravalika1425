import { EnvironmentConfig } from "./types"

export const development: EnvironmentConfig = {
  apiUrl: process.env.API_URL || "",
  featureFlag: true,
  appEnv: "development" as const,
  LOG_LEVEL: "log" as const,
  // other development-specific config
}
