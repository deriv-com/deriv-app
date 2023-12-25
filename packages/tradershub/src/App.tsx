import React, { FC } from 'react';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import AppContent from './AppContent';
import { ModalProvider } from './components';
import './index.scss';

const App: FC = () => (
    <APIProvider standalone>
        <ModalProvider>
            <BreakpointProvider>
                <AppContent />
            </BreakpointProvider>
            <AppContent />
        </ModalProvider>
    </APIProvider>
);

export default App;
