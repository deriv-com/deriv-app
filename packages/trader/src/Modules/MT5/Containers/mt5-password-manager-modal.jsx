import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Icon,
    Modal,
    Tabs,
    PasswordInput,
    PasswordMeter,
    Button,
    DesktopWrapper,
    Div100vhContainer,
    MobileWrapper,
    MultiStep,
    PageOverlay,
    ThemedScrollbars,
    UILoader,
    usePreviousState,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile, validLength, validPassword, getErrorMessages } from '@deriv/shared';
import { connect } from 'Stores/connect';
import MT5Store from 'Stores/Modules/MT5/mt5-store';

const CountdownComponent = ({ count_from = 60, onTimeout }) => {
    const [count, setCount] = React.useState(count_from);

    React.useEffect(() => {
        if (count !== 0) {
            const interval = setTimeout(() => {
                setCount(count - 1);
            }, 1000);

            return () => clearTimeout(interval);
        }

        onTimeout();

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);
    return <span className='countdown'>{count}</span>;
};

const MT5PasswordReset = ({ sendVerifyEmail, password_type, account_type, account_group }) => {
    const [is_resend_verification_requested, setResendVerification] = React.useState(false);
    const [is_resend_verification_sent, setResendVerificationSent] = React.useState(false);

    React.useEffect(() => {
        localStorage.setItem('mt5_reset_password_intent', [account_group, account_type].join('.'));
        localStorage.setItem('mt5_reset_password_type', password_type);
        sendVerifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickVerification = () => setResendVerification(true);

    const resendVerification = () => {
        sendVerifyEmail();
        setResendVerificationSent(true);
    };

    return (
        <div className='mt5-verification-email-sent'>
            <Icon icon='IcEmailSent' size={128} />
            <h2 className='mt5-verification-email-sent__title'>
                <Localize i18n_default_text="We've sent you an email" />
            </h2>
            <p className='mt5-verification-email-sent__description'>
                <Localize i18n_default_text='Please click on the link in the email to reset your password.' />
            </p>
            {!is_resend_verification_requested && (
                <Button className='mt5-verification-email-sent__resend-button' primary onClick={onClickVerification}>
                    <Localize i18n_default_text="Didn't receive the email?" />
                </Button>
            )}
            {is_resend_verification_requested && (
                <React.Fragment>
                    <p className='mt5-verification-email-sent__title mt5-verification-email-sent__title--sub'>
                        <Localize i18n_default_text={"Didn't receive the email?"} />
                    </p>
                    <p className='mt5-verification-email-sent__description'>
                        <Localize i18n_default_text="Check your spam or junk folder. If it's not there, try resending the email." />
                    </p>
                    <Button
                        className='mt5-verification-email-sent__resend-button'
                        large
                        primary
                        disabled={is_resend_verification_sent}
                        onClick={resendVerification}
                    >
                        {!is_resend_verification_sent && <Localize i18n_default_text='Resend email' />}
                        {is_resend_verification_sent && (
                            <>
                                <Localize
                                    i18n_default_text='Resend in <0 /> seconds'
                                    components={[
                                        <CountdownComponent
                                            key={0}
                                            onTimeout={() => setResendVerificationSent(false)}
                                            count_from={60}
                                        />,
                                    ]}
                                />
                            </>
                        )}
                    </Button>
                </React.Fragment>
            )}
        </div>
    );
};

const MT5PasswordSuccessMessage = ({ toggleModal, is_investor }) => (
    <div className='mt5-password-manager__success'>
        <Icon icon='IcPasswordUpdated' size={128} />
        <h1 className='mt5-password-manager__success-header'>
            <Localize i18n_default_text='Password changed' />
        </h1>
        <p className='mt5-password-manager__success-paragraph'>
            {is_investor ? (
                <Localize i18n_default_text='Your investor password has been changed.' />
            ) : (
                <Localize i18n_default_text='Your password has been changed.' />
            )}
        </p>
        <Button onClick={toggleModal} className='mt5-password-manager__success-btn' primary large>
            <p className='dc-btn__text'>{localize('OK')}</p>
        </Button>
    </div>
);

const MT5PasswordManagerModal = ({
    enableApp,
    email,
    disableApp,
    is_visible,
    selected_login,
    selected_account,
    toggleModal,
    selected_account_type,
    selected_account_group,
    sendVerifyEmail,
}) => {
    const [active_tab_index, setActiveTabIndex] = React.useState(0);
    const [main_error_message, setMainErrorMessage] = React.useState('');
    const [is_main_submit_success, setMainSubmitSuccess] = React.useState(false);
    const [investor_error_message, setInvestorErrorMessage] = React.useState('');
    const [is_investor_submit_success, setInvestorSubmitSuccess] = React.useState(false);
    const [password_type, setPasswordType] = React.useState('');

    const prev_is_visible = usePreviousState(is_visible);
    const multi_step_ref = React.useRef();

    React.useEffect(() => {
        if (!prev_is_visible && is_visible) {
            reset(0);
        }
    }, [is_visible, prev_is_visible]);

    React.useEffect(() => {
        if (password_type) {
            multi_step_ref.current?.goNextStep();
        }
    }, [password_type]);

    const reset = index => {
        setActiveTabIndex(index);
        setMainErrorMessage('');
        setMainSubmitSuccess(false);
        setInvestorErrorMessage('');
        setInvestorSubmitSuccess(false);
        setPasswordType('');
    };

    const showError = (section, error_message) => {
        if (section === 'main') setMainErrorMessage(error_message);
        else setInvestorErrorMessage(error_message);
    };

    const hideError = section => {
        if (section === 'main') {
            setMainErrorMessage('');
            setMainSubmitSuccess(true);
        } else {
            setInvestorErrorMessage('');
            setInvestorSubmitSuccess(true);
        }
    };

    const updateAccountTabIndex = index => reset(index);

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
            errors.new_password = getErrorMessages().password();
        } else if (values.new_password.toLowerCase() === email.toLowerCase()) {
            errors.new_password = localize('Your password cannot be the same as your email address.');
        }

        if (!values.old_password && values.old_password !== undefined) {
            errors.old_password = localize('This field is required');
        }

        return errors;
    };

    const onSubmit = async values => {
        const login = selected_login;

        if (!login) return;

        const error = await MT5Store.changePassword({ login, ...values });

        if (error) showError(values.password_type, error);
        else hideError(values.password_type);
    };

    const MainPasswordManager = () => {
        if (is_main_submit_success) return <MT5PasswordSuccessMessage toggleModal={toggleModal} />;

        const initial_values = { old_password: '', new_password: '', password_type: 'main' };

        return (
            <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
                {({ isSubmitting, errors, setFieldTouched, values, touched }) => (
                    <Form className='mt5-password-manager__main-form' noValidate>
                        {main_error_message && (
                            <p className='mt5-password-manager--error-message'>{main_error_message}</p>
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
                                    has_error={!!(touched.new_password && errors.new_password)}
                                    custom_feedback_messages={getErrorMessages().password_warnings}
                                >
                                    {({ has_warning }) => (
                                        <PasswordInput
                                            {...field}
                                            autoComplete='password'
                                            label={localize('New password')}
                                            {...(!has_warning
                                                ? {
                                                      hint: localize(
                                                          'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                                      ),
                                                  }
                                                : {})}
                                            error={touched.new_password && errors.new_password}
                                            onChange={e => {
                                                setFieldTouched('new_password', true, true);
                                                field.onChange(e);
                                            }}
                                            className='mt5-password-manager__new-password'
                                            required
                                        />
                                    )}
                                </PasswordMeter>
                            )}
                        </Field>
                        <div className='mt5-password-manager__actions'>
                            <Button
                                className='mt5-password-manager--button'
                                is_disabled={
                                    isSubmitting ||
                                    !values.old_password ||
                                    !values.new_password ||
                                    Object.keys(errors).length > 0
                                }
                                is_loading={isSubmitting}
                                text={localize('Change password')}
                                primary
                                large
                            />
                            <Button
                                className='mt5-password-manager--button'
                                type='button'
                                onClick={() => setPasswordType('main')}
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
        if (is_investor_submit_success) return <MT5PasswordSuccessMessage toggleModal={toggleModal} is_investor />;

        const initial_values = { old_password: '', new_password: '', password_type: 'investor' };

        return (
            <div className='mt5-password-manager__investor-wrapper'>
                <p className='mt5-password-manager--paragraph'>
                    <Localize i18n_default_text='Use this password to grant viewing access to another user. While they may view your trading account, they will not be able to trade or take any other actions.' />
                </p>
                <p className='mt5-password-manager--paragraph'>
                    <Localize i18n_default_text='If this is the first time you try to create a password, or you have forgotten your password, please reset it.' />
                </p>
                {investor_error_message && (
                    <p className='mt5-password-manager--error-message'>{investor_error_message}</p>
                )}
                <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
                    {({ isSubmitting, errors, setFieldTouched, values, touched }) => (
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
                                        has_error={!!(touched.new_password && errors.new_password)}
                                        custom_feedback_messages={getErrorMessages().password_warnings}
                                    >
                                        {({ has_warning }) => (
                                            <PasswordInput
                                                {...field}
                                                autoComplete='password'
                                                label={localize('New investor password')}
                                                {...(!has_warning
                                                    ? {
                                                          hint: localize(
                                                              'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                                          ),
                                                      }
                                                    : {})}
                                                error={touched.new_password && errors.new_password}
                                                onChange={e => {
                                                    setFieldTouched('new_password', true, true);
                                                    field.onChange(e);
                                                }}
                                                className='mt5-password-manager__new-password'
                                                required
                                            />
                                        )}
                                    </PasswordMeter>
                                )}
                            </Field>
                            <div className='mt5-password-manager__actions'>
                                <Button
                                    className='mt5-password-manager--button'
                                    is_disabled={
                                        isSubmitting ||
                                        !values.old_password ||
                                        !values.new_password ||
                                        Object.keys(errors).length > 0
                                    }
                                    is_loading={isSubmitting}
                                    text={localize('Change investor password')}
                                    primary
                                    large
                                />
                                <Button
                                    className='mt5-password-manager--button'
                                    type='button'
                                    onClick={() => setPasswordType('investor')}
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

    // view height - margin top and bottom of modal - modal title - modal content margin top and bottom - table title
    const password_container_height = 'calc(100vh - 84px - 5.6rem - 8.8rem - 4rem)';

    const MT5PasswordManagerTabContent = () => (
        <Tabs active_index={active_tab_index} onTabItemClick={updateAccountTabIndex} top>
            <div label={localize('Main password')}>
                <DesktopWrapper>
                    <ThemedScrollbars height={password_container_height} is_bypassed={isMobile()} autohide={false}>
                        <MainPasswordManager />
                    </ThemedScrollbars>
                </DesktopWrapper>
                <MobileWrapper>
                    <Div100vhContainer className='mt5-password-manager__scroll-wrapper' height_offset='120px'>
                        <MainPasswordManager />
                    </Div100vhContainer>
                </MobileWrapper>
            </div>
            <div label={localize('Investor password')}>
                <DesktopWrapper>
                    <ThemedScrollbars height={password_container_height}>
                        <InvestorPasswordManager />
                    </ThemedScrollbars>
                </DesktopWrapper>
                <MobileWrapper>
                    <Div100vhContainer className='mt5-password-manager__scroll-wrapper' height_offset='120px'>
                        <InvestorPasswordManager />
                    </Div100vhContainer>
                </MobileWrapper>
            </div>
        </Tabs>
    );

    const steps = [
        {
            component: <MT5PasswordManagerTabContent />,
        },
        {
            component: (
                <MT5PasswordReset
                    sendVerifyEmail={sendVerifyEmail}
                    password_type={password_type}
                    account_type={selected_account_type}
                    account_group={selected_account_group}
                />
            ),
        },
    ];

    const MT5PasswordManagerTabContentWrapper = () => (
        <MultiStep
            ref={multi_step_ref}
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
                    title={
                        selected_account_group === 'real'
                            ? localize('Manage DMT5 Real {{account_title}} account password', {
                                  account_title: selected_account,
                              })
                            : localize('Manage DMT5 Demo {{account_title}} account password', {
                                  account_title: selected_account,
                              })
                    }
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
};

MT5PasswordManagerModal.propTypes = {
    email: PropTypes.string,
    is_visible: PropTypes.bool,
    selected_account: PropTypes.string,
    selected_login: PropTypes.string,
    toggleModal: PropTypes.func,
};

export default connect(({ modules: { mt5 }, client, ui }) => ({
    email: client.email,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    sendVerifyEmail: mt5.sendVerifyEmail,
}))(MT5PasswordManagerModal);
