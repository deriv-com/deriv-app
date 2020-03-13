import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, Input } from '@deriv/components';
// eslint-disable-next-line import/extensions
import { getAppId, getSocketURL } from '../../config.js';

const InputField = props => {
    return (
        <Field name={props.name}>
            {({ field, form: { errors, touched } }) => (
                <React.Fragment>
                    <Input
                        type='text'
                        autoComplete='off'
                        maxLength='30'
                        error={touched[field.name] && errors[field.name]}
                        {...field}
                        {...props}
                    />
                </React.Fragment>
            )}
        </Field>
    );
};

// doesn't need localization as it's for internal use
const Endpoint = () => (
    <Formik
        initialValues={{
            app_id: getAppId(),
            server: getSocketURL(),
        }}
        validate={values => {
            const errors = {};

            if (!values.app_id) {
                errors.app_id = 'App ID is required.';
            } else if (!/^\d+$/.test(values.app_id)) {
                errors.app_id = 'Please enter a valid app ID.';
            }

            if (!values.server) {
                errors.server = 'Server is required.';
            } else if (!/^[\w|\.]+$/.test(values.server)) {
                errors.server = 'Please enter a valid server.';
            }

            return errors;
        }}
        onSubmit={values => {
            localStorage.setItem('config.app_id', values.app_id);
            localStorage.setItem('config.server_url', values.server);
            location.reload();
        }}
    >
        {({ errors, isSubmitting, touched, values }) => (
            <Form style={{ width: '30vw', minWidth: '300px', margin: '20vh auto' }}>
                <h1
                    style={{
                        fontWeight: 'bold',
                        color: 'var(--text-prominent)',
                        marginBottom: '1.6rem',
                        fontSize: 'var(--text-size-s)',
                        lineHeight: 'normal',
                    }}
                >
                    Change API endpoint
                </h1>
                <InputField name='server' label='Server' hint='e.g. frontend.binaryws.com' />
                <InputField
                    name='app_id'
                    label='OAuth App ID'
                    hint={
                        <React.Fragment>
                            Register an{' '}
                            <a
                                href='https://developers.binary.com/applications/'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                app ID
                            </a>{' '}
                            to use the above server for logging in.
                        </React.Fragment>
                    }
                />
                <Button
                    type='submit'
                    is_disabled={
                        !!(
                            (!touched.server && !touched.app_id) ||
                            !values.server ||
                            !values.app_id ||
                            errors.server ||
                            errors.app_id ||
                            isSubmitting
                        )
                    }
                    text='Submit'
                    primary
                />
                <span style={{ marginLeft: '1.6rem' }} />
                <Button
                    type='button'
                    onClick={() => {
                        localStorage.removeItem('config.app_id');
                        localStorage.removeItem('config.server_url');
                        location.reload();
                    }}
                    text='Reset to original settings'
                    secondary
                />
            </Form>
        )}
    </Formik>
);

export default Endpoint;
