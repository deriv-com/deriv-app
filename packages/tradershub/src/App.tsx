import React from 'react';
import { UIProvider } from '@/components';
import { APIProvider } from '@deriv/api';
import { Provider } from '@deriv/library';
import { SignupWizardProvider } from './providers/SignupWizardProvider';
import AppContent from './AppContent';
import './index.scss';

const App = () => (
    <UIProvider>
        <APIProvider standalone>
            <Provider.CFDProvider>
                <Provider.ModalProvider>
                    <SignupWizardProvider>
                        <AppContent />
                    </SignupWizardProvider>
                </Provider.ModalProvider>
            </Provider.CFDProvider>
        </APIProvider>
    </UIProvider>
);

export default App;
