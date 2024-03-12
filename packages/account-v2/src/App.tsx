/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { AppOverlay } from './components/AppOverlay';
import { RouteLinks } from './router/components/RouteLinks';
import { POIFlowContainer } from './containers';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <AuthProvider>
                {/* [TODO]: Replace this hardcoded countryCode with Country selector */}
                <POIFlowContainer countryCode='in' />
                <AppOverlay title='Settings'>
                    <RouteLinks />
                </AppOverlay>
            </AuthProvider>
        </APIProvider>
    );
};

export default App;
