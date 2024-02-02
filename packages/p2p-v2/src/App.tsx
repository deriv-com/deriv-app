import React from 'react';
import { APIProvider } from '@deriv/api';
import AppContent from './routes/AppContent';
import { Router } from './routes';
import './index.scss';
import { BreakpointProvider } from './providers';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <BreakpointProvider>
                <Router />
                <AppContent />
            </BreakpointProvider>
        </APIProvider>
    );
};
export default App;
