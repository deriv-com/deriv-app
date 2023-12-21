import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api';
import { ModalProvider } from './components/ModalProvider';
import AppContent from './AppContent';
import './styles/fonts.scss';
import './index.scss';
import './translations/i18n';
import { setWebsocket } from '../../shared/src/services';

const App = ({ passthrough }: { passthrough: Record<string, any> }) => {
    setWebsocket(passthrough.WS);

    return (
        <APIProvider>
            <AuthProvider>
                <ModalProvider>
                    <AppContent />
                </ModalProvider>
            </AuthProvider>
        </APIProvider>
    );
};

export default App;
