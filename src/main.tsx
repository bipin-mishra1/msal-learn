import { createRoot } from 'react-dom/client';

import App from './App';

import { AuthProvider } from './hooks/auth-provider';
import React from 'react';


const rootElement = document.getElementById('root');

if (rootElement) {
    createRoot(rootElement).render(
      <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
    );
} else {
    console.error('Root element not found');
}
