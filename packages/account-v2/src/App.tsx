import React from 'react';
import { APIProvider } from '@deriv/api';
import { AppOverlay } from './components/AppOverlay';
import { RouteLinks } from './router/components/RouteLinks';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <AppOverlay title='Settings'>
                <RouteLinks />
            </AppOverlay>
        </APIProvider>
    );
};

export default App;
