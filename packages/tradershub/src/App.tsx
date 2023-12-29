import React, { FC } from 'react';
import { APIProvider } from '@deriv/api';
import { Provider } from '@deriv/library';
import AppContent from './AppContent';
import './index.scss';

const App: FC = () => (
    <APIProvider standalone>
        <Provider.ModalProvider>
            <Provider.CFDProvider>
                <AppContent />
            </Provider.CFDProvider>
        </Provider.ModalProvider>
    </APIProvider>
);

export default App;
