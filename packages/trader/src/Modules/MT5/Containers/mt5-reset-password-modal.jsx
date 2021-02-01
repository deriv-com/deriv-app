import { Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon, PasswordMeter, PasswordInput, FormSubmitButton, Loading, Modal, Text } from '@deriv/components';
import { routes, validLength, validPassword, getErrorMessages } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getMtCompanies } from 'Stores/Modules/MT5/Helpers/mt5-config';
import { WS } from 'Services/ws-methods';

const ResetPasswordIntent = ({ current_list, children, ...props }) => {
    const reset_password_intent = localStorage.getItem('mt5_reset_password_intent');
    const reset_password_type = localStorage.getItem('mt5_reset_password_type') || 'main'; // Default to main
    const has_intent =
        reset_password_intent && /(real|demo)\.(financial_stp|financial|synthetic)/.test(reset_password_intent);

    let group, type, login, title, server;
    if (has_intent && current_list) {
        [server, group, type] = reset_password_intent.split('.');
        login = current_list[`${group}.${type}@${server}`].login;
        title = getMtCompanies()[group][type].title;
    } else if (current_list) {
        [server, group, type] = Object.keys(current_list).pop().split('.');
        login = current_list[`${group}.${type}@${server}`].login;
        title = getMtCompanies()[group][type].title;
    } else {
        // Set a default intent
        login = '';
        title = '';
    }

    return children({
        login,
        title,
        type: reset_password_type,
        ...props,
    });
};

class MT5ResetPasswordModal extends React.Component {
    state = {
        has_error: false,
        error_message: undefined,
        is_finished: false,
        changed_password_type: '',
    };
    renderErrorBox = error => {
        this.setState({
            has_error: true,
            error_message: error.message,
        });
    };
    clearAddressBar = () => {
        localStorage.removeItem('mt5_reset_password_intent');
        localStorage.removeItem('mt5_reset_password_type');
        localStorage.removeItem('mt5_reset_password_code');
        this.props.history.push(`${routes.mt5}`);
    };

