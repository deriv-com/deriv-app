import { Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon, PasswordMeter, PasswordInput, FormSubmitButton, Loading, Modal, Text } from '@deriv/components';
import { routes, validLength, validPassword, getErrorMessages, CFD_PLATFORMS, WS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getMtCompanies } from 'Stores/Modules/CFD/Helpers/cfd-config';

const ResetPasswordIntent = ({ current_list, children, is_eu, ...props }) => {
    const reset_password_intent = localStorage.getItem('cfd_reset_password_intent');
    const reset_password_type = localStorage.getItem('cfd_reset_password_type') || 'main'; // Default to main
    const has_intent =
        reset_password_intent && /(real|demo)\.(financial_stp|financial|synthetic)/.test(reset_password_intent);

    let group, type, login, title, server;
    if (has_intent && current_list) {
        [server, group, type] = reset_password_intent.split('.');
        login = current_list[`mt5.${group}.${type}@${server}`].login;
        title = getMtCompanies(is_eu)[group][type].title;
    } else if (current_list) {
        [server, group, type] = Object.keys(current_list).pop().split('.');
        login = current_list[`mt5.${group}.${type}@${server}`]?.login ?? '';
        title = getMtCompanies(is_eu)?.[group]?.[type]?.title ?? '';
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

class CFDResetPasswordModal extends React.Component {
    state = {
        error_code: undefined,
        has_error: false,
        error_message: undefined,
        is_finished: false,
        changed_password_type: '',
    };
    renderErrorBox = error => {
        this.setState({
            error_code: error.code,
            has_error: true,
            error_message: error.message,
        });
    };
    clearAddressBar = () => {
        localStorage.removeItem('cfd_reset_password_intent');
        localStorage.removeItem('cfd_reset_password_type');
        localStorage.removeItem('cfd_reset_password_code');
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
            account_id: login,
            platform: CFD_PLATFORMS.MT5,
            new_password: values.new_password,
            verification_code: localStorage.getItem('cfd_reset_password_code'),
        };

        WS.tradingPlatformInvestorPasswordReset(request).then(response => {
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
        const {
            is_cfd_reset_password_modal_enabled,
            is_eu,
            setCFDPasswordResetModal,
            current_list,
            platform,
        } = this.props;
        return (
            <Modal
                className='cfd-reset-password-modal'
                is_open={is_cfd_reset_password_modal_enabled}
                toggleModal={() => setCFDPasswordResetModal(false)}
                title={
                    platform === CFD_PLATFORMS.DXTRADE
                        ? localize('Reset Deriv X investor password')
                        : localize('Reset DMT5 investor password')
                }
            >
                {!this.is_list_fetched && !this.state.has_error && <Loading is_fullscreen={false} />}
                {this.is_list_fetched && !this.state.has_error && !this.state.is_finished && (
                    <ResetPasswordIntent current_list={current_list} is_eu={is_eu}>
                        {({ type, login }) => (
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
                                        <div className='cfd-reset-password'>
                                            <div className='cfd-reset-password__container'>
                                                <div className='cfd-reset-password__password-area'>
                                                    <PasswordMeter
                                                        input={values.new_password}
                                                        has_error={!!(touched.new_password && errors.new_password)}
                                                        custom_feedback_messages={getErrorMessages().password_warnings}
                                                    >
                                                        {({ has_warning }) => (
                                                            <PasswordInput
                                                                autoComplete='new-password'
                                                                className='cfd-reset-password__password-field'
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
                                                                        'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.'
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
                    <div className='cfd-reset-password__error'>
                        <Icon icon='IcMt5Expired' size={128} />
                        <Text as='p' size='xs' weight='bold' align='center' className='cfd-reset-password__heading'>
                            {this.state.error_message}
                        </Text>
                        {this.state.error_code === 'InvalidToken' && (
                            <Text
                                as='p'
                                color='prominent'
                                size='xs'
                                align='center'
                                className='cfd-reset-password__description--is-centered'
                            >
                                <Localize i18n_default_text='Please request a new password and check your email for the new token.' />
                            </Text>
                        )}
                        <Button
                            primary
                            large
                            className='cfd-reset-password__confirm-button'
                            onClick={() => {
                                this.clearAddressBar();
                                setCFDPasswordResetModal(false);
                            }}
                        >
                            <Localize i18n_default_text='Ok' />
                        </Button>
                    </div>
                )}
                {this.state.is_finished && (
                    <div className='cfd-reset-password__success'>
                        <Icon icon='IcMt5PasswordUpdated' size={128} />
                        <div className='cfd-reset-password__description'>
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
                        <Button primary large onClick={() => setCFDPasswordResetModal(false)}>
                            <Localize i18n_default_text='Ok' />
                        </Button>
                    </div>
                )}
            </Modal>
        );
    }
}

CFDResetPasswordModal.propTypes = {
    email: PropTypes.string,
    is_eu: PropTypes.bool,
    is_cfd_reset_password_modal_enabled: PropTypes.any,
    setCFDPasswordResetModal: PropTypes.any,
    current_list: PropTypes.any,
};

export default withRouter(
    connect(({ modules: { cfd }, client }) => ({
        email: client.email,
        is_eu: client.is_eu,
        is_cfd_reset_password_modal_enabled: cfd.is_cfd_reset_password_modal_enabled,
        setCFDPasswordResetModal: cfd.setCFDPasswordResetModal,
        current_list: cfd.current_list,
    }))(CFDResetPasswordModal)
);
