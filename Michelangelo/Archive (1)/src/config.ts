// src/config.ts

interface Config {
  msal: {
    REDIRECT_URI: string;
    CLIENT_ID: string;
    AUTH: string;
  };
  server: {
    MLO_SERVER: string;
  };
}

// Declare runtime_config to avoid TypeScript errors
declare global {
  interface Window {
    runtime_config?: {
      REDIRECT_URI?: string;
      MSAL_CLIENTID?: string;
      MSAL_AUTH?: string;
      MLO_SERVER?: string;
    };
  }
}

const config: Config = {
  msal: {
    REDIRECT_URI: window.runtime_config?.REDIRECT_URI || process.env.REACT_APP_APP_REDIRECT_URI || "",
    CLIENT_ID: window.runtime_config?.MSAL_CLIENTID || process.env.REACT_APP_MSAL_CLIENTID || "",
    AUTH: window.runtime_config?.MSAL_AUTH || process.env.REACT_APP_MSAL_AUTH || "",
  },
  server: {
    MLO_SERVER: window.runtime_config?.MLO_SERVER || process.env.REACT_APP_MLO_SERVER || "",
  }
};

export default config;