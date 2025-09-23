import {
  PublicClientApplication,
  InteractionRequiredAuthError,
  type AccountInfo,
  type Configuration,
  type RedirectRequest,
  type PopupRequest,
  type SilentRequest,
} from "@azure/msal-browser";
import { msalConfigManager } from "./msalConfig";
import { account, isAuthenticated, error } from "./stores";

class AuthService {
  private msalInstance: PublicClientApplication | null = null;
  private isLoginInProgress = false;

  private throwIfNotInitialized(): void {
    if (!this.msalInstance) {
      throw new Error(
        "MSAL instance not initialized. Call initialize() first."
      );
    }
  }

  async initialize(): Promise<void> {
    if (this.msalInstance) {
      return; // Already initialized
    }

    try {
      await msalConfigManager.initialize();
      const config = msalConfigManager.getMsalConfig();

      this.msalInstance = new PublicClientApplication(config);
      await this.msalInstance.initialize();

      const redirectResult = await this.msalInstance.handleRedirectPromise();

      if (redirectResult) {
        account.set(redirectResult.account);
        isAuthenticated.set(true);
      }

      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        account.set(accounts[0]);
        isAuthenticated.set(true);
      }
    } catch (err) {
      error.set(err as Error);
      console.error("Error initializing auth:", err);
      throw err;
    }
  }

  async login(): Promise<void> {
    this.throwIfNotInitialized();
    const msalInstance = this.msalInstance!;

    if (this.isLoginInProgress) {
      console.log("Login already in progress");
      return;
    }

    try {
      this.isLoginInProgress = true;

      // Check for active account
      const activeAccount = msalInstance.getActiveAccount();
      if (activeAccount) {
        account.set(activeAccount);
        isAuthenticated.set(true);
        return;
      }

      // Check existing accounts
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        try {
          const request: SilentRequest = {
            ...msalConfigManager.getLoginRequest(),
            account: accounts[0],
          };

          const response = await msalInstance.acquireTokenSilent(request);
          account.set(response.account);
          isAuthenticated.set(true);
          return;
        } catch (silentError) {
          if (!(silentError instanceof InteractionRequiredAuthError)) {
            throw silentError;
          }
          // Continue with popup if silent token acquisition fails
        }
      }

      const loginRequest = msalConfigManager.getLoginRequest();
      const response = await msalInstance.loginPopup(loginRequest);
      account.set(response.account);
      isAuthenticated.set(true);
    } catch (err) {
      error.set(err as Error);
      console.error("Error during login:", err);
      throw err;
    } finally {
      this.isLoginInProgress = false;
    }
  }

  async logout(): Promise<void> {
    this.throwIfNotInitialized();
    const msalInstance = this.msalInstance!;

    try {
      const activeAccount = msalInstance.getActiveAccount();
      await msalInstance.logoutPopup({
        account: activeAccount ?? undefined,
        mainWindowRedirectUri: window.location.origin,
      });
      account.set(null);
      isAuthenticated.set(false);
    } catch (err) {
      error.set(err as Error);
      console.error("Error during logout:", err);
      throw err;
    }
  }

  async getAccessToken(): Promise<string> {
    this.throwIfNotInitialized();
    const msalInstance = this.msalInstance!;

    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error("No active account");
      }

      const request: SilentRequest = {
        ...msalConfigManager.getLoginRequest(),
        account: accounts[0],
      };

      const response = await msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        const request = msalConfigManager.getLoginRequest();
        const response = await msalInstance.acquireTokenPopup(request);
        return response.accessToken;
      }
      throw err;
    }
  }

  getMsalInstance(): PublicClientApplication {
    this.throwIfNotInitialized();
    return this.msalInstance!;
  }

  getCurrentAccount(): AccountInfo | null {
    this.throwIfNotInitialized();
    return this.msalInstance!.getActiveAccount();
  }
}

export const authService = new AuthService();
