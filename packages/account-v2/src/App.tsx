import React from 'react';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import SignupWizard from './components/SignupWizard';
import { SignupWizardProvider, useSignupWizardContext } from './context/SignupWizardContext';
import './index.scss';

const TriggerSignupWizardModal: React.FC = () => {
    const { setIsWizardOpen } = useSignupWizardContext();

    return <button onClick={() => setIsWizardOpen(true)}>Show SignupWizardModal</button>;
};

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <BreakpointProvider>
                <div className=' text-solid-slate-500 text-heading-h1'>Account V2</div>
                <SignupWizardProvider>
                    <SignupWizard />
                    <TriggerSignupWizardModal />
                </SignupWizardProvider>
            </BreakpointProvider>
        </APIProvider>
    );
};

export default App;
