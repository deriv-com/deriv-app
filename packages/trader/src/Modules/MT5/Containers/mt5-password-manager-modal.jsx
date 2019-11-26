import {
    Modal,
    Tabs,
    PasswordInput,
    PasswordMeter,
    Button }                  from 'deriv-components';
import {
    Field,
    Form,
    Formik }                  from 'formik';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { urlFor }             from '_common/url';
import UILoader               from 'App/Components/Elements/ui-loader.jsx';
import { localize, Localize } from 'deriv-translations';
import { connect }            from 'Stores/connect';
import MT5Store               from 'Stores/Modules/MT5/mt5-store';
import {
    validLength,
    validPassword }           from 'Utils/Validator/declarative-validation-rules';

class MT5PasswordManagerModal extends React.Component {
    state = {
        // error_message_main: '',
        // error_message_investor: '',
        main: {
            has_error    : false,
            error_message: '',
        },
        investor: {
            has_error    : false,
            error_message: '',
        },
    };

    shouldComponentUpdate(next_props, next_state) {
        if (!next_props.is_visible && this.props.is_visible) {
            this.setState({
                main: {
                    has_error    : false,
                    error_message: '',
                },
                investor: {
                    has_error    : false,
                    error_message: '',
                },
            });
        }

        return this.props !== next_props || this.state !== next_state;
    }

    showError = (section, error_message) => {
        this.setState({
            [section]: {
                has_error: true,
                error_message,
            },
        });
    };

    hideError = (section) => {
        this.setState({
            [section]: {
                has_error    : false,
                error_message: '',
            },
        });
    };

