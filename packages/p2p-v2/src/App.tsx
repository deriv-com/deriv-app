import React from 'react';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import AppContent from './routes/AppContent';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <AuthProvider>
                <QueryParamProvider adapter={ReactRouter5Adapter}>
                    <AppContent />
                </QueryParamProvider>
            </AuthProvider>
        </APIProvider>
    );
};
export default App;
