import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { SentEmailModal } from '@deriv/account';
import { getMtCompanies } from 'Stores/Modules/CFD/Helpers/cfd-config';
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
import {
    isMobile,
    routes,
    validLength,
    validPassword,
    getErrorMessages,
    isDesktop,
    CFD_PLATFORMS,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import SuccessDialog from 'App/Containers/Modals/success-dialog.jsx';
import 'Sass/app/modules/mt5/cfd.scss';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';

const RequireTradingPasswordModal = ({
    should_set_trading_password,
    has_mt5_account,
    children,
    platform,
    is_dxtrade_allowed,
}) => {
    if (should_set_trading_password && has_mt5_account) {
        return (
            <div className='mt5-trading-password-required'>
                <Icon icon='IcMt5OnePassword' size='128' />
                <Text as='h2' size='s' line_height='24' weight='bold'>
                    <Localize i18n_default_text='Set your trading password' />
                </Text>
                <Text as='p' size='xs' align='center'>
                    {is_dxtrade_allowed ? (
                        <Localize
                            i18n_default_text='A trading password can be used to sign into any of your {{platform1}} (and {{platform2}}) accounts. '
                            values={{
                                platform1: platform === CFD_PLATFORMS.MT5 ? 'DMT5' : 'Deriv X',
                                platform2: platform === CFD_PLATFORMS.MT5 ? 'Deriv X' : 'DMT5',
                            }}
                        />
                    ) : (
                        <Localize i18n_default_text='You can now create one secure password to log into all your DMT5 accounts.' />
                    )}
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
    if (should_set_trading_password && has_mt5_account) {
        return null;
    }

    const element = isMobile() ? 'p' : 'span';
    const alignment = isMobile() ? 'center' : 'left';
    const font_size = isMobile() ? 'xs' : 's';
    const style = isMobile()
        ? {
              paddingTop: '2rem',
          }
        : {};

    return (
        <Text styles={style} as={element} line_height='24' weight='bold' size={font_size} align={alignment}>
            {!should_show_server_form && should_set_trading_password && !is_password_reset_error && (
                <Localize i18n_default_text='Set a trading password' />
            )}
            {!should_show_server_form && !should_set_trading_password && !is_password_reset_error && (
                <Localize i18n_default_text='Enter your trading password' />
            )}
            {!should_show_server_form && is_password_reset_error && <Localize i18n_default_text='Too many attempts' />}
            {should_show_server_form && (
                <Localize
                    i18n_default_text='Choose a region for your DMT5 {{ account_type }} account'
                    values={{
                        account_type: account_title,
                    }}
                />
            )}
        </Text>
    );
};
const getSubmitText = (type, category, platform) => {
    if (!category && !type) return '';

    const category_label = category === 'real' ? localize('real') : localize('demo');
    const type_label = getMtCompanies()[category][type].short_title;

    if (category === 'real') {
        return (
            <Localize
                i18n_default_text='You have created a <0>{{platform}}</0> {{category}} <1>{{type}}</1> account. To start trading, transfer funds from your Deriv account into this account.'
                values={{
                    type: type_label,
                    platform: platform === CFD_PLATFORMS.DXTRADE ? 'Deriv X' : 'DMT5',
                    category: category_label,
                }}
                components={[<i className='cfd-account__platform' key={0} />, <strong key={1} />]}
            />
        );
    }

    return (
        <Localize
            i18n_default_text='You have created a <0>{{platform}}</0> {{category}} <1>{{type}}</1> account.'
            values={{
                type: type_label,
                platform: platform === CFD_PLATFORMS.DXTRADE ? 'Deriv X' : 'DMT5',
                category: category_label,
            }}
            components={[<i className='cfd-account__platform' key={0} />, <strong key={1} />]}
        />
    );
};

const IconType = React.memo(({ platform, type }) => {
    if (platform === CFD_PLATFORMS.DXTRADE) {
        if (type === 'synthetic') {
            return <Icon icon='IcDxtradeSyntheticPlatform' size={128} />;
        } else if (type === 'financial') {
            return <Icon icon='IcDxtradeFinancialPlatform' size={128} />;
        }
    }

    switch (type) {
        case 'synthetic':
            return <Icon icon='IcMt5SyntheticPlatform' size={128} />;
        case 'financial':
            return <Icon icon='IcMt5FinancialPlatform' size={128} />;
        default:
            return <Icon icon='IcMt5FinancialStpPlatform' size={128} />;
    }
});
IconType.displayName = 'IconType';

const getCancelButtonLabel = ({ should_set_trading_password, error_type, should_show_server_form }) => {
    if (should_set_trading_password && error_type !== 'PasswordReset') {
        return isDesktop() ? null : localize('Cancel');
    }
    if (should_show_server_form) {
        return localize('Back');
    }

    return localize('Forgot password?');
};

const CFDPasswordForm = props => {
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
        props.should_show_server_form ||
        (isDesktop() ? !props.should_set_trading_password : true) ||
        props.error_type === 'PasswordReset';
    const cancel_button_label = getCancelButtonLabel(props);

    const handleCancel = () => {
        if (!has_cancel_button) {
            return undefined;
        }
        if (props.should_set_trading_password) {
            return props.onCancel();
        }

        return props.onForgotPassword();
    };

    if (props.error_type === 'PasswordReset') {
        return (
            <React.Fragment>
                <div className='cfd-password-reset'>
                    <div className='cfd-password-modal__content cfd-password-modal__content--password-reset'>
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
                password: '',
            }}
            enableReinitialize
            validate={props.validatePassword}
            onSubmit={props.submitPassword}
        >
            {({ errors, isSubmitting, handleBlur, handleChange, handleSubmit, setFieldTouched, touched, values }) => (
                <form onSubmit={handleSubmit}>
                    <div className='cfd-password-modal__content dc-modal__container_cfd-password-modal__body'>
                        <div className='input-element'>
                            <PasswordMeter
                                input={values.password}
                                has_error={!!(touched.password && errors.password) || !!props.error_message}
                                custom_feedback_messages={getErrorMessages().password_warnings}
                            >
                                {() => (
                                    <PasswordInput
                                        autoComplete='new-password'
                                        label={localize('Trading password')}
                                        error={
                                            (touched.password && errors.password) ||
                                            (values.password.length === 0 ? props.error_message : '')
                                        }
                                        name='password'
                                        value={values.password}
                                        onBlur={handleBlur}
                                        onChange={e => {
                                            setFieldTouched('password', true);
                                            handleChange(e);
                                        }}
                                    />
                                )}
                            </PasswordMeter>
                        </div>
                        {props.is_real_financial_stp && !props.is_bvi && (
                            <div className='dc-modal__container_cfd-password-modal__description'>
                                <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Deriv (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA). None of your other accounts, including your Deriv account, is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA).' />
                            </div>
                        )}
                        {props.should_set_trading_password && (
                            <Text size='xs' as='p'>
                                {props.is_dxtrade_allowed ? (
                                    <Localize i18n_default_text='Use this to log in and trade on DMT5 and Deriv X.' />
                                ) : (
                                    <Localize i18n_default_text='Use this to log in and trade on DMT5.' />
                                )}
                            </Text>
                        )}
                        {props.is_real_financial_stp && props.is_bvi && (
                            <div className='dc-modal__container_cfd-password-modal__description'>
                                <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Deriv (BVI) Ltd. All trading in this account is subject to the regulations and guidelines of the British Virgin Islands Financial Services Commission (BVIFSC). None of your other accounts, including your Deriv account, is subject to the regulations and guidelines of the British Virgin Islands Financial Services Commission (BVIFSC).' />
                            </div>
                        )}
                        {props.error_type === 'PasswordError' && (
                            <Text size='xs' as='p' className='dc-modal__container_mt5-password-modal__hint'>
                                <Localize i18n_default_text='Hint: You may have chosen a different trading password from your Deriv log in password.' />
                            </Text>
                        )}
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

const CFDServerForm = ({ ...props }) => {
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
                    <div className='cfd-password-modal__content'>
                        <div className='dc-modal__container_cfd-password-modal__body'>
                            <div className='input-element'>
                                <RadioGroup
                                    className='cfd-password-modal__radio'
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

const CFDPasswordModal = ({
    account_title,
    account_type,
    account_status,
    disableCFDPasswordModal,
    email,
    error_message,
    error_type,
    form_error,
    history,
    is_eu,
    is_eu_country,
    is_logged_in,
    is_cfd_password_modal_enabled,
    is_cfd_success_dialog_enabled,
    is_dxtrade_allowed,
    platform,
    has_cfd_error,
    landing_companies,
    mt5_login_list,
    cfd_new_account,
    setCFDSuccessDialog,
    setMt5Error,
    submitMt5Password,
    submitCFDPassword,
    trading_servers,
}) => {
    const [server, setServer] = React.useState('');

    const is_bvi = landing_companies?.mt_financial_company?.financial_stp?.shortcode === 'bvi';
    const has_mt5_account = Boolean(mt5_login_list?.length);
    const should_set_trading_password =
        Array.isArray(account_status.status) && account_status.status.includes('trading_password_required');
    const is_password_error = error_type === 'PasswordError';
    const is_password_reset = error_type === 'PasswordReset';
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

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
        setCFDSuccessDialog(false);
        setMt5Error(false);
        setServer('');
    };

    const closeModal = () => {
        closeDialogs();
        disableCFDPasswordModal();
    };

    const closeOpenSuccess = () => {
        disableCFDPasswordModal();
        closeDialogs();
        if (account_type.category === 'real') {
            sessionStorage.setItem('cfd_transfer_to_login_id', cfd_new_account.login);
            history.push(routes.cashier_acc_transfer);
        }
    };

    const handleForgotPassword = () => {
        closeModal();
        WS.verifyEmail(email, 'trading_platform_password_reset');
        setIsSentEmailModalOpen(true);
    };

    const submitPassword = (values, actions) => {
        if (platform === CFD_PLATFORMS.MT5) {
            submitMt5Password(
                {
                    ...values,
                    server,
                },
                actions
            );
        } else {
            values.platform = platform;
            submitCFDPassword(values, actions);
        }
    };

    const should_show_password =
        is_cfd_password_modal_enabled &&
        !is_cfd_success_dialog_enabled &&
        (!has_cfd_error || is_password_error || is_password_reset);

    const should_show_success = !has_cfd_error && is_cfd_success_dialog_enabled && is_cfd_password_modal_enabled;
    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';
    const is_real_synthetic = [account_type.category, account_type.type].join('_') === 'real_synthetic';
    const should_show_server_form = React.useMemo(() => {
        return (
            (is_logged_in ? !is_eu : !is_eu_country) &&
            is_real_synthetic &&
            mt5_login_list.some(
                item =>
                    item.account_type === 'real' && (item.market_type === 'gaming' || item.market_type === 'synthetic')
            ) &&
            !server &&
            platform === CFD_PLATFORMS.MT5
        );
    }, [is_eu, is_eu_country, is_logged_in, is_real_synthetic, server, mt5_login_list, platform]);

    React.useEffect(() => {
        if ((!is_password_error && !is_password_reset && has_cfd_error) || is_cfd_success_dialog_enabled) {
            setServer('');
        }
    }, [has_cfd_error, is_cfd_success_dialog_enabled, is_password_error, is_password_reset]);

    const cfd_password_form = (
        <CFDPasswordForm
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
            onForgotPassword={handleForgotPassword}
            submitPassword={submitPassword}
            platform={platform}
            is_dxtrade_allowed={is_dxtrade_allowed}
            onCancel={closeModal}
        />
    );

    const cfd_server_form = (
        <CFDServerForm
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
                    className='cfd-password-modal'
                    has_close_icon={!should_show_server_form || should_set_trading_password}
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
                        platform={platform}
                        is_dxtrade_allowed={is_dxtrade_allowed}
                    >
                        {should_show_server_form ? cfd_server_form : cfd_password_form}
                    </RequireTradingPasswordModal>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    has_full_height
                    portal_element_id='modal_root'
                    visible={should_show_password}
                    onClose={closeModal}
                    wrapper_classname='cfd-password-modal'
                >
                    <PasswordModalHeader
                        should_show_server_form={should_show_server_form}
                        should_set_trading_password={should_set_trading_password}
                        account_title={account_title}
                        has_mt5_account={has_mt5_account}
                        is_password_reset_error={is_password_reset}
                    />
                    <RequireTradingPasswordModal
                        has_mt5_account={has_mt5_account}
                        should_set_trading_password={should_set_trading_password}
                        platform={platform}
                        is_dxtrade_allowed={is_dxtrade_allowed}
                    >
                        {should_show_server_form ? cfd_server_form : cfd_password_form}
                    </RequireTradingPasswordModal>
                </MobileDialog>
            </MobileWrapper>
            <SuccessDialog
                is_open={should_show_success}
                toggleModal={closeModal}
                onCancel={closeModal}
                onSubmit={closeOpenSuccess}
                classNameMessage='cfd-password-modal__message'
                message={getSubmitText(account_type.type, account_type.category, platform)}
                icon={<IconType platform={platform} type={account_type.type} />}
                icon_size='xlarge'
                text_submit={account_type.category === 'real' ? localize('Transfer now') : localize('Continue')}
                has_cancel={account_type.category === 'real'}
            />
            <SentEmailModal
                is_open={is_sent_email_modal_open}
                identifier_title='trading_password'
                onClose={() => setIsSentEmailModalOpen(false)}
                onClickSendEmail={handleForgotPassword}
            />
        </React.Fragment>
    );
};

CFDPasswordModal.propTypes = {
    account_title: PropTypes.string,
    account_type: PropTypes.object,
    disableCFDPasswordModal: PropTypes.func,
    email: PropTypes.string,
    error_message: PropTypes.string,
    has_cfd_error: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_eu_country: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_cfd_password_modal_enabled: PropTypes.bool,
    is_cfd_success_dialog_enabled: PropTypes.bool,
    is_dxtrade_allowed: PropTypes.bool,
    platform: PropTypes.string,
    setMt5Error: PropTypes.func,
    setCFDSuccessDialog: PropTypes.func,
    submitMt5Password: PropTypes.func,
    submitCFDPassword: PropTypes.func,
    cfd_new_account: PropTypes.object,
};

export default connect(({ client, modules }) => ({
    email: client.email,
    account_title: modules.cfd.account_title,
    account_type: modules.cfd.account_type,
    account_status: client.account_status,
    clearCFDError: modules.cfd.clearCFDError,
    disableCFDPasswordModal: modules.cfd.disableCFDPasswordModal,
    error_message: modules.cfd.error_message,
    error_type: modules.cfd.error_type,
    has_cfd_error: modules.cfd.has_cfd_error,
    landing_companies: client.landing_companies,
    is_eu: client.is_eu,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    is_cfd_success_dialog_enabled: modules.cfd.is_cfd_success_dialog_enabled,
    is_cfd_password_modal_enabled: modules.cfd.is_cfd_password_modal_enabled,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
    setMt5Error: modules.cfd.setError,
    setCFDSuccessDialog: modules.cfd.setCFDSuccessDialog,
    submitMt5Password: modules.cfd.submitMt5Password,
    submitCFDPassword: modules.cfd.submitCFDPassword,
    cfd_new_account: modules.cfd.new_account_response,
    trading_servers: client.trading_servers,
    mt5_login_list: client.mt5_login_list,
}))(withRouter(CFDPasswordModal));
