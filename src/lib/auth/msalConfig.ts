import { LogLevel, type Configuration } from "@azure/msal-browser";

// Create a class to handle configuration
class MSALConfigManager {
  private static instance: MSALConfigManager;
  private envConfig: Record<string, string> = {};
  private isInitialized = false;

  private constructor() {}

  static getInstance(): MSALConfigManager {
    if (!MSALConfigManager.instance) {
      MSALConfigManager.instance = new MSALConfigManager();
    }
    return MSALConfigManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const response = await fetch("./env.js");
      if (!response.ok) {
        throw new Error("Failed to load env.js");
      }
      this.envConfig = eval(await response.text());
      console.log("Loaded Env Config:", this.envConfig);
      this.isInitialized = true;
    } catch (error) {
      console.error("Error loading env.js:", error);
      throw error;
    }
  }

  getMsalConfig(): Configuration {
    if (!this.isInitialized) {
      throw new Error("Config not initialized. Call initialize() first");
    }

    return {
      auth: {
        clientId: this.envConfig.VITE_CLIENT_ID,
        authority: `${this.envConfig.VITE_CLOUD_INSTANCE}${this.envConfig.VITE_TENANT_ID}`,
        redirectUri: this.envConfig.VITE_REDIRECT_URI,
        navigateToLoginRequestUrl: false,

        // clientId: import.meta.env.VITE_CLIENT_ID,
        // authority: `${import.meta.env.VITE_CLOUD_INSTANCE}${
        //   import.meta.env.VITE_TENANT_ID
        // }`,
        // redirectUri: import.meta.env.VITE_REDIRECT_URI,
        // navigateToLoginRequestUrl: false,
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
      },
      system: {
        loggerOptions: {
          loggerCallback: (
            level: LogLevel,
            message: string,
            containsPii: boolean
          ) => {
            if (containsPii) return;
            switch (level) {
              case LogLevel.Error:
                console.error(message);
                break;
              case LogLevel.Info:
                console.info(message);
                break;
              case LogLevel.Verbose:
                console.debug(message);
                break;
              case LogLevel.Warning:
                console.warn(message);
                break;
            }
          },
          logLevel: LogLevel.Info,
          piiLoggingEnabled: false,
        },
        windowHashTimeout: 60000,
        iframeHashTimeout: 6000,
        loadFrameTimeout: 6000,
      },
    };
  }

  getLoginRequest() {
    return {
      scopes: ["User.Read"], // Add your required scopes here
    };
  }
}

// Export the config manager instance
export const msalConfigManager = MSALConfigManager.getInstance();

// Export a function to get the MSAL config after initialization
export async function getMsalConfig(): Promise<Configuration> {
  await msalConfigManager.initialize();
  return msalConfigManager.getMsalConfig();
}

// Export the login request
export const loginRequest = {
  scopes: ["User.Read"],
};
