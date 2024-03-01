import React from 'react';
import { APIProvider } from '@deriv/api';
import { RouteLinks } from './router/components/RouteLinks';
import './index.scss';

const App: React.FC = () => (
    <APIProvider standalone>
        <RouteLinks />
    </APIProvider>
);

export default App;
