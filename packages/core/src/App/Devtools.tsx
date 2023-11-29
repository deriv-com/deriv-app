import React, { useState } from 'react';
import { Button, Checkbox, Input } from '@deriv/components';
import { getAppId, getDebugServiceWorker, getSocketURL } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useFormik } from 'formik';
import './Devtools.scss';

const EndpointSection = observer(() => {
    const formik = useFormik({
        initialValues: {
            app_id: getAppId(),
            server: getSocketURL(),
            is_debug_service_worker_enabled: !!getDebugServiceWorker(),
        },
        onSubmit: values => {
            localStorage.setItem('config.app_id', values.app_id.toString());
            localStorage.setItem('config.server_url', values.server);
            localStorage.setItem('debug_service_worker', (values.is_debug_service_worker_enabled ? 1 : 0).toString());
            sessionStorage.removeItem('config.platform');
            location.reload();
        },
        validate: values => {
            const errors: Record<string, string> = {};

            if (!values.app_id) {
                errors.app_id = 'App ID is required.';
            } else if (!/^\d+$/.test(values.app_id.toString())) {
                errors.app_id = 'Please enter a valid app ID.';
            }

            if (!values.server) {
                errors.server = 'Server is required.';
            } else if (!/^[\w|\-|.]+$/.test(values.server)) {
                errors.server = 'Please enter a valid server.';
            }

            return errors;
        },
    });

    return (
        <div className='devtools__endpoint-container'>
            <Input
                type='text'
                autoComplete='off'
                maxLength={30}
                error={formik.touched.server ? formik.errors.server : undefined}
                label='Server'
                hint='e.g. frontend.derivws.com'
                {...formik.getFieldProps('server')}
            />
            <Input
                type='text'
                autoComplete='off'
                maxLength={30}
                error={formik.touched.app_id ? formik.errors.app_id : undefined}
                label='OAuth App ID'
                hint={
                    <React.Fragment>
                        Register an{' '}
                        <a href='https://developers.binary.com/applications/' target='_blank' rel='noopener noreferrer'>
                            app ID
                        </a>{' '}
                        to use the above server for logging in.
                    </React.Fragment>
                }
                {...formik.getFieldProps('app_id')}
            />
            <Checkbox
                classNameLabel={'devtools__checkbox-label'}
                label='Enable Service Worker registration for this URL'
                {...formik.getFieldProps('is_debug_service_worker_enabled')}
            />
            <div className='devtools__endpoint-actions'>
                <Button
                    type='submit'
                    is_disabled={!formik.isValid || !formik.dirty}
                    text='Submit'
                    primary
                    onClick={() => formik.handleSubmit()}
                />
                <Button
                    type='button'
                    onClick={() => {
                        localStorage.removeItem('config.app_id');
                        localStorage.removeItem('config.server_url');
                        location.reload();
                    }}
                    text='Reset to original settings'
                />
            </div>
        </div>
    );
});

const FeatureFlagsSection = observer(() => {
    const { feature_flags } = useStore();

    if (!feature_flags.data) return null;

    return (
        <div className='devtools__checkbox-container'>
            {Object.keys(feature_flags.data).map(flag => {
                const flag_name = flag as keyof typeof feature_flags.data;

                return (
                    <Checkbox
                        key={flag_name}
                        className='devtools__checkbox'
                        classNameLabel={'devtools__checkbox-label'}
                        label={flag_name}
                        value={feature_flags.data?.[flag_name]}
                        // @ts-expect-error Checkbox onChange type is not correct and need to be fixed.
                        onChange={e => feature_flags.update(old => ({ ...old, [flag_name]: e.target.checked }))}
                    />
                );
            })}
        </div>
    );
});

const Devtools = observer(() => {
    const [is_devtool_open, setIsDevtoolOpen] = useState(false);

    return (
        <div>
            <div className={`devtools__panel devtools__panel${is_devtool_open ? '--open' : '--close'}`}>
                <div className='devtools__panel-left'>
                    <p className='devtools__panel-title'>Endpoint</p>
                    <EndpointSection />
                </div>
                <div className='devtools__panel-right'>
                    <p className='devtools__panel-title'>Feature flags</p>
                    <FeatureFlagsSection />
                </div>
                <button onClick={() => setIsDevtoolOpen(!is_devtool_open)} className='devtools__close-button'>
                    Close
                </button>
            </div>
            <button onClick={() => setIsDevtoolOpen(!is_devtool_open)} className='devtools__toggle-button'>
                {`</>`}
            </button>
        </div>
    );
});

// @ts-expect-error Here we check if the code is running on the production environment,
// we will return a null component instead of the actual devtools component. Hence the TS error is expected.
const ProductionSafeDevtools: typeof Devtools = process.env.NODE_ENV !== 'development' ? () => null : Devtools;

export default ProductionSafeDevtools;
