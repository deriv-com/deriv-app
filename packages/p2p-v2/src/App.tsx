import React from 'react';
import { APIProvider } from '@deriv/api';
import { Router } from './routes';
import { Verification } from './components/Verification';

const App: React.FC = () => (
    <APIProvider standalone>
        <Verification />
        <Router />
    </APIProvider>
);
export default App;
