import * as LDClient from "launchdarkly-js-client-sdk"

const clientSideID = process.env.LAUNCHDARKLY_CLIENT_SIDE_ID || ""

export const ldClient = LDClient.initialize(clientSideID, {
  key: process.env.LAUNCHDARKLY_KEY || "",
  anonymous: true,
})

ldClient.on("ready", () => {
  console.log("LaunchDarkly client is ready")
})

ldClient.on("change", (flags) => {
  console.log("Flags have changed:", flags)
})
