import React, { FC } from 'react';
import { APIProvider } from '@deriv/api';
import { Provider } from '@deriv/library';
import { BreakpointProvider } from '@deriv/quill-design';
import AppContent from './AppContent';
import './index.scss';

const App: FC = () => (
    <APIProvider standalone>
        <BreakpointProvider>
            <Provider.CFDProvider>
                <Provider.ModalProvider>
                    <AppContent />
                </Provider.ModalProvider>
            </Provider.CFDProvider>
        </BreakpointProvider>
    </APIProvider>
);

export default App;
