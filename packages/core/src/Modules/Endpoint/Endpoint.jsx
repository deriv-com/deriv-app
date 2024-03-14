import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, Checkbox, Input, Text } from '@deriv/components';
import { getAppId, getDebugServiceWorker, getSocketURL } from '@deriv/shared';
import { FeatureFlagsSection } from './FeatureFlagsSection';

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
const Endpoint = () => {
    return (
        <Formik
            initialValues={{
                app_id: getAppId(),
                server: getSocketURL(),
                is_debug_service_worker_enabled: !!getDebugServiceWorker(),
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
                }

                return errors;
            }}
            onSubmit={values => {
                localStorage.setItem('config.app_id', values.app_id);
                localStorage.setItem('config.server_url', values.server);
                localStorage.setItem('debug_service_worker', values.is_debug_service_worker_enabled ? 1 : 0);
                sessionStorage.removeItem('config.platform');
                location.reload();
            }}
        >
            {({ errors, isSubmitting, touched, values, handleChange, setFieldTouched }) => (
                <Form className='endpoint'>
                    <div className='endpoint__title'>
                        <Text as='h1' weight='bold' color='prominent'>
                            Change API endpoint
                        </Text>
                    </div>
                    <InputField name='server' label='Server' hint='e.g. frontend.derivws.com' />
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
                    <Field name='is_debug_service_worker_enabled'>
                        {({ field }) => (
                            <div className='endpoint__checkbox'>
                                <Checkbox
                                    {...field}
                                    label='Enable Service Worker registration for this URL'
                                    value={values.is_debug_service_worker_enabled}
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldTouched('is_debug_service_worker_enabled', true);
                                    }}
                                />
                            </div>
                        )}
                    </Field>
                    <Button
                        type='submit'
                        is_disabled={
                            !!(
                                (!touched.server && !touched.app_id && !touched.is_debug_service_worker_enabled) ||
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
                    <FeatureFlagsSection />
                </Form>
            )}
        </Formik>
    );
};

export default Endpoint;
