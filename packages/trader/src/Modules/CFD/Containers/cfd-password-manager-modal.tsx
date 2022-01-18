import { Field, Form, Formik, FieldProps } from 'formik';
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
import {
    isMobile,
    validLength,
    validPassword,
    getErrorMessages,
    getCFDPlatformLabel,
    CFD_PLATFORMS,
} from '@deriv/shared';
import { connect } from 'Stores/connect';
import CFDStore from 'Stores/Modules/CFD/cfd-store';
import TradingPasswordManager from './trading-password-manager.jsx';

type TCountdownComponent = {
    count_from: number;
    onTimeout: (value?: boolean) => void;
};

const CountdownComponent = ({ count_from = 60, onTimeout }: TCountdownComponent) => {
    const [count, setCount] = React.useState<number>(count_from);

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

type TCFDPasswordReset = {
    sendVerifyEmail: () => Promise<string>;
    account_type: string;
    account_group: string;
    server: string;
    password_type: string;
};

const CFDPasswordReset = ({
    sendVerifyEmail,
    account_type,
    account_group,
    server,
    password_type,
}: TCFDPasswordReset) => {
    const [is_resend_verification_requested, setResendVerification] = React.useState<boolean>(false);
    const [is_resend_verification_sent, setResendVerificationSent] = React.useState<boolean>(false);

    React.useEffect(() => {
        localStorage.setItem('cfd_reset_password_intent', [server, account_group, account_type].join('.'));
        localStorage.setItem('cfd_reset_password_type', password_type);
        sendVerifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickVerification = (): void => {
        setResendVerification(true);
    };

    const resendVerification = (): void => {
        sendVerifyEmail();
        setResendVerificationSent(true);
    };

    return (
        <div className='cfd-verification-email-sent'>
            <Icon icon='IcEmailSent' size={128} />
            <h2 className='cfd-verification-email-sent__title'>
                <Localize i18n_default_text="We've sent you an email" />
            </h2>
            <Text as='p' size='xs' align='center'>
                <Localize i18n_default_text='Please click on the link in the email to reset your password.' />
            </Text>
            {!is_resend_verification_requested && (
                <Button className='cfd-verification-email-sent__resend-button' primary onClick={onClickVerification}>
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
                        className='cfd-verification-email-sent__title--sub'
                    >
                        <Localize i18n_default_text={"Didn't receive the email?"} />
                    </Text>
                    <Text as='p' size='xs' align='center'>
                        <Localize i18n_default_text="Check your spam or junk folder. If it's not there, try resending the email." />
                    </Text>
                    <Button
                        className='cfd-verification-email-sent__resend-button'
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

type TCFDPasswordSuccessMessage = {
    toggleModal: () => boolean;
    is_investor: boolean;
};

const CFDPasswordSuccessMessage = ({ toggleModal, is_investor }: TCFDPasswordSuccessMessage) => (
    <div className='cfd-password-manager__success'>
        <Icon icon='IcPasswordUpdated' size={128} />
        <Text as='p' size='xxs' align='center'>
            {is_investor ? (
                <Localize i18n_default_text='Your investor password has been changed.' />
            ) : (
                <Localize i18n_default_text='Your password has been changed.' />
            )}
        </Text>
        <Button onClick={toggleModal} className='cfd-password-manager__success-btn' primary large>
            <p className='dc-btn__text'>{localize('OK')}</p>
        </Button>
    </div>
);

type TCFDPasswordManagerTabContentWrapper = {
    multi_step_ref: React.MutableRefObject<any>;
    steps: Array<{ component: JSX.Element }>;
};

const CFDPasswordManagerTabContentWrapper = ({ multi_step_ref, steps }: TCFDPasswordManagerTabContentWrapper) => (
    <MultiStep ref={multi_step_ref} steps={steps} className='cfd-password-manager' lbl_previous={localize('Back')} />
);

type TInvestorPasswordManager = {
    error_message_investor: string;
    is_submit_success_investor: boolean;
    multi_step_ref: React.MutableRefObject<any>;
    onSubmit: (values: any) => Promise<void>;
    setPasswordType: (value: string) => void;
    toggleModal: () => boolean;
    validatePassword: (values: { old_password: string; new_password: string; password_type: string }) => void | object;
};

const InvestorPasswordManager = ({
    error_message_investor,
    is_submit_success_investor,
    multi_step_ref,
    onSubmit,
    setPasswordType,
    toggleModal,
    validatePassword,
}: TInvestorPasswordManager) => {
    if (is_submit_success_investor) {
        return <CFDPasswordSuccessMessage toggleModal={toggleModal} is_investor />;
    }

    const initial_values = { old_password: '', new_password: '', password_type: 'investor' };

    return (
        <div className='cfd-password-manager__investor-wrapper'>
            <Text as='p' size='xs' className='cfd-password-manager--paragraph'>
                <Localize i18n_default_text='Use this password to grant viewing access to another user. While they may view your trading account, they will not be able to trade or take any other actions.' />
            </Text>
            <Text as='p' size='xs' className='cfd-password-manager--paragraph'>
                <Localize i18n_default_text='If this is the first time you try to create a password, or you have forgotten your password, please reset it.' />
            </Text>
            {error_message_investor && (
                <Text as='p' color='loss-danger' size='xs' className='cfd-password-manager--error-message'>
                    {error_message_investor}
                </Text>
            )}
            <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
                {({ isSubmitting, errors, setFieldTouched, values, touched }) => (
                    <Form className='cfd-password-manager__investor-form' noValidate>
                        <Field name='old_password'>
                            {({ field }: FieldProps) => (
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
                            {({ field }: FieldProps) => (
                                <PasswordMeter
                                    input={field.value}
                                    has_error={!!(touched.new_password && errors.new_password)}
                                    custom_feedback_messages={getErrorMessages().password_warnings}
                                >
                                    {({ has_warning }: any) => (
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
                                            onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                                setFieldTouched('new_password', true, true);
                                                field.onChange(e);
                                            }}
                                            className='cfd-password-manager__new-password'
                                            required
                                        />
                                    )}
                                </PasswordMeter>
                            )}
                        </Field>
                        <div className='cfd-password-manager__actions'>
                            <Button
                                className='cfd-password-manager--button'
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
                                className='cfd-password-manager--button'
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

type TCFDPasswordManagerTabContent = {
    toggleModal: () => boolean;
    selected_login: string;
    email: string;
    setPasswordType: (value: string) => void;
    multi_step_ref: React.MutableRefObject<any>;
    platform: 'dxtrade' | 'mt5';
    onChangeActiveTabIndex: (value: number) => void;
    account_group: string;
    password_type?: string;
};

const CFDPasswordManagerTabContent = ({
    toggleModal,
    selected_login,
    email,
    setPasswordType,
    multi_step_ref,
    platform,
    onChangeActiveTabIndex,
    account_group,
}: TCFDPasswordManagerTabContent) => {
    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [error_message_investor, setErrorMessageInvestor] = React.useState<string>('');
    const [is_submit_success_investor, setSubmitSuccessInvestor] = React.useState<boolean>(false);

    // view height - margin top and bottom of modal - modal title - modal content margin top and bottom - table title
    const password_container_height = 'calc(100vh - 84px - 5.6rem - 8.8rem - 4rem)';
    const validatePassword = (values: { old_password: string; new_password: string; password_type: string }) => {
        const errors: { new_password?: string; old_password?: string } = {};

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
    const showError = (error_message: string) => {
        setErrorMessageInvestor(error_message);
    };

    const hideError = () => {
        setErrorMessageInvestor('');
        setSubmitSuccessInvestor(true);
    };

    const onSubmit = React.useCallback(
        async values => {
            if (!selected_login) {
                return;
            }

            const error = await CFDStore.changePassword({ login: selected_login, ...values });
            if (error) {
                showError(error);
            } else {
                hideError();
            }
        },
        [selected_login]
    );

    const updateAccountTabIndex = (index: number) => {
        setActiveTabIndex(index);
        onChangeActiveTabIndex(index);
        setErrorMessageInvestor('');
        setSubmitSuccessInvestor(false);
    };

    const trading_password_manager = (
        <React.Fragment>
            <DesktopWrapper>
                <ThemedScrollbars height={password_container_height} is_bypassed={isMobile()} autohide={false}>
                    <TradingPasswordManager
                        // @ts-ignore
                        toggleModal={toggleModal}
                        platform={platform}
                        email={email}
                        account_group={account_group}
                    />
                </ThemedScrollbars>
            </DesktopWrapper>
            <MobileWrapper>
                <Div100vhContainer className='cfd-password-manager__scroll-wrapper' height_offset='120px'>
                    <TradingPasswordManager
                        // @ts-ignore
                        toggleModal={toggleModal}
                        platform={platform}
                        email={email}
                        account_group={account_group}
                    />
                </Div100vhContainer>
            </MobileWrapper>
        </React.Fragment>
    );

    if (platform === CFD_PLATFORMS.DXTRADE) return trading_password_manager;

    return (
        <Tabs active_index={active_tab_index} onTabItemClick={updateAccountTabIndex} top>
            <div
                data-label={localize('{{platform}} password', {
                    platform: getCFDPlatformLabel(platform),
                })}
            >
                {trading_password_manager}
            </div>
            <div data-label={localize('Investor password')}>
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
                    <Div100vhContainer className='cfd-password-manager__scroll-wrapper' height_offset='120px'>
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
    );
};

type TCFDPasswordManagerModal = {
    enableApp: () => void;
    email: string;
    disableApp: () => void;
    is_visible: boolean;
    platform: 'dxtrade' | 'mt5';
    selected_login: string;
    selected_account: string;
    toggleModal: () => boolean;
    selected_account_type: string;
    selected_account_group: string;
    selected_server: string;
    sendVerifyEmail: () => Promise<string>;
};

const CFDPasswordManagerModal = ({
    enableApp,
    email,
    disableApp,
    is_visible,
    platform,
    selected_login,
    selected_account,
    toggleModal,
    selected_account_type,
    selected_account_group,
    selected_server,
    sendVerifyEmail,
}: TCFDPasswordManagerModal) => {
    const multi_step_ref = React.useRef();
    const [index, setIndex] = React.useState(0);

    const [password_type, setPasswordType] = React.useState<string>('main');

    if (!selected_login) return null;

    const getTitle = (i: number) => {
        if (i === 0) {
            return localize('Manage {{platform}} password', {
                platform: getCFDPlatformLabel(platform),
            });
        }
        return selected_account_group === 'real'
            ? localize('Manage {{platform}} Real {{account_title}} account password', {
                  platform: getCFDPlatformLabel(platform),
                  account_title: selected_account,
              })
            : localize('Manage {{platform}} Demo {{account_title}} account password', {
                  platform: getCFDPlatformLabel(platform),
                  account_title: selected_account,
              });
    };

    const getHeader = (i: number) => {
        if (i === 0) {
            return localize('Manage {{platform}} password', {
                platform: getCFDPlatformLabel(platform),
            });
        }
        return localize('Manage password');
    };

    const onChangeActiveTabIndex = (i: number) => {
        setIndex(i);
    };

    const steps = [
        {
            component: (
                <CFDPasswordManagerTabContent
                    email={email}
                    selected_login={selected_login}
                    toggleModal={toggleModal}
                    password_type={password_type}
                    setPasswordType={setPasswordType}
                    multi_step_ref={multi_step_ref}
                    platform={platform}
                    onChangeActiveTabIndex={onChangeActiveTabIndex}
                    account_group={selected_account_group}
                />
            ),
        },
        {
            component: (
                <CFDPasswordReset
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
                    className='cfd-password-manager__modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={is_visible}
                    title={getTitle(index)}
                    toggleModal={toggleModal}
                    height='688px'
                    width='904px'
                    should_header_stick_body={false}
                >
                    <CFDPasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <PageOverlay
                    is_open={is_visible}
                    portal_id='deriv_app'
                    header={getHeader(index)}
                    onClickClose={toggleModal}
                >
                    <CFDPasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                </PageOverlay>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default connect(({ modules: { cfd }, client, ui }: any) => ({
    email: client.email,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    sendVerifyEmail: cfd.sendVerifyEmail,
}))(CFDPasswordManagerModal);
