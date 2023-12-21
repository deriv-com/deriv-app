import React, { FC } from 'react';
import MockComponent from '@deriv/account-v2';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import AppContent from './AppContent';
import { ModalProvider } from './components';
import './index.scss';

const App: FC = () => (
    <APIProvider standalone>
        <ModalProvider>
            <MockComponent />
            <BreakpointProvider>
                <AppContent />
            </BreakpointProvider>
            <AppContent />
        </ModalProvider>
    </APIProvider>
);

export default App;
