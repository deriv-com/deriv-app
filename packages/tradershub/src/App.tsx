import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api';
import { Provider } from '@deriv/library';
import { BreakpointProvider } from '@deriv/quill-design';
import { SignupWizardProvider } from './providers/SignupWizardProvider';
import AppContent from './AppContent';
import { UIProvider } from './components';
import './index.scss';

const App = () => (
    <UIProvider>
        <APIProvider standalone>
            <AuthProvider>
                <BreakpointProvider>
                    <Provider.CFDProvider>
                        <Provider.ModalProvider>
                            <SignupWizardProvider>
                                <AppContent />
                            </SignupWizardProvider>
                        </Provider.ModalProvider>
                    </Provider.CFDProvider>
                </BreakpointProvider>
            </AuthProvider>
        </APIProvider>
    </UIProvider>
);

export default App;
