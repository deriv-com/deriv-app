import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import AppContent from './AppContent';

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
