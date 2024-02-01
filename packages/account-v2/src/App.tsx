// TODO - Remove this once the IDV form is moved out
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Formik } from 'formik';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import { DOCUMENT_LIST, INITIAL_VALUES, SELECTED_COUNTRY } from './mocks/idv-form.mock';
import { IDVForm } from './modules/IDVForm';
import { getIDVFormValidationSchema } from './modules/IDVForm/utils';
import { ManualForm } from './modules/ManualForm';
import RouteLinks from './router/components/route-links/route-links';
import './index.scss';

const App: React.FC = () => {
    // TODO - Remove this once the IDV form is moved out
    const getValidationSchema = getIDVFormValidationSchema(DOCUMENT_LIST);

    return (
        <APIProvider standalone>
            <BreakpointProvider>
                <div className=' text-solid-slate-500 text-heading-h1'>Account V2</div>
                {/* TODO - Remove this ManualForm later, only rendered here for testing purposes. */}
                <ManualForm selectedDocument='driving_licence' />
                {/* [TODO]:Mock - Remove Mock values */}
                <Formik initialValues={INITIAL_VALUES} onSubmit={() => {}} validationSchema={getValidationSchema}>
                    <IDVForm selectedCountry={SELECTED_COUNTRY} />
                </Formik>
                <RouteLinks />
            </BreakpointProvider>
        </APIProvider>
    );
};

export default App;
