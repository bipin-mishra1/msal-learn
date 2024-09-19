import { Configuration, LogLevel as MsalLogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
    auth: {
        clientId: "27b8d109-7f21-430d-bbf0-a2ed5a83c8a5",
        authority: "https://login.microsoftonline.com/556e6b1f-b49d-4278-8baf-db06eeefc8e9",
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: false
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: MsalLogLevel, message: string, containsPii: boolean) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case MsalLogLevel.Error:
                        console.error(message);
                        break;
                    case MsalLogLevel.Info:
                        console.info(message);
                        break;
                    case MsalLogLevel.Verbose:
                        console.debug(message);
                        break;
                    case MsalLogLevel.Warning:
                        console.warn(message);
                        break;
                    default:
                        break;
                }
            }
        }
    }
};

// Define the login request with type annotations
export const loginRequest = {
    scopes: ['user.read'] as string[],
};
