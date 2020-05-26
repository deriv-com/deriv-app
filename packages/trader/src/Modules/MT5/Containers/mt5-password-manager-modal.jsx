import {
    Icon,
    Modal,
    Tabs,
    PasswordInput,
    PasswordMeter,
    Button,
    DesktopWrapper,
    MobileWrapper,
    MultiStep,
    PageOverlay,
    ThemedScrollbars,
    UILoader,
} from '@deriv/components';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { getDerivComLink } from '@deriv/shared/utils/url';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import MT5Store from 'Stores/Modules/MT5/mt5-store';
import { validLength, validPassword } from 'Utils/Validator/declarative-validation-rules';

const MT5PasswordReset = ({ sendVerifyEmail, password_type, account_type, account_group }) => {
    React.useEffect(() => {
        localStorage.setItem('mt5_reset_password_intent', [account_group, account_type].join('.'));
        localStorage.setItem('mt5_reset_password_type', password_type);
        sendVerifyEmail();
    }, []);

    return (
        <div className='mt5-verification-email-sent'>
            <Icon icon='IcEmailSent' size={128} />
            <h2 className='mt5-verification-email-sent__title'>
                <Localize i18n_default_text="We've sent you an email" />
            </h2>
            <p className='mt5-verification-email-sent__description'>
                <Localize i18n_default_text='Please click on the link in the email to reset your password.' />
            </p>
            <a className='mt5-verification-email-sent__help-centre' href={getDerivComLink('help-centre')}>
                <Localize i18n_default_text="Didn't receive the email?" />
            </a>
        </div>
    );
};

class MT5PasswordManagerModal extends React.Component {
    multi_step_ref = React.createRef();
    state = {
        // error_message_main: '',
        // error_message_investor: '',
        main: {
            has_error: false,
            error_message: '',
        },
        investor: {
            has_error: false,
            error_message: '',
        },
    };

    componentDidUpdate(next_props) {
        if (!next_props.is_visible && this.props.is_visible) {
            this.setState({
                main: {
                    has_error: false,
                    error_message: '',
                },
                investor: {
                    has_error: false,
                    error_message: '',
                },
            });
        }
    }

    showError = (section, error_message) => {
        this.setState({
            [section]: {
                has_error: true,
                error_message,
            },
        });
    };

