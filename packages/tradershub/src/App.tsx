import React from 'react';
import { CFDProvider, ModalProvider, RealAccountCreationProvider, UIProvider } from '@/providers';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import AppContent from './AppContent';
import './index.scss';

const App = () => (
    <UIProvider>
        <APIProvider standalone>
            <AuthProvider>
                <CFDProvider>
                    <ModalProvider>
                        <RealAccountCreationProvider>
                            <AppContent />
                        </RealAccountCreationProvider>
                    </ModalProvider>
                </CFDProvider>
            </AuthProvider>
        </APIProvider>
    </UIProvider>
);

export default App;
