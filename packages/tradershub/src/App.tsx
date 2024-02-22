import React from 'react';
import { UIProvider } from '@/components';
import { RealAccountCreationProvider } from '@/providers';
import { APIProvider } from '@deriv/api';
import { Provider } from '@deriv/library';
import AppContent from './AppContent';
import './index.scss';

const App = () => (
    <UIProvider>
        <APIProvider standalone>
            <Provider.CFDProvider>
                <Provider.ModalProvider>
                    <RealAccountCreationProvider>
                        <AppContent />
                    </RealAccountCreationProvider>
                </Provider.ModalProvider>
            </Provider.CFDProvider>
        </APIProvider>
    </UIProvider>
);

export default App;
