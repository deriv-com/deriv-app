import React from 'react';
import { APIProvider } from '@deriv/api-v2';
import { ModalProvider } from './components/ModalProvider';
import AppContent from './AppContent';
import WalletsAuthProvider from './AuthProvider';
import './styles/fonts.scss';
import './index.scss';
import './translations/i18n';

const App: React.FC = () => (
    <APIProvider standalone>
        <WalletsAuthProvider>
            <ModalProvider>
                <AppContent />
            </ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

export default App;
