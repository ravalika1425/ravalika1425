import { EnvironmentConfig } from "./types"
import * as productionConfig from "./production"
import * as stagingConfig from "./staging"
import * as testConfig from "./test"
import * as developmentConfig from "./development"

function loadConfig(): EnvironmentConfig {
  switch (process.env.REACT_APP_ENV) {
    case "production":
      return productionConfig.production
    case "staging":
      return stagingConfig.staging
    case "test":
      return testConfig.test
    default:
      return developmentConfig.development
  }
}

const config = loadConfig()

export default config
