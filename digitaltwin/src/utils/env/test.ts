import { EnvironmentConfig } from "./types"

export const test: EnvironmentConfig = {
  apiUrl: process.env.API_URL || "",
  featureFlag: true,
  appEnv: "test" as const,
  LOG_LEVEL: "log" as const,
  // other test-specific config
}
