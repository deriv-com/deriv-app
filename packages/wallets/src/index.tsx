import React from 'react';
import { APIProvider } from '@deriv/api';
import AppContent from './AppContent';
import './index.scss';

const App: React.FC = () => (
    <APIProvider standalone>
        <AppContent />;
    </APIProvider>
);

export default App;
