/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Formik } from 'formik';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { AppOverlay } from './components/AppOverlay';
import { RouteLinks } from './router/components/RouteLinks';
import { getNameDOBValidationSchema } from './utils/personal-details-utils';
import { PersonalDetailsFormWithExample } from './containers';
import './index.scss';

// [TODO]: Remove schema once PersonalDetailsFormWithExample is merged
const schema = getNameDOBValidationSchema();

const App: React.FC = () => {
    return (
        <APIProvider standalone>
            <AuthProvider>
                {/* [TODO]: Remove Formik once code is merged */}
                <Formik initialValues={schema.getDefault()} onSubmit={() => {}} validationSchema={schema}>
                    <PersonalDetailsFormWithExample />
                </Formik>
                <AppOverlay title='Settings'>
                    <RouteLinks />
                </AppOverlay>
            </AuthProvider>
        </APIProvider>
    );
};

export default App;
