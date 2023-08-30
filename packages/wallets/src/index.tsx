import React from 'react';
import { APIProvider } from '@deriv/api';
import AppContent from './AppContent';

const App: React.FC = () => (
    <APIProvider>
        <AppContent />;
    </APIProvider>
);

export default App;
