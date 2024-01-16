/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Formik } from 'formik';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons';
import { FormProgress } from './components/form-progress';
import { stepProgress } from './mocks/form-progress.mock';
import { INITIAL_VALUES, SELECTED_COUNTRY } from './mocks/idv-form.mock';
import { IDVForm } from './modules/IDVForm';
import './index.scss';

const App: React.FC = () => (
    <APIProvider standalone>
        <BreakpointProvider>
            <div className='text-heading-h1 text-solid-slate-500'>Account V2</div>
            <div className='p-300'>
                <BrandDerivLogoCoralIcon height='120px' width='120px' />
            </div>
            {/* [TODO]:Mock - Remove hardcoded initial value once isActive comes from Modal */}
            <FormProgress activeStep={1} steps={stepProgress} />
            {/* [TODO]:Mock - Remove The formik handler when the form is ready */}
            <Formik initialValues={INITIAL_VALUES} onSubmit={() => {}}>
                <IDVForm selectedCountry={SELECTED_COUNTRY} />
            </Formik>
        </BreakpointProvider>
    </APIProvider>
);

export default App;
