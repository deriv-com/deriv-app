// TODO - Remove this once the IDV form is moved out
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Formik } from 'formik';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import { FormProgress } from './components/form-progress';
import SignupWizard from './components/SignupWizard';
import { SignupWizardProvider, useSignupWizardContext } from './context/SignupWizardContext';
import { stepProgress } from './mocks/form-progress.mock';
import { INITIAL_VALUES, SELECTED_COUNTRY } from './mocks/idv-form.mock';
import { IDVForm } from './modules/IDVForm';
import { getIDVFormValidationSchema } from './modules/IDVForm/utils';
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
                {/* [TODO]:Mock - Remove Mock values */}
                <Formik
                    initialValues={INITIAL_VALUES}
                    onSubmit={() => {}}
                    validationSchema={getIDVFormValidationSchema}
                >
                    <IDVForm selectedCountry={SELECTED_COUNTRY} />
                </Formik>
            </BreakpointProvider>
        </APIProvider>
    );
};

export default App;
