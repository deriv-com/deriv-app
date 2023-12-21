import React, { FC } from 'react';
import MockComponent from '@deriv/account-v2';
import { APIProvider } from '@deriv/api';
import AppContent from './AppContent';
import { ModalProvider } from './components';
import './index.scss';

const App: FC = () => (
    <APIProvider standalone>
        <ModalProvider>
            <MockComponent />
            <AppContent />
        </ModalProvider>
    </APIProvider>
);

export default App;
