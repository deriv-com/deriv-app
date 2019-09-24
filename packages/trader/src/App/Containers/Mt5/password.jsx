import {
    Input,
    Modal,
    PasswordMeter,
}                           from 'deriv-components';
import { Formik }           from 'formik';
import PropTypes            from 'prop-types';
import React, { Component } from 'react';
import SuccessDialog        from 'App/Containers/Modals/success-dialog.jsx';
import { connect }          from 'Stores/connect';
import Localize             from 'App/Components/Elements/localize.jsx';
import FormSubmitButton     from 'App/Containers/RealAccountSignup/form-submit-button.jsx';
import { localize }         from 'App/i18n';
import IconMT5Synthetic     from 'Assets/Mt5/icon-mt5-synthetic.jsx';
import IconMT5Advanced      from 'Assets/Mt5/icon-mt5-advanced.jsx';
import IconMT5Standard      from 'Assets/Mt5/icon-mt5-standard.jsx';
import {
    validPassword,
    validLength,
}                           from 'Utils/Validator/declarative-validation-rules';
import 'Sass/mt5.scss';

const getSubmitText = (account_title) => localize(`You have created a ${account_title}. To start trading, transfer funds from your Deriv account into this account.`);

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

class Password extends Component {
    validatePassword = (values) => {
        const is_valid = validPassword(values.password) &&
            validLength(values.password, {
                min: 8,
                max: 30,
            });
        const errors   = {};

        if (!is_valid) {
            errors.password = localize(
                'The password must contain at least two of three types of characters (lower case, upper case and digits).');
        }

        return errors;
    };

    closeModal = () => {
        setTimeout(() => this.props.setMt5Error(false), 400);
        this.props.disableMt5PasswordModal();
    };

    closeOpenSuccess = () => {
        setTimeout(() => this.props.setMt5Error(false), 400);
        this.props.closeMt5AndOpenCashier('account_transfer');
    };

    render() {
        const IconType = getIconFromType(this.props.account_type.type);
        return (
            <Modal
                className='mt5-password-modal'
                is_open={this.props.is_mt5_password_modal_enabled}
                toggleModal={this.closeModal}
                has_close_icon={false}
            >
                {this.props.has_mt5_error &&
                <div className='error'>
                    <SuccessDialog
                        onCancel={this.closeModal}
                        onSubmit={this.closeOpenSuccess}
                        // message={getSubmitText(this.props.account_title)}
                        message={this.props.error_message}
                        icon={<IconType />}
                        icon_size='xlarge'
                        text_submit={localize('Transfer now')}
                    />
                </div>
                }
                {!this.props.has_mt5_error && !this.props.is_mt5_success_dialog_enabled &&
                <Formik
                    initialValues={{
                        password: '',
                    }}
                    validate={this.validatePassword}
                    onSubmit={(values, actions) => {
                        this.props.submitMt5Password(
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
                                        account_type: this.props.account_title,
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
                                        <Input
                                            autoComplete='password'
                                            label={localize('MT5 Password')}
                                            type='password'
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
                                label='Add account' // Localization will be handled by component
                                form_error={this.props.form_error}
                            />
                        </form>
                    )}
                />
                }
                {!this.props.has_mt5_error && this.props.is_mt5_success_dialog_enabled &&
                <SuccessDialog
                    onCancel={this.closeModal}
                    onSubmit={this.closeOpenSuccess}
                    message={getSubmitText(this.props.account_title)}
                    // message={this.props.error_message}
                    icon={<IconType />}
                    icon_size='xlarge'
                    text_submit={localize('Transfer now')}
                />
                }
            </Modal>
        );
    }
}

Password.propTypes = {
    account_title                : PropTypes.string,
    account_type                 : PropTypes.object,
    closeMt5AndOpenCashier       : PropTypes.func,
    disableMt5PasswordModal      : PropTypes.func,
    error_message                : PropTypes.string,
    has_mt5_error                : PropTypes.bool,
    is_mt5_password_modal_enabled: PropTypes.bool,
    is_mt5_success_dialog_enabled: PropTypes.bool,
    setMt5Error                  : PropTypes.func,
    submitMt5Password            : PropTypes.func,
};
export default connect(({ ui, modules }) => ({
    account_title                : modules.mt5.account_title,
    account_type                 : modules.mt5.account_type,
    closeMt5AndOpenCashier       : ui.closeMt5AndOpenCashier,
    disableMt5PasswordModal      : ui.disableMt5PasswordModal,
    error_message                : modules.mt5.error_message,
    has_mt5_error                : modules.mt5.has_mt5_error,
    is_mt5_success_dialog_enabled: modules.mt5.is_mt5_success_dialog_enabled,
    is_mt5_password_modal_enabled: ui.is_mt5_password_modal_enabled,
    setMt5Error                  : modules.mt5.setError,
    submitMt5Password            : modules.mt5.submitMt5Password,
}))(Password);
