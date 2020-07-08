import { Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Input, Button } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getPreBuildDVRs, validNumber } from 'Utils/Validator/declarative-validation-rules';
import BriefModal from './brief-modal.jsx';
import SummaryModal from './summary-modal.jsx';

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

const SubmitButtons = ({ logout, values, isValid, isSubmitting }) => (
    <div>
        <Button type='button' secondary large onClick={logout}>
            {localize('Log out')}
        </Button>
        <Button type='submit' is_disabled={!values.interval || !isValid || isSubmitting} primary large>
            <Localize i18n_default_text='Continue trading' />
        </Button>
    </div>
);

const RealityCheckModal = withRouter(
    ({
        disableApp,
        enableApp,
        history,
        logoutClient,
        is_visible,
        reality_check_duration,
        server_time,
        setRealityCheckDuration,
        setReportsTabIndex,
        setVisibilityRealityCheck,
    }) => {
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
            } else if (!validNumber(values.interval, { type: 'number', min: 10, max: 60 })) {
                error.interval = getPreBuildDVRs().number.message;
            }

            return error;
        };

        const onSubmit = values => {
            setRealityCheckDuration(values.interval);
            setVisibilityRealityCheck(0);
        };

        const logout = () => {
            logoutClient();
            setVisibilityRealityCheck(0);
        };

        // if user has seen the brief once and set
        // the initial reality check interval
        // we can show the summary from now on
        if (reality_check_duration) {
            return (
                <SummaryModal
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_visible={is_visible}
                    openPositions={openPositions}
                    openStatement={openStatement}
                    validateForm={validateForm}
                    onSubmit={onSubmit}
                    logout={logout}
                    reality_check_duration={reality_check_duration}
                    server_time={server_time}
                    IntervalField={IntervalField}
                    SubmitButtons={SubmitButtons}
                />
            );
        }

        return (
            <BriefModal
                disableApp={disableApp}
                enableApp={enableApp}
                is_visible={is_visible}
                openStatement={openStatement}
                validateForm={validateForm}
                onSubmit={onSubmit}
                logout={logout}
                IntervalField={IntervalField}
                SubmitButtons={SubmitButtons}
            />
        );
    }
);

RealityCheckModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    history: PropTypes.object,
    logoutClient: PropTypes.func,
    is_visible: PropTypes.bool,
    reality_check_duration: PropTypes.number,
    setRealityCheckDuration: PropTypes.func,
    setReportsTabIndex: PropTypes.func,
    setVisibilityRealityCheck: PropTypes.func,
};

export default connect(({ client, common, ui }) => ({
    logoutClient: client.logout,
    is_visible: client.is_reality_check_visible,
    reality_check_duration: client.reality_check_duration,
    setRealityCheckDuration: client.setRealityCheckDuration,
    setVisibilityRealityCheck: client.setVisibilityRealityCheck,
    server_time: common.server_time,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    setReportsTabIndex: ui.setReportsTabIndex,
}))(RealityCheckModal);
