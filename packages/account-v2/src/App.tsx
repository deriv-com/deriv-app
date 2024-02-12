// TODO - Remove this once the IDV form is moved out
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Formik } from 'formik';
import { APIProvider } from '@deriv/api';
import { BreakpointProvider } from '@deriv/quill-design';
import { SelfieDocumentUpload } from './containers/SelfieDocumentUpload';
import { DOCUMENT_LIST, INITIAL_VALUES, SELECTED_COUNTRY } from './mocks/idv-form.mock';
import { IDVForm } from './modules/IDVForm';
import { getIDVFormValidationSchema } from './modules/IDVForm/utils';
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
                {/* <ManualForm onSubmit={() => {}} selectedDocument='driving_licence' /> */}
                {/* [TODO]:Mock - Remove Mock values */}
                <Formik initialValues={INITIAL_VALUES} onSubmit={() => {}} validationSchema={getValidationSchema}>
                    {/* <IDVForm selectedCountry={SELECTED_COUNTRY} /> */}
                    <SelfieDocumentUpload />
                </Formik>
                <RouteLinks />
                {/* [TODO]:Mock - Remove Mock values */}
                {/* <DocumentSelection countryCode='ng' handleOnClick={val => console.log(val)} /> */}
            </BreakpointProvider>
        </APIProvider>
    );
};

export default App;
