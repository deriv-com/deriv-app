import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { useHistory, NavLink } from 'react-router-dom';
import {
    DesktopWrapper,
    FormSubmitButton,
    Icon,
    MobileWrapper,
    MobileDialog,
    Modal,
    PasswordInput,
    PasswordMeter,
    RadioGroup,
    Text,
} from '@deriv/components';
import { isMobile, routes, validLength, validPassword, getErrorMessages } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import SuccessDialog from 'App/Containers/Modals/success-dialog.jsx';
import 'Sass/app/modules/mt5/mt5.scss';
import { connect } from 'Stores/connect';

const RequireTradingPasswordModal = ({ should_set_trading_password, has_mt5_account, children }) => {
    if (should_set_trading_password && has_mt5_account) {
        return (
            <div className='mt5-trading-password-required'>
                <Icon icon='IcMt5OnePassword' size='128' />
                <Text as='h2' size='s' line_height='24' weight='bold'>
                    <Localize i18n_default_text='Set your trading password' />
                </Text>
                <Text as='p' size='xs' align='center'>
                    <Localize i18n_default_text='You can now create one secure password to log into all your DMT5 accounts.' />
                </Text>
                <NavLink to={routes.passwords} className='dc-btn dc-btn--primary dc-btn__large'>
                    <Text color='colored-background' weight='bold' size='xs'>
                        <Localize i18n_default_text='Set your trading password' />
                    </Text>
                </NavLink>
            </div>
        );
    }
    return children;
};

const PasswordModalHeader = ({
    should_set_trading_password,
    should_show_server_form,
    account_title,
    is_password_reset_error,
    has_mt5_account,
}) => {
    if (should_set_trading_password && has_mt5_account && !should_show_server_form) {
        return null;
    }

    return (
        <Text as='span' line_height='24' weight='bold' size='xs'>
            {!should_show_server_form && should_set_trading_password && !is_password_reset_error && (
                <Localize i18n_default_text='Set a trading password' />
            )}
            {!should_show_server_form && !should_set_trading_password && !is_password_reset_error && (
                <Localize i18n_default_text='Enter your trading password' />
            )}
            {!should_show_server_form && is_password_reset_error && <Localize i18n_default_text='Too many attempts' />}
            {should_show_server_form && (
                <Localize
                    i18n_default_text='Choose a server for your DMT5 {{ account_type }} account'
                    values={{
                        account_type: account_title,
                    }}
                />
            )}
        </Text>
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

const getCancelButtonLabel = ({ should_set_trading_password, error_type, should_show_server_form }) => {
    if (should_set_trading_password && error_type !== 'PasswordReset') {
        return null;
    }
    if (should_show_server_form) {
        return localize('Cancel');
    }

    return localize('Forgot password?');
};

const MT5PasswordForm = props => {
    const button_label = React.useMemo(() => {
        if (props.should_show_server_form) {
            return localize('Next');
        } else if (!props.should_show_server_form && props.should_set_trading_password) {
            return localize('Set trading password');
        } else if (props.error_type === 'PasswordReset') {
            return localize('Try later');
        }
        return localize('Add account');
    }, [props.should_show_server_form, props.should_set_trading_password, props.error_type]);
    const has_cancel_button =
        props.should_show_server_form || !props.should_set_trading_password || props.error_type === 'PasswordReset';
    const cancel_button_label = getCancelButtonLabel(props);
    const history = useHistory();
    const handleCancel = () => {
        if (!has_cancel_button) {
            return undefined;
        }
        if (!props.should_set_trading_password) {
            return history.push(routes.passwords);
        }
        return props.onCancel();
    };

    if (props.error_type === 'PasswordReset') {
        return (
            <React.Fragment>
                <div className='mt5-password-reset'>
                    <div className='mt5-password-modal__content mt5-password-modal__content--password-reset'>
                        <Text as='p' line_height='24' size='xs'>
                            <Localize i18n_default_text='Please try again in a minute.' />
                        </Text>
                    </div>
                    <Formik onSubmit={props.closeModal} initialValues={{}}>
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <FormSubmitButton
                                    has_cancel={has_cancel_button}
                                    cancel_label={cancel_button_label}
                                    onCancel={handleCancel}
                                    is_absolute={isMobile()}
                                    label={button_label}
                                />
                            </form>
                        )}
                    </Formik>
                </div>
            </React.Fragment>
        );
    }

    return (
        <Formik
            initialValues={{
                password: props.password,
            }}
            enableReinitialize
            validate={props.validatePassword}
            validateOnMount
            validateOnChange
            onSubmit={(values, { setSubmitting }) => props.submitMt5Password(values, setSubmitting)}
        >
            {({ errors, isSubmitting, handleBlur, handleChange, handleSubmit, setFieldTouched, touched, values }) => (
                <form onSubmit={handleSubmit}>
                    <div className='mt5-password-modal__content'>
                        <div className='dc-modal__container_mt5-password-modal__body'>
                            <div className='input-element'>
                                <PasswordMeter
                                    input={values.password}
                                    has_error={!!(touched.password && errors.password) || !!props.error_message}
                                    custom_feedback_messages={getErrorMessages().password_warnings}
                                >
                                    {({ has_warning }) => (
                                        <PasswordInput
                                            autoComplete='new-password'
                                            label={localize('Trading password')}
                                            error={
                                                (touched.password && errors.password) ||
                                                (values.password.length === 0 ? props.error_message : '')
                                            }
                                            hint={
                                                !has_warning &&
                                                props.should_set_trading_password &&
                                                localize(
                                                    'Minimum of eight lower and uppercase English letters with numbers'
                                                )
                                            }
                                            name='password'
                                            value={values.password}
                                            onBlur={handleBlur}
                                            onChange={e => {
                                                setFieldTouched('password', true);
                                                props.setPassword(e.target.value);
                                                handleChange(e);
                                            }}
                                        />
                                    )}
                                </PasswordMeter>
                            </div>
                            {props.is_real_financial_stp && !props.is_bvi && (
                                <div className='dc-modal__container_mt5-password-modal__description'>
                                    <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Deriv (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA). None of your other accounts, including your Deriv account, is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA).' />
                                </div>
                            )}
                            {props.should_set_trading_password && (
                                <Text size='xs' as='p'>
                                    <Localize i18n_default_text='Use this to log in and trade on Deriv MT5.' />
                                </Text>
                            )}
                            {props.is_real_financial_stp && props.is_bvi && (
                                <div className='dc-modal__container_mt5-password-modal__description'>
                                    <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Deriv (BVI) Ltd. All trading in this account is subject to the regulations and guidelines of the British Virgin Islands Financial Services Commission (BVIFSC). None of your other accounts, including your Deriv account, is subject to the regulations and guidelines of the British Virgin Islands Financial Services Commission (BVIFSC).' />
                                </div>
                            )}
                        </div>
                    </div>
                    <FormSubmitButton
                        is_disabled={!values.password || Object.keys(errors).length > 0}
                        has_cancel={has_cancel_button}
                        cancel_label={cancel_button_label}
                        onCancel={handleCancel}
                        is_absolute={isMobile()}
                        is_loading={isSubmitting}
                        label={button_label}
                        form_error={props.form_error}
                    />
                </form>
            )}
        </Formik>
    );
};

