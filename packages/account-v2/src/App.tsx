import React from 'react';
import { APIProvider } from '@deriv/api';
import './index.scss';
import { StepConnector } from './components';

const App: React.FC = () => (
    <APIProvider standalone>
        <div>Account</div>
        <StepConnector />
    </APIProvider>
);

export default App;
