import React from 'react';
import { CFDProvider, ModalProvider, RealAccountCreationProvider, UIProvider } from '@/providers';
import { APIProvider } from '@deriv/api';
import AppContent from './AppContent';
import './index.scss';

const App = () => (
    <UIProvider>
        <APIProvider standalone>
            <CFDProvider>
                <ModalProvider>
                    <RealAccountCreationProvider>
                        <AppContent />
                    </RealAccountCreationProvider>
                </ModalProvider>
            </CFDProvider>
        </APIProvider>
    </UIProvider>
);

export default App;
