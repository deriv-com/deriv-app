import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { ModalProvider } from './components/ModalProvider';
import AppContent from './AppContent';
import './styles/fonts.scss';
import './index.scss';
import './translations/i18n';

const App: React.FC = () => (
    <APIProvider standalone>
        <AuthProvider loginIDKey='active_wallet_loginid'>
            <ModalProvider>
                <AppContent />
            </ModalProvider>
        </AuthProvider>
    </APIProvider>
);

export default App;
