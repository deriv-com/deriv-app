/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { AppOverlay } from './components/AppOverlay';
import { RouteLinks } from './router/components/RouteLinks';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <AuthProvider>
                <div id='account_modal' />
                <AppOverlay title='Settings'>
                    <RouteLinks />
                </AppOverlay>
            </AuthProvider>
        </APIProvider>
    );
};

export default App;
