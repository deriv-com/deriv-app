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
    Text,
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

const MT5PasswordReset = ({ sendVerifyEmail, account_type, account_group, server, password_type }) => {
    const [is_resend_verification_requested, setResendVerification] = React.useState(false);
    const [is_resend_verification_sent, setResendVerificationSent] = React.useState(false);

    React.useEffect(() => {
        localStorage.setItem('mt5_reset_password_intent', [server, account_group, account_type].join('.'));
        localStorage.setItem('mt5_reset_password_type', password_type);
        sendVerifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickVerification = () => {
        setResendVerification(true);
    };

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
            <Text as='p' size='xs' align='center'>
                <Localize i18n_default_text='Please click on the link in the email to reset your password.' />
            </Text>
            {!is_resend_verification_requested && (
                <Button className='mt5-verification-email-sent__resend-button' primary onClick={onClickVerification}>
                    <Localize i18n_default_text="Didn't receive the email?" />
                </Button>
            )}
            {is_resend_verification_requested && (
                <>
                    <Text
                        as='p'
                        size='xs'
                        align='center'
                        weight='bold'
                        className='mt5-verification-email-sent__title--sub'
                    >
                        <Localize i18n_default_text={"Didn't receive the email?"} />
                    </Text>
                    <Text as='p' size='xs' align='center'>
                        <Localize i18n_default_text="Check your spam or junk folder. If it's not there, try resending the email." />
                    </Text>
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
                </>
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
        <Text as='p' size='xxs' align='center'>
            {is_investor ? (
                <Localize i18n_default_text='Your investor password has been changed.' />
            ) : (
                <Localize i18n_default_text='Your password has been changed.' />
            )}
        </Text>
        <Button onClick={toggleModal} className='mt5-password-manager__success-btn' primary large>
            <p className='dc-btn__text'>{localize('OK')}</p>
        </Button>
    </div>
);

const MT5PasswordManagerTabContentWrapper = ({ multi_step_ref, steps }) => (
    <MultiStep ref={multi_step_ref} steps={steps} className='mt5-password-manager' lbl_previous={localize('Back')} />
);

const MainPasswordManager = ({
    is_submit_success_main,
    toggleModal,
    onSubmit,
    validatePassword,
    error_message_main,
    setPasswordType,
    multi_step_ref,
}) => {
    if (is_submit_success_main) {
        return <MT5PasswordSuccessMessage toggleModal={toggleModal} />;
    }

    const initial_values = { old_password: '', new_password: '', password_type: 'main' };

    return (
        <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
            {({ isSubmitting, errors, setFieldTouched, values, touched }) => (
                <Form className='mt5-password-manager__main-form' noValidate>
                    {error_message_main && <p className='mt5-password-manager--error-message'>{error_message_main}</p>}
                    <Field name='old_password'>
                        {({ field }) => (
                            <PasswordInput
                                {...field}
                                autoComplete='current-password'
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
                                        autoComplete='new-password'
                                        label={localize('New password')}
                                        hint={
                                            !has_warning &&
                                            localize(
                                                'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                            )
                                        }
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
                            onClick={() => {
                                setPasswordType('main');
                                multi_step_ref.current?.goNextStep();
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

const InvestorPasswordManager = ({
    error_message_investor,
    is_submit_success_investor,
    multi_step_ref,
    onSubmit,
    setPasswordType,
    toggleModal,
    validatePassword,
}) => {
    if (is_submit_success_investor) {
        return <MT5PasswordSuccessMessage toggleModal={toggleModal} is_investor />;
    }

    const initial_values = { old_password: '', new_password: '', password_type: 'investor' };

    return (
        <div className='mt5-password-manager__investor-wrapper'>
            <Text as='p' size='xs' className='mt5-password-manager--paragraph'>
                <Localize i18n_default_text='Use this password to grant viewing access to another user. While they may view your trading account, they will not be able to trade or take any other actions.' />
            </Text>
            <Text as='p' size='xs' className='mt5-password-manager--paragraph'>
                <Localize i18n_default_text='If this is the first time you try to create a password, or you have forgotten your password, please reset it.' />
            </Text>
            {error_message_investor && (
                <Text as='p' color='loss-danger' size='xs' className='mt5-password-manager--error-message'>
                    {error_message_investor}
                </Text>
            )}
            <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
                {({ isSubmitting, errors, setFieldTouched, values, touched }) => (
                    <Form className='mt5-password-manager__investor-form' noValidate>
                        <Field name='old_password'>
                            {({ field }) => (
                                <PasswordInput
                                    {...field}
                                    autoComplete='current-password'
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
                                            autoComplete='new-password'
                                            label={localize('New investor password')}
                                            hint={
                                                !has_warning &&
                                                localize(
                                                    'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                                )
                                            }
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
                                onClick={() => {
                                    setPasswordType('investor');
                                    multi_step_ref.current?.goNextStep();
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

const MT5PasswordManagerTabContent = ({ toggleModal, selected_login, email, setPasswordType, multi_step_ref }) => {
    const [active_tab_index, setActiveTabIndex] = React.useState(0);
    const [error_message_main, setErrorMessageMain] = React.useState('');
    const [is_submit_success_main, setSubmitSuccessMain] = React.useState(false);
    const [error_message_investor, setErrorMessageInvestor] = React.useState('');
    const [is_submit_success_investor, setSubmitSuccessInvestor] = React.useState(false);

    // view height - margin top and bottom of modal - modal title - modal content margin top and bottom - table title
    const password_container_height = 'calc(100vh - 84px - 5.6rem - 8.8rem - 4rem)';
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
    const showError = (section, error_message) => {
        if (section === 'main') {
            setErrorMessageMain(error_message);
        } else {
            setErrorMessageInvestor(error_message);
        }
    };

    const hideError = section => {
        if (section === 'main') {
            setErrorMessageMain('');
            setSubmitSuccessMain(true);
        } else {
            setErrorMessageInvestor('');
            setSubmitSuccessInvestor(true);
        }
    };

    const onSubmit = React.useCallback(
        async values => {
            if (!selected_login) {
                return;
            }

            const error = await MT5Store.changePassword({ login: selected_login, ...values });
            if (error) {
                showError(values.password_type, error);
            } else {
                hideError(values.password_type);
            }
        },
        [selected_login]
    );

    const updateAccountTabIndex = index => {
        setActiveTabIndex(index);
        setErrorMessageMain('');
        setSubmitSuccessMain(false);
        setErrorMessageInvestor('');
        setSubmitSuccessInvestor(false);
    };
    return (
        <>
            <Tabs active_index={active_tab_index} onTabItemClick={updateAccountTabIndex} top>
                <div label={localize('Main password')}>
                    <DesktopWrapper>
                        <ThemedScrollbars height={password_container_height} is_bypassed={isMobile()} autohide={false}>
                            <MainPasswordManager
                                is_submit_success_main={is_submit_success_main}
                                toggleModal={toggleModal}
                                onSubmit={onSubmit}
                                validatePassword={validatePassword}
                                error_message_main={error_message_main}
                                setPasswordType={setPasswordType}
                                multi_step_ref={multi_step_ref}
                            />
                        </ThemedScrollbars>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='mt5-password-manager__scroll-wrapper' height_offset='120px'>
                            <MainPasswordManager
                                is_submit_success_main={is_submit_success_main}
                                toggleModal={toggleModal}
                                onSubmit={onSubmit}
                                validatePassword={validatePassword}
                                error_message_main={error_message_main}
                                setPasswordType={setPasswordType}
                                multi_step_ref={multi_step_ref}
                            />
                        </Div100vhContainer>
                    </MobileWrapper>
                </div>
                <div label={localize('Investor password')}>
                    <DesktopWrapper>
                        <ThemedScrollbars height={password_container_height}>
                            <InvestorPasswordManager
                                is_submit_success_investor={is_submit_success_investor}
                                toggleModal={toggleModal}
                                error_message_investor={error_message_investor}
                                validatePassword={validatePassword}
                                onSubmit={onSubmit}
                                setPasswordType={setPasswordType}
                                multi_step_ref={multi_step_ref}
                            />
                        </ThemedScrollbars>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='mt5-password-manager__scroll-wrapper' height_offset='120px'>
                            <InvestorPasswordManager
                                is_submit_success_investor={is_submit_success_investor}
                                toggleModal={toggleModal}
                                error_message_investor={error_message_investor}
                                validatePassword={validatePassword}
                                onSubmit={onSubmit}
                                setPasswordType={setPasswordType}
                                multi_step_ref={multi_step_ref}
                            />
                        </Div100vhContainer>
                    </MobileWrapper>
                </div>
            </Tabs>
        </>
    );
};

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
    selected_server,
    sendVerifyEmail,
}) => {
    const multi_step_ref = React.useRef();

    const [password_type, setPasswordType] = React.useState('main');

    if (!selected_login) return null;

    const steps = [
        {
            component: (
                <MT5PasswordManagerTabContent
                    email={email}
                    selected_login={selected_login}
                    toggleModal={toggleModal}
                    password_type={password_type}
                    setPasswordType={setPasswordType}
                    multi_step_ref={multi_step_ref}
                />
            ),
        },
        {
            component: (
                <MT5PasswordReset
                    server={selected_server}
                    sendVerifyEmail={sendVerifyEmail}
                    account_type={selected_account_type}
                    account_group={selected_account_group}
                    password_type={password_type}
                />
            ),
        },
    ];

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
                    <MT5PasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <PageOverlay
                    is_open={is_visible}
                    portal_id='deriv_app'
                    header={localize('Manage password')}
                    onClickClose={toggleModal}
                >
                    <MT5PasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                </PageOverlay>
            </MobileWrapper>
        </React.Suspense>
    );
};

MT5PasswordManagerModal.propTypes = {
    email: PropTypes.string,
    is_visible: PropTypes.bool,
    selected_account: PropTypes.string,
    selected_server: PropTypes.string,
    selected_login: PropTypes.string,
    toggleModal: PropTypes.func,
};

export default connect(({ modules: { mt5 }, client, ui }) => ({
    email: client.email,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    sendVerifyEmail: mt5.sendVerifyEmail,
}))(MT5PasswordManagerModal);
