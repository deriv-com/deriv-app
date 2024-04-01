import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import AppContent from './routes/AppContent';
import { Router } from './routes';
import './index.scss';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <AuthProvider>
                <QueryParamProvider adapter={ReactRouter5Adapter}>
                    <Router />
                    <AppContent />
                </QueryParamProvider>
            </AuthProvider>
        </APIProvider>
    );
};
export default App;
