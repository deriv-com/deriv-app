import {
    PasswordInput,
    Modal,
    PasswordMeter }           from 'deriv-components';
import { Formik }             from 'formik';
import PropTypes              from 'prop-types';
import React                  from 'react';
import SuccessDialog          from 'App/Containers/Modals/success-dialog.jsx';
import FormSubmitButton       from 'App/Containers/RealAccountSignup/form-submit-button.jsx';
import { localize, Localize } from 'deriv-translations';
import IconMT5Advanced        from 'Assets/Mt5/icon-mt5-advanced.jsx';
import IconMT5Standard        from 'Assets/Mt5/icon-mt5-standard.jsx';
import IconMT5Synthetic       from 'Assets/Mt5/icon-mt5-synthetic.jsx';
import { connect }            from 'Stores/connect';
import {
    validPassword,
    validLength }             from 'Utils/Validator/declarative-validation-rules';
import 'Sass/app/modules/mt5/mt5.scss';

const getSubmitText = (account_title, category) => {
    if (category === 'real') {
        return localize('You have created a DMT5 {{account_title}} account. To start trading, transfer funds from your Deriv account into this account.', { account_title: account_title[0].toLowerCase() + account_title.substr(1) });
    }

    return localize('You have created a Deriv {{account_title}}.', { account_title });
};

const getIconFromType = (type) => {
    switch (type) {
        case 'synthetic_indices':
            return IconMT5Synthetic;
        case 'standard':
            return IconMT5Standard;
        default:
            return IconMT5Advanced;
    }
};

const MT5PasswordModal = ({
    account_title,
    account_type,
    closeMt5AndOpenCashier,
    disableMt5PasswordModal,
    // error_message,
    form_error,
    has_mt5_error,
    is_mt5_password_modal_enabled,
    is_mt5_success_dialog_enabled,
    setMt5SuccessDialog,
    setMt5Error,
    submitMt5Password,
}) => {
    const validatePassword = (values) => {
        const is_valid = validPassword(values.password) &&
            validLength(values.password, {
                min: 8,
                max: 25,
            });
        const errors   = {};

        if (!is_valid) {
            errors.password = localize('You need to include uppercase and lowercase letters, and numbers.');
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
        closeMt5AndOpenCashier('account_transfer');
        closeDialogs();
    };

    const IconType             = getIconFromType(account_type.type);
    const should_show_password = is_mt5_password_modal_enabled && !has_mt5_error &&
        !is_mt5_success_dialog_enabled;
    const should_show_success  = !has_mt5_error && is_mt5_success_dialog_enabled;

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
                        submitMt5Password(
                            values.password,
                            actions.setSubmitting,
                        );
                    }}
                    render={({
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
                                    i18n_default_text='Choose a password for your DMT5 {{ account_type }}'
                                    values={{
                                        account_type: account_title,
                                    }}
                                />
                            </h2>
                            <div
                                className='dc-modal__container_mt5-password-modal__body'
                            >
                                <div className='input-element'>
                                    <PasswordMeter
                                        input={values.password}
                                        error={touched.password && errors.password}
                                    >
                                        <PasswordInput
                                            autoComplete='password'
                                            label={localize('MT5 Password')}
                                            name='password'
                                            value={values.password}
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setFieldTouched(
                                                    'password',
                                                    true,
                                                );
                                                handleChange(e);
                                            }}
                                        />
                                    </PasswordMeter>
                                </div>
                                <div
                                    className='dc-modal__container_mt5-password-modal__description'
                                >
                                    <p>
                                        <Localize
                                            i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters with numbers'
                                        />
                                    </p>
                                </div>
                            </div>
                            <FormSubmitButton
                                is_disabled={
                                    isSubmitting ||
                                    !values.password ||
                                    Object.keys(errors).length > 0
                                }
                                is_loading={ isSubmitting }
                                label={ localize('Add account') }
                                form_error={form_error}
                            />
                        </form>
                    )}
                />
            </Modal>
            <Modal
                className='mt5-password-modal'
                is_open={should_show_success}
                toggleModal={closeModal}
                has_close_icon={false}
            >
                <SuccessDialog
                    onCancel={closeModal}
                    onSubmit={closeOpenSuccess}
                    message={getSubmitText(account_title, account_type.category)}
                    // message={error_message}
                    icon={<IconType />}
                    icon_size='xlarge'
                    text_submit={account_type.category === 'real' ? localize('Transfer now') : localize('Ok')}
                    has_cancel={account_type.category === 'real'}
                />
            </Modal>
        </React.Fragment>
    );
};

MT5PasswordModal.propTypes = {
    account_title                : PropTypes.string,
    account_type                 : PropTypes.object,
    closeMt5AndOpenCashier       : PropTypes.func,
    disableMt5PasswordModal      : PropTypes.func,
    error_message                : PropTypes.string,
    has_mt5_error                : PropTypes.bool,
    is_mt5_password_modal_enabled: PropTypes.bool,
    is_mt5_success_dialog_enabled: PropTypes.bool,
    setMt5Error                  : PropTypes.func,
    setMt5SuccessDialog          : PropTypes.func,
    submitMt5Password            : PropTypes.func,
};

export default connect(({ modules }) => ({
    account_title                : modules.mt5.account_title,
    account_type                 : modules.mt5.account_type,
    closeMt5AndOpenCashier       : modules.mt5.closeMt5AndOpenCashier,
    disableMt5PasswordModal      : modules.mt5.disableMt5PasswordModal,
    error_message                : modules.mt5.error_message,
    has_mt5_error                : modules.mt5.has_mt5_error,
    is_mt5_success_dialog_enabled: modules.mt5.is_mt5_success_dialog_enabled,
    is_mt5_password_modal_enabled: modules.mt5.is_mt5_password_modal_enabled,
    setMt5Error                  : modules.mt5.setError,
    setMt5SuccessDialog          : modules.mt5.setMt5SuccessDialog,
    submitMt5Password            : modules.mt5.submitMt5Password,
}))(MT5PasswordModal);
