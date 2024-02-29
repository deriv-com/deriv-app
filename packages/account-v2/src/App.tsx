/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Formik } from 'formik';
import { APIProvider } from '@deriv/api';
import RouteLinks from './router/components/route-links/route-links';
import './index.scss';
import { getNameDOBValidationSchema } from './utils/personal-details-utils';
import { PersonalDetailsFormWithExample } from './containers';

const schema = getNameDOBValidationSchema();

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <RouteLinks />
            <Formik initialValues={schema.getDefault()} onSubmit={() => {}} validationSchema={schema}>
                <PersonalDetailsFormWithExample />
            </Formik>
        </APIProvider>
    );
};

export default App;
