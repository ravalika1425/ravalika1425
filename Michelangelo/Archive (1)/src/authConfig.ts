import { Configuration, PopupRequest } from "@azure/msal-browser";
import config from './config';
// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: config.msal.CLIENT_ID || '',
        authority: config.msal.AUTH,
        redirectUri: config.msal.REDIRECT_URI,
        // redirectUri: "http://localhost:4200/",
        // postLogoutRedirectUri: "/"
    },
    system: {
        allowNativeBroker: false // Disables WAM Broker
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ["User.Read"]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};