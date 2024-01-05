import React, { FC } from 'react';
import { APIProvider } from '@deriv/api';
import { Provider } from '@deriv/library';
import { BreakpointProvider } from '@deriv/quill-design';
import AppContent from './AppContent';
import { ContentSwitcher } from './components';
import './index.scss';

const App: FC = () => (
    <APIProvider standalone>
        <BreakpointProvider>
            <Provider.ModalProvider>
                <Provider.CFDProvider>
                    <ContentSwitcher>
                        <AppContent />
                    </ContentSwitcher>
                </Provider.CFDProvider>
            </Provider.ModalProvider>
        </BreakpointProvider>
    </APIProvider>
);

export default App;
