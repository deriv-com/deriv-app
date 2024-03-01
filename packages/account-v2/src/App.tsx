/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Formik } from 'formik';
import { APIProvider } from '@deriv/api';
import { AppOverlay } from './components/AppOverlay';
import RouteLinks from './router/components/route-links/route-links';
import { getNameDOBValidationSchema } from './utils/personal-details-utils';
import { PersonalDetailsFormWithExample } from './containers';
import './index.scss';

const schema = getNameDOBValidationSchema();

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <Formik initialValues={schema.getDefault()} onSubmit={() => {}} validationSchema={schema}>
                <PersonalDetailsFormWithExample />
            </Formik>
            <AppOverlay title='Settings'>
                <RouteLinks />
            </AppOverlay>
        </APIProvider>
    );
};

export default App;