    validatePassword = values => {
        const errors = {};

        if (
            !validLength(values.new_password, {
                min: 8,
                max: 25,
            })
        ) {
            errors.new_password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: 25,
            });
        } else if (!validPassword(values.new_password)) {
            errors.new_password = getErrorMessages().password();
        }
        if (values.new_password.toLowerCase() === this.props.email.toLowerCase()) {
            errors.new_password = localize('Your password cannot be the same as your email address.');
        }

        return errors;
    };

    resetPassword = (values, password_type, login, actions) => {
        const { setSubmitting } = actions;
        setSubmitting(true);
        const request = {
            login,
            password_type,
            new_password: values.new_password,
            verification_code: localStorage.getItem('mt5_reset_password_code'),
        };

        WS.mt5PasswordReset(request).then(response => {
            if (response.error && response.error.code === 'InvalidToken') {
                this.renderErrorBox(response.error);
            } else {
                this.setState({
                    is_finished: true,
                    changed_password_type: password_type,
                });
                this.clearAddressBar();
            }
            setSubmitting(false);
        });
    };
    get is_list_fetched() {
        return Object.keys(this.props.current_list).length !== 0;
    }
    render() {
        const { is_mt5_reset_password_modal_enabled, setMt5PasswordResetModal, current_list } = this.props;

        return (
            <Modal
                className='mt5-reset-password-modal'
                is_open={is_mt5_reset_password_modal_enabled}
                toggleModal={() => setMt5PasswordResetModal(false)}
                title={localize('Reset DMT5 password')}
            >
                {!this.is_list_fetched && !this.state.has_error && <Loading is_fullscreen={false} />}
                {this.is_list_fetched && !this.state.has_error && !this.state.is_finished && (
                    <ResetPasswordIntent current_list={current_list}>
                        {({ title, type, login }) => (
                            <Formik
                                initialValues={{ new_password: '' }}
                                validate={this.validatePassword}
                                onSubmit={(values, actions) => this.resetPassword(values, type, login, actions)}
                            >
                                {({
                                    handleSubmit,
                                    errors,
                                    values,
                                    isSubmitting,
                                    handleChange,
                                    handleBlur,
                                    touched,
                                }) => (
                                    <form autoComplete='off' onSubmit={handleSubmit}>
                                        <div className='mt5-reset-password'>
                                            <div className='mt5-reset-password__container'>
                                                <h2 className='mt5-reset-password__heading'>
                                                    <Localize
                                                        i18n_default_text='Reset DMT5 {{title}} password'
                                                        values={{
                                                            title,
                                                        }}
                                                    />
                                                </h2>
                                                <div className='mt5-reset-password__password-area'>
                                                    <PasswordMeter
                                                        input={values.new_password}
                                                        has_error={!!(touched.new_password && errors.new_password)}
                                                        custom_feedback_messages={getErrorMessages().password_warnings}
                                                    >
                                                        {({ has_warning }) => (
                                                            <PasswordInput
                                                                autoComplete='new-password'
                                                                className='mt5-reset-password__password-field'
                                                                name='new_password'
                                                                label={localize('New {{type}} password', { type })}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={touched.new_password && errors.new_password}
                                                                value={values.new_password}
                                                                data-lpignore='true'
                                                                required
                                                                hint={
                                                                    !has_warning &&
                                                                    localize(
                                                                        'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </PasswordMeter>
                                                </div>
                                                {isSubmitting && <Loading is_fullscreen={false} />}
                                                {!isSubmitting && (
                                                    <FormSubmitButton
                                                        is_disabled={
                                                            isSubmitting ||
                                                            !values.new_password ||
                                                            Object.keys(errors).length > 0
                                                        }
                                                        errors={errors}
                                                        is_center={true}
                                                        large
                                                        label={localize('Create {{type}} password', { type })}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        )}
                    </ResetPasswordIntent>
                )}
                {this.state.has_error && (
                    <div className='mt5-reset-password__error'>
                        <Icon icon='IcMt5Expired' size={128} />
                        <Text as='p' size='xs' weight='bold' align='center' className='mt5-reset-password__heading'>
                            {this.state.error_message}
                        </Text>
                        <Text
                            as='p'
                            color='prominent'
                            size='xs'
                            align='center'
                            className='mt5-reset-password__description--is-centered'
                        >
                            <Localize i18n_default_text='Please request a new password and check your email for the new token.' />
                        </Text>
                        <Button
                            primary
                            large
                            onClick={() => {
                                this.clearAddressBar();
                                setMt5PasswordResetModal(false);
                            }}
                        >
                            <Localize i18n_default_text='Ok' />
                        </Button>
                    </div>
                )}
                {this.state.is_finished && (
                    <div className='mt5-reset-password__success'>
                        <Icon icon='IcMt5PasswordUpdated' size={128} />
                        <div className='mt5-reset-password__heading'>
                            <Localize i18n_default_text='Password saved' />
                        </div>
                        <div className='mt5-reset-password__description'>
                            <Localize
                                i18n_default_text='Your {{account_type}} password has been changed.'
                                values={{
                                    account_type:
                                        this.state.changed_password_type === 'main'
                                            ? localize('main')
                                            : localize('investor'),
                                }}
                            />
                        </div>
                        <Button primary large onClick={() => setMt5PasswordResetModal(false)}>
                            <Localize i18n_default_text='Ok' />
                        </Button>
                    </div>
                )}
            </Modal>
        );
    }
}

MT5ResetPasswordModal.propTypes = {
    email: PropTypes.string,
    is_mt5_reset_password_modal_enabled: PropTypes.any,
    setMt5PasswordResetModal: PropTypes.any,
    current_list: PropTypes.any,
};

export default withRouter(
    connect(({ modules: { mt5 }, client }) => ({
        email: client.email,
        is_mt5_reset_password_modal_enabled: mt5.is_mt5_reset_password_modal_enabled,
        setMt5PasswordResetModal: mt5.setMt5PasswordResetModal,
        current_list: mt5.current_list,
    }))(MT5ResetPasswordModal)
);
