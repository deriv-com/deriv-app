import React from 'react';
import { APIProvider } from '@deriv/api';
import { ModalProvider } from './components/ModalProvider';
import AppContent from './AppContent';
import './styles/fonts.scss';
import './index.scss';

const App: React.FC = () => (
    <APIProvider>
        <ModalProvider>
            <AppContent />
        </ModalProvider>
    </APIProvider>
);

export default App;
