import React from 'react';
import { APIProvider } from '@deriv/api';
import AppContent from './AppContent';

const App: React.FC = () => (
    <APIProvider standalone>
        <AppContent />;
    </APIProvider>
);

export default App;
