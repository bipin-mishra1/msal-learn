import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication, EventType, EventMessage, AccountInfo, AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig } from '../auth-config';

interface AuthContextProps {
    msalInstance: PublicClientApplication;
    getAccessToken: (scopes: string[]) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const msalInstance = useMemo(() => new PublicClientApplication(msalConfig), []);

    useEffect(() => {
        const activeAccount = msalInstance.getActiveAccount();
        if (!activeAccount && msalInstance.getAllAccounts().length > 0) {
            msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
        }

        const handleEvent = (event: EventMessage) => {
            if (event.eventType === EventType.LOGIN_SUCCESS) {
                const account = event.payload as AccountInfo;
                msalInstance.setActiveAccount(account);
            }
        };

        const callbackId = msalInstance.addEventCallback(handleEvent);

        return () => {
            if(callbackId) msalInstance.removeEventCallback(callbackId);
        };
    }, [msalInstance]);

    const getAccessToken = async (scopes: string[]): Promise<string | null> => {
        try {
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length === 0) {
                throw new Error('No accounts available');
            }

            const account = accounts[0];
            const response: AuthenticationResult = await msalInstance.acquireTokenSilent({
                scopes,
                account
            });
            return response.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                try {
                    const response: AuthenticationResult = await msalInstance.acquireTokenPopup({
                        scopes
                    });
                    return response.accessToken;
                } catch (popupError) {
                    console.error('Error acquiring token via popup:', popupError);
                    return null;
                }
            } else {
                console.error('Error acquiring token silently:', error);
                return null;
            }
        }
    };

    return (
        <AuthContext.Provider value={{ msalInstance, getAccessToken }}>
            <MsalProvider instance={msalInstance}>
                {children}
            </MsalProvider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
