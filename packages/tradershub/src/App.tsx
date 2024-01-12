import React from 'react';
import { APIProvider } from '@deriv/api';
import { Provider } from '@deriv/library';
import { BreakpointProvider } from '@deriv/quill-design';
import AppContent from './AppContent';
import { ContentSwitcher } from './components';
import './index.scss';

const App = () => (
    <APIProvider standalone>
        <BreakpointProvider>
            <Provider.CFDProvider>
                <Provider.ModalProvider>
                    <ContentSwitcher>
                        <AppContent />
                    </ContentSwitcher>
                </Provider.ModalProvider>
            </Provider.CFDProvider>
        </BreakpointProvider>
    </APIProvider>
);

export default App;
