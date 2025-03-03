export interface EnvironmentConfig {
  apiUrl: string
  featureFlag: boolean
  appEnv: "development" | "test" | "staging" | "production"
  LOG_LEVEL: "warn" | "log"
  // other config properties
}
