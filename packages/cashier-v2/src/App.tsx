import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import AppContent from './AppContent';
import '@deriv-lib/account-v2-lib/dist/css/index.css';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </APIProvider>
    );
};
export default App;
