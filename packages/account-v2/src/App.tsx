import React from 'react';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import { FormProgress } from './components/form-progress';
import SignupWizard from './components/SignupWizard';
import { SignupWizardProvider, useSignupWizardContext } from './context/SignupWizardContext';
import { stepProgress } from './mocks/form-progress.mock';
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
                    {/* [TODO]:Mock - Remove hardcoded initial value once isActive comes from Modal */}
                    <FormProgress activeStep={1} steps={stepProgress} />
                </SignupWizardProvider>
            </BreakpointProvider>
        </APIProvider>
    );
};

export default App;
