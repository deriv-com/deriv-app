import React from 'react';
import { APIProvider } from '@deriv/api';
import RouteLinks from './router/components/route-links/route-links';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <RouteLinks />
        </APIProvider>
    );
};

export default App;
