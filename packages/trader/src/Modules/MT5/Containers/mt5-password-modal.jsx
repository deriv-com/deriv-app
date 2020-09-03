import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { FormSubmitButton, Icon, Modal, PasswordInput, PasswordMeter } from '@deriv/components';
import { isMobile, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import SuccessDialog from 'App/Containers/Modals/success-dialog.jsx';
import 'Sass/app/modules/mt5/mt5.scss';
import { connect } from 'Stores/connect';
import { validLength, validPassword, getPreBuildDVRs } from 'Utils/Validator/declarative-validation-rules';

const getSubmitText = (account_title, category) => {
    if (category === 'real') {
        return localize(
            'You have created a DMT5 {{account_title}} account. To start trading, transfer funds from your Deriv account into this account.',
            { account_title }
        );
    }

    return localize('You have created a DMT5 {{account_title}} account.', { account_title });
};

const getIconFromType = type => {
    switch (type) {
        case 'synthetic':
            return <Icon icon='IcMt5SyntheticPlatform' size={128} />;
        case 'financial':
            return <Icon icon='IcMt5FinancialPlatform' size={128} />;
        default:
            return <Icon icon='IcMt5FinancialStpPlatform' size={128} />;
    }
};

const MT5PasswordModal = ({
    account_title,
    account_type,
    disableMt5PasswordModal,
    email,
    // error_message,
    form_error,
    history,
    has_mt5_error,
    is_mt5_password_modal_enabled,
    is_mt5_success_dialog_enabled,
    setMt5SuccessDialog,
    setMt5Error,
    submitMt5Password,
}) => {
    const validatePassword = values => {
        const errors = {};

        if (
            !validLength(values.password, {
                min: 8,
                max: 25,
            })
        ) {
            errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: 25,
            });
        } else if (!validPassword(values.password)) {
            errors.password = getPreBuildDVRs().password.message;
        }
        if (values.password.toLowerCase() === email.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }

        return errors;
    };

    const closeDialogs = () => {
        setMt5SuccessDialog(false);
        setMt5Error(false);
    };

    const closeModal = () => {
        closeDialogs();
        disableMt5PasswordModal();
    };

    const closeOpenSuccess = () => {
        disableMt5PasswordModal();
        closeDialogs();
        if (account_type.category === 'real') {
            history.push(routes.cashier_acc_transfer);
        }
    };

    const IconType = () => getIconFromType(account_type.type);
    const should_show_password = is_mt5_password_modal_enabled && !has_mt5_error && !is_mt5_success_dialog_enabled;
    const should_show_success = !has_mt5_error && is_mt5_success_dialog_enabled;
    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';

    return (
        <React.Fragment>
            <Modal
                className='mt5-password-modal'
                is_open={should_show_password}
                toggleModal={closeModal}
                has_close_icon
            >
                <Formik
                    initialValues={{
                        password: '',
                    }}
                    validate={validatePassword}
                    onSubmit={(values, actions) => {
                        submitMt5Password(values.password, actions.setSubmitting);
                    }}
                >
                    {({
                        handleSubmit,
                        // setFieldValue,
                        setFieldTouched,
                        handleChange,
                        handleBlur,
                        errors,
                        values,
                        isSubmitting,
                        touched,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <h2>
                                <Localize
                                    i18n_default_text='Choose a password for your DMT5 {{ account_type }} account'
                                    values={{
                                        account_type: account_title,
                                    }}
                                />
                            </h2>
                            <div className='dc-modal__container_mt5-password-modal__body'>
                                <div className='input-element'>
                                    <PasswordMeter
                                        input={values.password}
                                        has_error={!!(touched.password && errors.password)}
                                    >
                                        {({ has_warning }) => (
                                            <PasswordInput
                                                autoComplete='password'
                                                label={localize('Create a password')}
                                                error={touched.password && errors.password}
                                                hint={
                                                    !has_warning &&
                                                    localize(
                                                        'Minimum of eight lower and uppercase English letters with numbers'
                                                    )
                                                }
                                                name='password'
                                                value={values.password}
                                                onBlur={handleBlur}
                                                onChange={e => {
                                                    setFieldTouched('password', true);
                                                    handleChange(e);
                                                }}
                                            />
                                        )}
                                    </PasswordMeter>
                                </div>
                                {is_real_financial_stp && (
                                    <div className='dc-modal__container_mt5-password-modal__description'>
                                        {localize(
                                            'Your MT5 Financial STP account will be opened through Deriv (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA). All other accounts, including your Deriv account, are not subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA).'
                                        )}
                                    </div>
                                )}
                            </div>
                            <FormSubmitButton
                                is_disabled={isSubmitting || !values.password || Object.keys(errors).length > 0}
                                has_cancel
                                cancel_label={localize('Cancel')}
                                onCancel={closeModal}
                                is_absolute={isMobile()}
                                is_loading={isSubmitting}
                                label={localize('Add account')}
                                form_error={form_error}
                            />
                        </form>
                    )}
                </Formik>
            </Modal>
            <SuccessDialog
                is_open={should_show_success}
                toggleModal={closeModal}
                onCancel={closeModal}
                onSubmit={closeOpenSuccess}
                classNameMessage='mt5-password-modal__message'
                message={getSubmitText(account_title, account_type.category)}
                // message={error_message}
                icon={<IconType />}
                icon_size='xlarge'
                text_submit={account_type.category === 'real' ? localize('Transfer now') : localize('OK')}
                has_cancel={account_type.category === 'real'}
            />
        </React.Fragment>
    );
};

MT5PasswordModal.propTypes = {
    account_title: PropTypes.string,
    account_type: PropTypes.object,
    disableMt5PasswordModal: PropTypes.func,
    email: PropTypes.string,
    error_message: PropTypes.string,
    has_mt5_error: PropTypes.bool,
    is_mt5_password_modal_enabled: PropTypes.bool,
    is_mt5_success_dialog_enabled: PropTypes.bool,
    setMt5Error: PropTypes.func,
    setMt5SuccessDialog: PropTypes.func,
    submitMt5Password: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    email: client.email,
    account_title: modules.mt5.account_title,
    account_type: modules.mt5.account_type,
    disableMt5PasswordModal: modules.mt5.disableMt5PasswordModal,
    error_message: modules.mt5.error_message,
    has_mt5_error: modules.mt5.has_mt5_error,
    is_mt5_success_dialog_enabled: modules.mt5.is_mt5_success_dialog_enabled,
    is_mt5_password_modal_enabled: modules.mt5.is_mt5_password_modal_enabled,
    setMt5Error: modules.mt5.setError,
    setMt5SuccessDialog: modules.mt5.setMt5SuccessDialog,
    submitMt5Password: modules.mt5.submitMt5Password,
}))(withRouter(MT5PasswordModal));
