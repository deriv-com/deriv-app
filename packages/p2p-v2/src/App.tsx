import React from 'react';
import { APIProvider } from '@deriv/api';
import AppContent from './routes/AppContent';
import { Router } from './routes';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <Router />
            <AppContent />
        </APIProvider>
    );
};
export default App;