    hideError = section => {
        this.setState({
            [section]: {
                has_error: false,
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
            selected_account_type,
            selected_account_group,
        } = this.props;

        const validatePassword = values => {
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
                errors.new_password = localize('You need to include uppercase and lowercase letters, and numbers.');
            }

            if (!values.old_password && values.old_password !== undefined) {
                errors.old_password = localize('This field is required');
            }

            return errors;
        };

        const onSubmit = async values => {
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

        const MainPasswordManager = () => {
            const initial_values = { old_password: '', new_password: '', password_type: 'main' };

            return (
                <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
                    {({ isSubmitting, errors, setFieldTouched, touched }) => (
                        <Form className='mt5-password-manager__main-form' noValidate>
                            {this.state.main.has_error && (
                                <p className='mt5-password-manager--error-message'>{this.state.main.error_message}</p>
                            )}
                            <Field name='old_password'>
                                {({ field }) => (
                                    <PasswordInput
                                        {...field}
                                        label={localize('Current password')}
                                        error={touched.old_password && errors.old_password}
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
                                            {...field}
                                            autoComplete='password'
                                            label={localize('New password')}
                                            onChange={e => {
                                                setFieldTouched('new_password', true, true);
                                                field.onChange(e);
                                            }}
                                            required
                                        />
                                    </PasswordMeter>
                                )}
                            </Field>
                            <p className='mt5-password-manager--hint'>
                                <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.' />
                            </p>
                            <div className='mt5-password-manager__actions'>
                                <Button
                                    className='mt5-password-manager--button'
                                    is_disabled={isSubmitting}
                                    is_loading={isSubmitting}
                                    text={localize('Change password')}
                                    primary
                                    large
                                />
                                <Button
                                    className='mt5-password-manager--button'
                                    type='button'
                                    onClick={() => {
                                        this.setState(
                                            {
                                                password_type: 'main',
                                            },
                                            () => this.multi_step_ref.current?.nextStep()
                                        );
                                    }}
                                    text={localize('Reset main password')}
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
                    {this.state.investor.has_error && (
                        <p className='mt5-password-manager--error-message'>{this.state.investor.error_message}</p>
                    )}
                    <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
                        {({ isSubmitting, errors, setFieldTouched, touched }) => (
                            <Form className='mt5-password-manager__investor-form' noValidate>
                                <Field name='old_password'>
                                    {({ field }) => (
                                        <PasswordInput
                                            {...field}
                                            label={localize('Current investor password')}
                                            error={touched.old_password && errors.old_password}
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
                                                {...field}
                                                autoComplete='password'
                                                label={localize('New investor password')}
                                                onChange={e => {
                                                    setFieldTouched('new_password', true, true);
                                                    field.onChange(e);
                                                }}
                                                required
                                            />
                                        </PasswordMeter>
                                    )}
                                </Field>
                                <p className='mt5-password-manager--hint'>
                                    <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.' />
                                </p>
                                <div className='mt5-password-manager__actions'>
                                    <Button
                                        className='mt5-password-manager--button'
                                        is_disabled={isSubmitting}
                                        is_loading={isSubmitting}
                                        text={localize('Change investor password')}
                                        primary
                                        large
                                    />
                                    <Button
                                        className='mt5-password-manager--button'
                                        type='button'
                                        onClick={() => {
                                            this.setState(
                                                {
                                                    password_type: 'investor',
                                                },
                                                () => this.multi_step_ref.current?.nextStep()
                                            );
                                        }}
                                        text={localize('Create or reset investor password')}
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

        const MT5PasswordManagerTabContent = () => (
            <>
                <Tabs top>
                    <div label={localize('Main password')}>
                        <DesktopWrapper>
                            <MainPasswordManager />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <ThemedScrollbars autoHide style={{ height: 'calc(100vh - 120px)' }}>
                                <MainPasswordManager />
                            </ThemedScrollbars>
                        </MobileWrapper>
                    </div>
                    <div label={localize('Investor password')}>
                        <DesktopWrapper>
                            <InvestorPasswordManager />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <ThemedScrollbars autoHide style={{ height: 'calc(100vh - 120px)' }}>
                                <InvestorPasswordManager />
                            </ThemedScrollbars>
                        </MobileWrapper>
                    </div>
                </Tabs>
            </>
        );

        const steps = [
            {
                component: <MT5PasswordManagerTabContent />,
            },
            {
                component: (
                    <MT5PasswordReset
                        sendVerifyEmail={this.props.sendVerifyEmail}
                        password_type={this.state.password_type}
                        account_type={selected_account_type}
                        account_group={selected_account_group}
                    />
                ),
            },
        ];

        const MT5PasswordManagerTabContentWrapper = () => (
            <MultiStep
                ref={this.multi_step_ref}
                steps={steps}
                className='mt5-password-manager'
                lbl_previous={localize('Back')}
            />
        );

        return (
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='mt5-password-manager__modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_open={is_visible}
                        title={localize('Manage your DMT5 {{account_title}} account password', {
                            account_title: selected_account,
                        })}
                        toggleModal={toggleModal}
                        height='688px'
                        width='904px'
                    >
                        <MT5PasswordManagerTabContentWrapper />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <PageOverlay
                        is_open={is_visible}
                        portal_id='deriv_app'
                        header={localize('Manage password')}
                        onClickClose={toggleModal}
                    >
                        <MT5PasswordManagerTabContentWrapper />
                    </PageOverlay>
                </MobileWrapper>
            </React.Suspense>
        );
    }
}

MT5PasswordManagerModal.propTypes = {
    is_visible: PropTypes.bool,
    selected_account: PropTypes.string,
    selected_login: PropTypes.string,
    toggleModal: PropTypes.func,
};

export default connect(({ modules: { mt5 }, ui }) => ({
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    sendVerifyEmail: mt5.sendVerifyEmail,
}))(MT5PasswordManagerModal);
