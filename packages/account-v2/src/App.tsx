import React from 'react';
import { APIProvider } from '@deriv/api';

const App: React.FC = () => (
    <APIProvider standalone>
        <div>Account</div>
    </APIProvider>
);

export default App;
