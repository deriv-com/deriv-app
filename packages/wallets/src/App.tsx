import React from 'react';
import { APIProvider } from '@deriv/api';
import { ModalProvider } from './components/ModalProvider';
import AppContent from './AppContent';
import './styles/fonts.scss';
import './index.scss';
import './translations/i18n';

const App: React.FC = () => (
    <APIProvider customLoginIDKey='active_wallet_loginid' standalone>
        <ModalProvider>
            <AppContent />
        </ModalProvider>
    </APIProvider>
);

export default App;
