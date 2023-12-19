import React from 'react';
import { APIProvider } from '@deriv/api';
import AppContent from './AppContent';
import { ModalProvider } from './components';
import './index.scss';

const App: React.FC = () => (
    <APIProvider standalone>
        <ModalProvider>
            <AppContent />
        </ModalProvider>
    </APIProvider>
);

export default App;
