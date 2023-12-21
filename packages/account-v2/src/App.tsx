import React from 'react';
import { APIProvider } from '@deriv/api';
import './index.scss';

const App: React.FC = () => (
    <APIProvider standalone>
        <div>Account</div>
    </APIProvider>
);

export default App;
