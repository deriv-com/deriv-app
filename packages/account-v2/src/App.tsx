// TODO - Remove this once the IDV form is moved out
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import { ManualUploadContainer } from './pages/ManualFormContainer/manual-form-container';
import RouteLinks from './router/components/route-links/route-links';
import './index.scss';

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <BreakpointProvider>
                <div className=' text-solid-slate-500 text-heading-h1'>Account V2</div>
                <ManualUploadContainer
                    selectedDocument='driving_licence'
                    setSelectedDocument={val => console.log('Called with', val)}
                />
                <RouteLinks />
            </BreakpointProvider>
        </APIProvider>
    );
};

export default App;
