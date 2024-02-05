import React from 'react';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import AppContent from './AppContent';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <BreakpointProvider>
                <AppContent />
            </BreakpointProvider>
        </APIProvider>
    );
};
export default App;
