import React from 'react';
import { APIProvider } from '@deriv/api';
import AppContent from './AppContent';
import './index.scss';

const App: React.FC = () => (
    <APIProvider>
        <AppContent />;
    </APIProvider>
);

export default App;
