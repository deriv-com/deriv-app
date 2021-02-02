import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import {
    DesktopWrapper,
    FormSubmitButton,
    Icon,
    MobileWrapper,
    MobileDialog,
    Modal,
    PasswordInput,
    Text,
    Button,
    RadioGroup,
} from '@deriv/components';
import { isMobile, routes, validLength, validPassword, getErrorMessages, getStaticUrl } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import SuccessDialog from 'App/Containers/Modals/success-dialog.jsx';
import 'Sass/app/modules/mt5/mt5.scss';
import { connect } from 'Stores/connect';

const PasswordResetBody = ({ closeModal }) => (
    <div className='dc-modal__container_mt5-reset-password-modal__body'>
        <Icon icon='IcMt5OnePassword' size='128' />
        <Text
            as='p'
            align='center'
            weight='bold'
            size='s'
            className='dc-modal__container_mt5-reset-password-modal__header'
        >
            <Localize i18n_default_text='All you’ll need from now is one password' />
        </Text>
        <Text as='p' align='center' size='xxs'>
            <Localize i18n_default_text='We’ve upgraded our system to support a single, more secure password across Deriv. Once you’ve set a new password, you can use it to log into all your Deriv and DMT5 accounts.' />
        </Text>
        <a
            onClick={closeModal}
            href={getStaticUrl('reset-password')}
            target='_blank'
            rel='noreferrer'
            className='dc-btn dc-btn--primary dc-btn__large dc-modal__container_mt5-reset-password-modal__button'
        >
            <Localize i18n_default_text='Reset password' />
        </a>
    </div>
);

const MT5PasswordResetHint = ({ closeModal }) => {
    const onResetPasswordClick = () => {
        window.open(getStaticUrl('/reset-password'));
    };

    return (
        <div className='mt5-password-hint'>
            <Text as='p' size='xs' align='left' className='mt5-password-hint__description'>
                <Localize i18n_default_text='Unavailable because of too many failed attempts. Please try again in a minute or reset your account password to continue.' />
            </Text>
            <div className='mt5-password-hint__buttons'>
                <Button large onClick={closeModal} secondary>
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button large onClick={onResetPasswordClick} primary>
                    <Localize i18n_default_text='Reset password' />
                </Button>
            </div>
        </div>
    );
};

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

const MT5PasswordForm = props => {
    return (
        <Formik
            initialValues={props.values}
            enableReinitialize
            validate={props.validatePassword}
            onSubmit={(values, actions) => props.submitMt5Password(values, actions.setSubmitting)}
        >
            {({
                handleSubmit,
                // setFieldValue,
                setFieldTouched,
                handleChange,
                handleBlur,
                errors,
                values,
                touched,
                isSubmitting,
            }) => (
                <form onSubmit={handleSubmit}>
                    {isMobile() && (
                        <h2>
                            <Localize i18n_default_text='Confirm your password' />
                        </h2>
                    )}
                    <div className='mt5-password-modal__content'>
                        <div className='dc-modal__container_mt5-password-modal__body'>
                            <div className='input-element'>
                                <PasswordInput
                                    autoComplete='new-password'
                                    label={localize('Password')}
                                    error={
                                        (touched.password || props.error_message) &&
                                        (errors.password || props.error_message)
                                    }
                                    name='password'
                                    value={values.password}
                                    onBlur={handleBlur}
                                    onChange={e => {
                                        setFieldTouched('password', true);
                                        props.resetFormErrors();
                                        handleChange(e);
                                    }}
                                />
                            </div>
                            <Text
                                as='p'
                                align='left'
                                size='xs'
                                className='dc-modal__container_mt5-password-modal__hint'
                            >
                                <Localize
                                    i18n_default_text='Please confirm your Deriv password to create a DMT5 account. If you’ve forgotten your password, click <0>Reset password</0>.'
                                    components={[
                                        <a
                                            key={0}
                                            href={getStaticUrl('/reset-password')}
                                            className='dc-modal__container_mt5-password-modal__password-hint'
                                            rel='noreferrer'
                                        />,
                                    ]}
                                />
                            </Text>
                            {props.is_real_financial_stp && (
                                <div className='dc-modal__container_mt5-password-modal__description'>
                                    <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Deriv (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA). All other accounts, including your Deriv account, are not subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA).' />
                                </div>
                            )}
                        </div>
                    </div>
                    <FormSubmitButton
                        is_disabled={!values.password || Object.keys(errors).length > 0}
                        has_cancel
                        cancel_label={localize('Reset password')}
                        onCancel={props.handleCancel}
                        is_absolute={isMobile()}
                        is_loading={props.is_submitting || isSubmitting}
                        label={props.should_show_server_form ? localize('Next') : localize('Add account')}
                    />
                </form>
            )}
        </Formik>
    );
};

