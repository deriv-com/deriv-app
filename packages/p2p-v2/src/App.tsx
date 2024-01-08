import React from 'react';
import { APIProvider } from '@deriv/api';
import { Router } from './routes';

const App = () => (
    <APIProvider standalone>
        <Router />
    </APIProvider>
);
export default App;
