// TODO - Remove this once the IDV form is moved out
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Formik } from 'formik';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import { DOCUMENT_LIST, INITIAL_VALUES, SELECTED_COUNTRY } from './mocks/idv-form.mock';
import RouteLinks from './router/components/route-links/route-links';
import { getIDVFormValidationSchema } from './utils/idv-form-utils';
import { IDVForm } from './modules';
import './index.scss';

const App: React.FC = () => {
    const validationSchema = getIDVFormValidationSchema(DOCUMENT_LIST[0]);

    return (
        <APIProvider standalone>
            <BreakpointProvider>
                <div className=' text-solid-slate-500 text-heading-h1'>Account V2</div>
                <Formik initialValues={INITIAL_VALUES} onSubmit={() => {}} validationSchema={validationSchema}>
                    <IDVForm selectedCountry={SELECTED_COUNTRY} />
                </Formik>
                <RouteLinks />
            </BreakpointProvider>
        </APIProvider>
    );
};

export default App;
