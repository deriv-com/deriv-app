/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { AppOverlay } from './components/AppOverlay';
import { RouteLinks } from './router/components/RouteLinks';
import { ACCOUNT_MODAL_REF } from './constants';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <AuthProvider>
                {/* This will be the used to bind modal in Accounts-v2 package*/}
                <div id={ACCOUNT_MODAL_REF.replace('#', '')} />
                <AppOverlay title='Settings'>
                    <RouteLinks />
                </AppOverlay>
            </AuthProvider>
        </APIProvider>
    );
};

export default App;
