import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import AppContent from './routes/AppContent';
import { Router } from './routes';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <AuthProvider>
                <Router />
                <AppContent />
            </AuthProvider>
        </APIProvider>
    );
};
export default App;