    render() {
        const {
            enableApp,
            disableApp,
            is_visible,
            selected_login,
            selected_account,
            toggleModal,
        } = this.props;

        const validatePassword = (values) => {
            const is_valid = validPassword(values.new_password) &&
                validLength(values.new_password, {
                    min: 8,
                    max: 25,
                });
            const errors = {};

            if (!is_valid) {
                errors.new_password = localize('You need to include uppercase and lowercase letters, and numbers.');
            }

            if (!values.old_password && values.old_password !== undefined) {
                errors.old_password = localize('This field is required');
            }

            return errors;
        };

        const onSubmit = async (values) => {
            const login = selected_login;

            if (!login) {
                return;
            }

            const error = await MT5Store.changePassword({ login, ...values });

            if (error) {
                this.showError(values.password_type, error);
            } else {
                this.hideError(values.password_type);
            }
        };

        const onClickReset = () => { window.open(urlFor('user/metatrader', undefined, undefined, true)); };

        const MainPasswordManager = () => {
            const initial_values = { old_password: '', new_password: '', password_type: 'main' };

            return (
                <Formik
                    initialValues={ initial_values }
                    validate={ validatePassword }
                    onSubmit={ onSubmit }
                >
                    {({ isSubmitting, errors, setFieldTouched, touched }) => (
                        <Form className='mt5-password-manager__main-form' noValidate>
                            { this.state.main.has_error &&
                            <p className='mt5-password-manager--error-message'>
                                { this.state.main.error_message }
                            </p>
                            }
                            <Field name='old_password'>
                                {({ field }) => (
                                    <PasswordInput
                                        { ...field }
                                        label={localize('Current password')}
                                        error={ touched.old_password && errors.old_password }
                                        required
                                    />
                                )}
                            </Field>
                            <Field name='new_password'>
                                {({ field }) => (
                                    <PasswordMeter
                                        input={field.value}
                                        error={touched.new_password && errors.new_password}
                                    >
                                        <PasswordInput
                                            { ...field }
                                            autoComplete='password'
                                            label={localize('New password')}
                                            onChange={(e) => {
                                                setFieldTouched('new_password', true, true);
                                                field.onChange(e);
                                            }}
                                            required
                                        />
                                    </PasswordMeter>
                                )}
                            </Field>
                            <p className='mt5-password-manager--hint'><Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.' /></p>
                            <div className='mt5-password-manager__actions'>
                                <Button
                                    className='mt5-password-manager--button'
                                    is_disabled={ isSubmitting }
                                    is_loading={ isSubmitting }
                                    text={ localize('Change password') }
                                    primary
                                    large
                                />
                                <Button
                                    className='mt5-password-manager--button'
                                    type='button'
                                    onClick={ onClickReset }
                                    text={ localize('Reset main password') }
                                    tertiary
                                    large
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            );
        };

        const InvestorPasswordManager = () => {
            const initial_values = { old_password: '', new_password: '', password_type: 'investor' };

            return (
                <div className='mt5-password-manager__investor-wrapper'>
                    <p className='mt5-password-manager--paragraph'>
                        <Localize i18n_default_text='Use this password to allow another user to access your account to view your trades. This user will not be able to trade or take any other actions.' />
                    </p>
                    { this.state.investor.has_error &&
                    <p className='mt5-password-manager--error-message'>
                        { this.state.investor.error_message }
                    </p>
                    }
                    <Formik
                        initialValues={ initial_values }
                        validate={ validatePassword }
                        onSubmit={ onSubmit }
                    >
                        {({ isSubmitting, errors, setFieldTouched, touched }) => (
                            <Form className='mt5-password-manager__investor-form' noValidate>
                                <Field name='old_password'>
                                    {({ field }) => (
                                        <PasswordInput
                                            { ...field }
                                            label={localize('Current investor password')}
                                            error={ touched.old_password && errors.old_password }
                                            required
                                        />
                                    )}
                                </Field>
                                <Field name='new_password'>
                                    {({ field }) => (
                                        <PasswordMeter
                                            input={field.value}
                                            error={touched.new_password && errors.new_password}
                                        >
                                            <PasswordInput
                                                { ...field }
                                                autoComplete='password'
                                                label={localize('New investor password')}
                                                onChange={(e) => {
                                                    setFieldTouched('new_password', true, true);
                                                    field.onChange(e);
                                                }}
                                                required
                                            />
                                        </PasswordMeter>
                                    )}
                                </Field>
                                <p className='mt5-password-manager--hint'><Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.' /></p>
                                <div className='mt5-password-manager__actions'>
                                    <Button
                                        className='mt5-password-manager--button'
                                        is_disabled={ isSubmitting }
                                        is_loading={ isSubmitting }
                                        text={ localize('Change investor password') }
                                        primary
                                        large
                                    />
                                    <Button
                                        className='mt5-password-manager--button'
                                        type='button'
                                        onClick={ onClickReset }
                                        text={ localize('Create or reset investor password') }
                                        tertiary
                                        large
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            );
        };

        return (
            <React.Suspense fallback={ <UILoader /> }>
                <Modal
                    className='mt5-password-manager__modal'
                    disableApp={ disableApp }
                    enableApp={ enableApp }
                    is_open={ is_visible }
                    title={ localize('Manage your DMT5 {{account_title}} account password', { account_title: selected_account }) }
                    toggleModal={ toggleModal }
                    height='688px'
                    width='904px'
                >
                    <div className='mt5-password-manager'>
                        <Tabs>
                            <div label={ localize('Main password') }>
                                <MainPasswordManager />
                            </div>
                            <div label={ localize('Investor password') }>
                                <InvestorPasswordManager />
                            </div>
                        </Tabs>
                    </div>
                </Modal>
            </React.Suspense>
        );
    }
}

MT5PasswordManagerModal.propTypes = {
    is_visible      : PropTypes.bool,
    selected_account: PropTypes.string,
    selected_login  : PropTypes.string,
    toggleModal     : PropTypes.func,
};

export default connect(({ ui }) => ({
    enableApp : ui.enableApp,
    disableApp: ui.disableApp,
}))(MT5PasswordManagerModal);