const MT5ServerForm = ({ ...props }) => {
    const available_servers = React.useMemo(() => {
        return [...props.trading_servers]
            .map(server => {
                // Transform properties to support radiogroup
                return {
                    ...server,
                    ...{
                        label: `${server.geolocation.region} ${
                            server.geolocation.sequence === 1 ? '' : server.geolocation.sequence
                        } ${server.disabled ? `(${server.message_to_client})` : ''}`,
                        value: server.id,
                        disabled: server.disabled,
                    },
                };
            })
            .sort((a, b) => (a.recommended ? a : b))
            .sort((a, b) => a.disabled - b.disabled);
    }, [props.trading_servers]);

    return (
        <Formik
            initialValues={{
                server: props.trading_servers.find(server => !server.disabled)?.id ?? '',
            }}
            validate={props.validateServer}
            onSubmit={values => props.submitMt5Server(values.server)}
        >
            {({ handleSubmit, setFieldValue, errors, values, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <div className='mt5-password-modal__content'>
                        <div className='dc-modal__container_mt5-password-modal__body'>
                            <div className='input-element'>
                                <RadioGroup
                                    className='mt5-password-modal__radio'
                                    name='server'
                                    required
                                    selected={props.trading_servers.find(server => !server.disabled)?.id}
                                    onToggle={e => {
                                        e.persist();
                                        setFieldValue('server', e.target.value);
                                    }}
                                >
                                    {available_servers.map(item => (
                                        <RadioGroup.Item
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}
                                            disabled={item.disabled}
                                        />
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                    <FormSubmitButton
                        is_disabled={isSubmitting || !values.server || Object.keys(errors).length > 0}
                        has_cancel
                        cancel_label={localize('Cancel')}
                        onCancel={props.closeModal}
                        is_absolute={isMobile()}
                        is_loading={isSubmitting}
                        label={localize('Next')}
                        form_error={props.form_error}
                    />
                </form>
            )}
        </Formik>
    );
};

const MT5PasswordModal = ({
    account_title,
    account_type,
    account_status,
    disableMt5PasswordModal,
    email,
    error_message,
    error_type,
    form_error,
    history,
    is_eu,
    is_eu_country,
    is_logged_in,
    is_mt5_password_modal_enabled,
    is_mt5_success_dialog_enabled,
    has_mt5_error,
    landing_companies,
    mt5_login_list,
    mt5_new_account,
    setMt5SuccessDialog,
    setMt5Error,
    submitMt5Password,
    trading_servers,
}) => {
    const [server, setServer] = React.useState('');
    const [password, setPassword] = React.useState('');

    const is_bvi = landing_companies?.mt_financial_company?.financial_stp?.shortcode === 'bvi';
    const has_mt5_account = Boolean(mt5_login_list?.length);
    const should_set_trading_password =
        Array.isArray(account_status.status) && account_status.status.includes('trading_password_required');
    const is_password_error = error_type === 'PasswordError';
    const is_password_reset = error_type === 'PasswordReset';

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
        setServer('');
    };

    const closeModal = () => {
        closeDialogs();
        disableMt5PasswordModal();
    };

    const closeOpenSuccess = () => {
        disableMt5PasswordModal();
        closeDialogs();
        if (account_type.category === 'real') {
            sessionStorage.setItem('mt5_transfer_to_login_id', mt5_new_account.login);
            history.push(routes.cashier_acc_transfer);
        }
    };

    const IconType = () => getIconFromType(account_type.type);
    const should_show_password = is_mt5_password_modal_enabled && !is_mt5_success_dialog_enabled;
    const should_show_success = !has_mt5_error && is_mt5_success_dialog_enabled;
    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';
    const is_real_synthetic = [account_type.category, account_type.type].join('_') === 'real_synthetic';
    const should_show_server_form = React.useMemo(() => {
        return (
            (is_logged_in ? !is_eu : !is_eu_country) &&
            is_real_synthetic &&
            mt5_login_list.some(item => item.account_type === 'real' && item.market_type === 'gaming') &&
            !server
        );
    }, [is_eu, is_eu_country, is_logged_in, is_real_synthetic, server, mt5_login_list]);

    React.useEffect(() => {
        if ((!is_password_error && !is_password_reset && has_mt5_error) || is_mt5_success_dialog_enabled) {
            setServer('');
        }
    }, [has_mt5_error, is_mt5_success_dialog_enabled, is_password_error]);
    React.useEffect(() => {
        if (is_password_error || is_password_reset) {
            setPassword('');
        }
    }, [is_password_reset, is_password_error]);

    const mt5_password_form = (
        <MT5PasswordForm
            is_bvi={is_bvi}
            account_title={account_title}
            closeModal={closeModal}
            error_type={error_type}
            error_message={error_message}
            has_mt5_account={has_mt5_account}
            form_error={form_error}
            should_set_trading_password={should_set_trading_password}
            is_real_financial_stp={is_real_financial_stp}
            validatePassword={validatePassword}
            should_show_server_form={should_show_server_form}
            submitMt5Password={submitMt5Password}
            password={password}
            setPassword={setPassword}
        />
    );

    const mt5_server_form = (
        <MT5ServerForm
            trading_servers={trading_servers}
            mt5_login_list={mt5_login_list}
            account_title={account_title}
            closeModal={closeModal}
            submitMt5Server={setServer}
        />
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='mt5-password-modal'
                    is_open={should_show_password}
                    toggleModal={closeModal}
                    should_header_stick_body
                    renderTitle={() => (
                        <PasswordModalHeader
                            should_show_server_form={should_show_server_form}
                            should_set_trading_password={should_set_trading_password}
                            account_title={account_title}
                            has_mt5_account={has_mt5_account}
                            is_password_reset_error={is_password_reset}
                        />
                    )}
                >
                    <RequireTradingPasswordModal
                        has_mt5_account={has_mt5_account}
                        should_set_trading_password={should_set_trading_password}
                    >
                        {should_show_server_form ? mt5_server_form : mt5_password_form}
                    </RequireTradingPasswordModal>
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
                    {should_show_server_form ? mt5_server_form : mt5_password_form}
                </MobileDialog>
            </MobileWrapper>
            <SuccessDialog
                is_open={should_show_success}
                toggleModal={closeModal}
                onCancel={closeModal}
                onSubmit={closeOpenSuccess}
                classNameMessage='mt5-password-modal__message'
                message={getSubmitText(account_title, account_type.category)}
                // message={error_message}
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
    account_title: modules.mt5.account_title,
    account_type: modules.mt5.account_type,
    account_status: client.account_status,
    disableMt5PasswordModal: modules.mt5.disableMt5PasswordModal,
    error_message: modules.mt5.error_message,
    error_type: modules.mt5.error_type,
    has_mt5_error: modules.mt5.has_mt5_error,
    landing_companies: client.landing_companies,
    is_eu: client.is_eu,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    is_mt5_success_dialog_enabled: modules.mt5.is_mt5_success_dialog_enabled,
    is_mt5_password_modal_enabled: modules.mt5.is_mt5_password_modal_enabled,
    setMt5Error: modules.mt5.setError,
    setMt5SuccessDialog: modules.mt5.setMt5SuccessDialog,
    submitMt5Password: modules.mt5.submitMt5Password,
    mt5_new_account: modules.mt5.new_account_response,
    trading_servers: client.trading_servers,
    mt5_login_list: client.mt5_login_list,
}))(withRouter(MT5PasswordModal));
