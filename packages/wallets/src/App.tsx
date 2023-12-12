import React from 'react';
import { APIProvider } from '@deriv/api';
import AppContent from './AppContent';
import { ModalProvider, UIProvider } from './components';
import './styles/fonts.scss';
import './index.scss';
import './translations/i18n';

const App: React.FC = () => (
    <APIProvider standalone>
        <UIProvider>
            <ModalProvider>
                <AppContent />
            </ModalProvider>
        </UIProvider>
    </APIProvider>
);

export default App;
