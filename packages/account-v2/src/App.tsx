import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { AppOverlay } from './components/AppOverlay';
import { RouteLinks } from './router/components/RouteLinks';
import './index.scss';

const App: React.FC = () => {
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
