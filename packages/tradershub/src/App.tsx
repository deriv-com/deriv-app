import React from 'react';
import { CFDProvider, RealAccountCreationProvider, UIProvider } from '@/providers';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import AppContent from './AppContent';
import { Modals } from './modals';
import './index.scss';

const App = () => (
    <UIProvider>
        <APIProvider standalone>
            <AuthProvider>
                <CFDProvider>
                    <RealAccountCreationProvider>
                        <AppContent />
                        <Modals />
                    </RealAccountCreationProvider>
                </CFDProvider>
            </AuthProvider>
        </APIProvider>
    </UIProvider>
);

export default App;
