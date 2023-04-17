import { Field } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Input } from '@deriv/components';
import { routes, validNumber } from '@deriv/shared';
import { localize } from '@deriv/translations';
import BriefModal from './brief-modal.jsx';
import SummaryModal from './summary-modal.jsx';
import { observer, useStore } from '@deriv/stores';

const IntervalField = ({ values, touched, errors, handleChange, handleBlur }) => (
    <div className='reality-check__fieldset'>
        <Field name='interval'>
            {({ field }) => (
                <Input
                    {...field}
                    data-lpignore='true'
                    type='text'
                    label={localize('Time interval')}
                    value={values.interval}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    hint={localize('Interval should be between 10-60 minutes')}
                    required
                    error={touched.interval && errors.interval}
                    autoComplete='off'
                    maxLength='2'
                />
            )}
        </Field>
    </div>
);

const RealityCheckModal = observer(() => {
    const { client, common, ui } = useStore();
    const { server_time } = common;
    const {
        logout: logoutClient,
        country_standpoint,
        is_reality_check_visible: is_visible,
        reality_check_dismissed,
        reality_check_duration,
        setRealityCheckDuration,
        setVisibilityRealityCheck,
    } = client;
    const { enableApp, disableApp, setReportsTabIndex } = ui;
    const is_mx = client.landing_company_shortcode === 'iom';
    const history = useHistory();

    const openPositions = () => {
        // index of open positions in reports' side menu is 0
        setReportsTabIndex(0);
        history.push(routes.positions);
        setVisibilityRealityCheck(0);
    };

    const openStatement = () => {
        // index of statement in reports' side menu is 2
        setReportsTabIndex(2);
        history.push(routes.statement);
        setVisibilityRealityCheck(0);
    };

    const validateForm = values => {
        const error = {};

        if (!values.interval) {
            error.interval = localize('This field is required.');
        } else {
            const { is_ok, message } = validNumber(values.interval, { type: 'number', min: 10, max: 60 });
            if (!is_ok) error.interval = message;
        }

        return error;
    };

    const onSubmit = values => {
        setVisibilityRealityCheck(0);
        setRealityCheckDuration(values.interval);
    };

    // if user has seen the brief once and set
    // the initial reality check interval
    // we can show the summary from now on
    if (!reality_check_dismissed && reality_check_duration) {
        return (
            <SummaryModal
                disableApp={disableApp}
                enableApp={enableApp}
                is_visible={is_visible}
                openPositions={openPositions}
                openStatement={openStatement}
                validateForm={validateForm}
                onSubmit={onSubmit}
                logout={logoutClient}
                reality_check_duration={reality_check_duration}
                server_time={server_time}
                IntervalField={IntervalField}
            />
        );
    }

    return (
        <BriefModal
            country_standpoint={country_standpoint}
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={is_visible}
            is_mx={is_mx}
            openStatement={openStatement}
            validateForm={validateForm}
            onSubmit={onSubmit}
            logout={logoutClient}
            IntervalField={IntervalField}
        />
    );
});

export default RealityCheckModal;