const MT5ServerForm = ({ ...props }) => {
    const available_servers = React.useMemo(() => {
        return props.trading_servers
            .filter(server => !server.disabled)
            .map(server => {
                // Transform properties to support radiogroup
                const is_disabled = props.mt5_login_list.some(login_item => login_item.server === server.id);
                return {
                    ...server,
                    ...{
                        label: `${server.geolocation.region} ${
                            server.geolocation.sequence === 1 ? '' : server.geolocation.sequence
                        } ${is_disabled ? '(Account created)' : ''}`,
                        value: server.id,
                        disabled: is_disabled,
                    },
                };
            })
            .sort((a, b) => (a.recommended ? a : b));
    }, [props.mt5_login_list, props.trading_servers]);

    return (
        <Formik
            initialValues={{
                server:
                    props.trading_servers.find(
                        server =>
                            !server.disabled &&
                            !props.mt5_login_list.some(login_item => login_item.server === server.id)
                    )?.id ?? '',
            }}
            validate={props.validateServer}
            onSubmit={(values, actions) => {
                props.submitMt5Form(
                    {
                        server: values.server,
                    },
                    actions.setSubmitting
                );
            }}
        >
            {({ handleSubmit, setFieldValue, errors, values, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <div className='mt5-password-modal__content'>
                        <h2>
                            <Localize
                                i18n_default_text='Choose a server for your DMT5 {{ account_type }} account'
                                values={{
                                    account_type: props.account_title,
                                }}
                            />
                        </h2>
                        <div className='dc-modal__container_mt5-password-modal__body'>
                            <div className='input-element'>
                                <RadioGroup
                                    className='mt5-password-modal__radio'
                                    name='server'
                                    required
                                    selected={
                                        props.trading_servers.find(
                                            server =>
                                                !server.disabled &&
                                                !props.mt5_login_list.some(
                                                    login_item => login_item.server === server.id
                                                )
                                        )?.id
                                    }
                                    onToggle={e => {
                                        e.persist();
                                        setFieldValue('server', e.target.value);
                                    }}
                                    items={available_servers}
                                />
                            </div>
                        </div>
                    </div>
                    <FormSubmitButton
                        is_disabled={isSubmitting || !values.server || Object.keys(errors).length > 0}
                        has_cancel
                        cancel_label={localize('Back')}
                        onCancel={props.onBack}
                        is_absolute={isMobile()}
                        is_loading={isSubmitting}
                        label={localize('Next')}
                    />
                </form>
            )}
        </Formik>
    );
};

const MT5PasswordModal = ({
    account_status,
    account_title,
    account_type,
    resetFormErrors,
    disableMt5PasswordModal,
    email,
    error_message,
    error_type,
    history,
    has_mt5_error,
    is_eu,
    is_eu_country,
    is_logged_in,
    is_mt5_password_modal_enabled,
    is_mt5_success_dialog_enabled,
    setMt5SuccessDialog,
    setMt5Error,
    submitMt5Password,
    trading_servers,
    mt5_login_list,
}) => {
    const handleCancel = () => {
        window.open(getStaticUrl('/reset-password'));
        closeModal();
    };

    const [password, setPassword] = React.useState('');
    const [server, setServer] = React.useState('');
    const [is_submitting, setIsSubmitting] = React.useState(false); // TODO handle this better
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
            errors.password = getErrorMessages().password();
        }
        if (values.password.toLowerCase() === email.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }

        return errors;
    };

    const closeDialogs = () => {
        setMt5SuccessDialog(false);
        setMt5Error(false);
        setPassword('');
    };

    const closeModal = () => {
        setPassword('');
        setServer('');
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
    const is_password_error = error_type === 'PasswordError';
    const is_password_reset = error_type === 'PasswordReset';
    const should_show_password =
        is_mt5_password_modal_enabled &&
        !is_mt5_success_dialog_enabled &&
        (!has_mt5_error || is_password_reset || is_password_error);
    const should_show_success = !has_mt5_error && is_mt5_success_dialog_enabled;
    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';
    const is_real_synthetic = [account_type.category, account_type.type].join('_') === 'real_synthetic';
    const should_show_server_form = (is_logged_in ? !is_eu : !is_eu_country) && is_real_synthetic && !server;
    const is_password_reset_modal_on = !should_show_server_form && is_password_reset;
    const should_show_password_form = !should_show_server_form && !is_password_reset;

    // TODO handle submitting password without server in a better way
    React.useEffect(() => {
        if (!should_show_server_form && password && !is_submitting) {
            setIsSubmitting(true);
        } else if (is_submitting && password && is_logged_in) {
            submitMt5Password(
                {
                    password,
                    ...({ server } || {}),
                },
                state => {
                    setPassword('');
                    setIsSubmitting(state);
                }
            );
        }
    }, [password, should_show_server_form, is_submitting, server]);

    React.useEffect(() => {
        if (has_mt5_error || is_mt5_success_dialog_enabled) {
            setPassword('');
        }
    }, [has_mt5_error, is_mt5_success_dialog_enabled, error_message]);

    React.useEffect(() => {
        if (error_type === 'PasswordError') {
            setPassword('');
        }
    }, [error_type]);

    if (account_status?.status?.includes?.('password_reset_required')) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal
                        width='38rem'
                        className='mt5-reset-password-modal'
                        is_open={should_show_password}
                        toggleModal={closeModal}
                        has_close_icon
                        is_title_blank
                    >
                        <PasswordResetBody closeModal={closeModal} />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        has_full_height
                        portal_element_id='modal_root'
                        visible={should_show_password}
                        onClose={closeModal}
                        wrapper_classname='mt5-password-modal'
                    >
                        <PasswordResetBody onBack={closeModal} closeModal={closeModal} />
                    </MobileDialog>
                </MobileWrapper>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className={is_password_reset ? 'mt5-password-reset-modal' : 'mt5-password-modal'}
                    is_open={should_show_password}
                    toggleModal={closeModal}
                    renderTitle={() => {
                        if (is_password_reset_modal_on) {
                            return localize('Too many failed attempt');
                        } else if (should_show_password_form) {
                            return localize('Confirm your password');
                        }

                        return null;
                    }}
                >
                    {should_show_server_form && (
                        <MT5ServerForm
                            trading_servers={trading_servers}
                            mt5_login_list={mt5_login_list}
                            account_title={account_title}
                            submitMt5Form={v => setServer(v.server)}
                            onBack={closeModal}
                        />
                    )}
                    {should_show_password_form && (
                        <MT5PasswordForm
                            resetFormErrors={resetFormErrors}
                            is_submitting={is_submitting}
                            account_title={account_title}
                            closeModal={closeModal}
                            handleCancel={handleCancel}
                            error_type={error_type}
                            values={{
                                password,
                                server,
                            }}
                            error_message={error_message}
                            submitMt5Password={v => {
                                setPassword(v.password);
                            }}
                            is_real_financial_stp={is_real_financial_stp}
                            should_show_server_form={should_show_server_form}
                            validatePassword={validatePassword}
                        />
                    )}
                    {is_password_reset_modal_on && <MT5PasswordResetHint closeModal={closeModal} />}
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    has_full_height
                    portal_element_id='modal_root'
                    visible={should_show_password}
                    onClose={closeModal}
                    wrapper_classname='mt5-password-modal'
                >
                    {should_show_server_form && (
                        <MT5ServerForm
                            trading_servers={trading_servers}
                            mt5_login_list={mt5_login_list}
                            account_title={account_title}
                            password={password}
                            submitMt5Form={v => setServer(v.server)}
                            onBack={closeModal}
                        />
                    )}
                    {!should_show_server_form && !is_password_reset && (
                        <MT5PasswordForm
                            resetFormErrors={resetFormErrors}
                            is_submitting={is_submitting}
                            account_title={account_title}
                            closeModal={closeModal}
                            handleCancel={handleCancel}
                            error_type={error_type}
                            values={{
                                password,
                                server,
                            }}
                            error_message={error_message}
                            submitMt5Password={v => {
                                setPassword(v.password);
                            }}
                            is_real_financial_stp={is_real_financial_stp}
                            should_show_server_form={should_show_server_form}
                            validatePassword={validatePassword}
                        />
                    )}
                    {is_password_reset_modal_on && (
                        <React.Fragment>
                            <h2 className='mt5-password-modal__title'>
                                <Localize i18n_default_text='Too many failed attempt' />
                            </h2>
                            <MT5PasswordResetHint closeModal={closeModal} />
                        </React.Fragment>
                    )}
                </MobileDialog>
            </MobileWrapper>
            <SuccessDialog
                is_open={should_show_success}
                toggleModal={closeModal}
                onCancel={closeModal}
                onSubmit={closeOpenSuccess}
                classNameMessage='mt5-password-modal__message'
                message={getSubmitText(account_title, account_type.category)}
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
    is_eu: PropTypes.bool,
    is_eu_country: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_password_modal_enabled: PropTypes.bool,
    is_mt5_success_dialog_enabled: PropTypes.bool,
    setMt5Error: PropTypes.func,
    setMt5SuccessDialog: PropTypes.func,
    submitMt5Password: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    email: client.email,
    account_status: client.account_status,
    account_title: modules.mt5.account_title,
    account_type: modules.mt5.account_type,
    resetFormErrors: modules.mt5.resetFormErrors,
    disableMt5PasswordModal: modules.mt5.disableMt5PasswordModal,
    error_message: modules.mt5.error_message,
    error_type: modules.mt5.error_type,
    has_mt5_error: modules.mt5.has_mt5_error,
    is_eu: client.is_eu,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    is_mt5_success_dialog_enabled: modules.mt5.is_mt5_success_dialog_enabled,
    is_mt5_password_modal_enabled: modules.mt5.is_mt5_password_modal_enabled,
    setMt5Error: modules.mt5.setError,
    setMt5SuccessDialog: modules.mt5.setMt5SuccessDialog,
    submitMt5Password: modules.mt5.submitMt5Password,
    trading_servers: client.trading_servers,
    mt5_login_list: client.mt5_login_list,
}))(withRouter(MT5PasswordModal));
