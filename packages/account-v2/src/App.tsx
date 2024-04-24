/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { Modal } from '@deriv-com/ui';
import { AppOverlay } from './components/AppOverlay';
import { RouteLinks } from './router/components/RouteLinks';
import { ACCOUNT_MODAL_REF } from './constants';
import './index.scss';

const App: React.FC = () => {
    Modal.setAppElement(ACCOUNT_MODAL_REF);
    return (
        <APIProvider standalone>
            <AuthProvider>
                <AppOverlay title='Settings'>
                    <RouteLinks />
                </AppOverlay>
            </AuthProvider>
        </APIProvider>
    );
};

export default App;
