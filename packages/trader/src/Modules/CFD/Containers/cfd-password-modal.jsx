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
    PasswordMeter,
    RadioGroup,
} from '@deriv/components';
import { isMobile, routes, validLength, validPassword, getErrorMessages } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import SuccessDialog from 'App/Containers/Modals/success-dialog.jsx';
import 'Sass/app/modules/mt5/cfd.scss';
import { connect } from 'Stores/connect';

const getSubmitText = (account_title, category, platform) => {
    if (category === 'real') {
        return localize(
            'You have created a {{platform}} {{account_title}} account. To start trading, transfer funds from your Deriv account into this account.',
            { account_title, platform: platform === 'dxtrade' ? 'Deriv X' : 'DMT5' }
        );
    }

    return localize('You have created a {{platform}} {{account_title}} account.', {
        account_title,
        platform: platform === 'dxtrade' ? 'Deriv X' : 'DMT5',
    });
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

const CFDPasswordForm = props => (
    <Formik
        initialValues={{
            password: '',
            server: props.server,
        }}
        validate={props.validatePassword}
        onSubmit={(values, actions) => {
            const valuesObject = {
                password: values.password,
            };
            if (values.server) valuesObject.server = values.server;
            props.submitPassword(valuesObject, actions.setSubmitting);
        }}
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
                <div className='cfd-password-modal__content'>
                    <h2 className='cfd-password-modal__title'>
                        <Localize
                            i18n_default_text='Choose a password for your {{platform}} {{ account_type }} account'
                            values={{
                                platform: props.platform === 'dxtrade' ? 'Deriv X' : 'DMT5',
                                account_type: props.account_title,
                            }}
                        />
                    </h2>
                    <div className='dc-modal__container_cfd-password-modal__body'>
                        <div className='input-element'>
                            <PasswordMeter
                                input={values.password}
                                has_error={!!(touched.password && errors.password)}
                                custom_feedback_messages={getErrorMessages().password_warnings}
                            >
                                {({ has_warning }) => (
                                    <PasswordInput
                                        autoComplete='new-password'
                                        label={localize('Create a password')}
                                        error={touched.password && errors.password}
                                        hint={
                                            !has_warning &&
                                            localize(
                                                'Minimum of eight lower and uppercase English letters with numbers'
                                            )
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
                        {props.is_real_financial_stp && props.is_bvi && (
                            <div className='dc-modal__container_cfd-password-modal__description'>
                                <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Deriv (BVI) Ltd. All trading in this account is subject to the regulations and guidelines of the British Virgin Islands Financial Services Commission (BVIFSC). None of your other accounts, including your Deriv account, is subject to the regulations and guidelines of the British Virgin Islands Financial Services Commission (BVIFSC).' />
                            </div>
                        )}
                    </div>
                </div>
                <FormSubmitButton
                    is_disabled={!values.password || Object.keys(errors).length > 0}
                    has_cancel
                    cancel_label={props.server ? localize('Back') : localize('Cancel')}
                    onCancel={props.onBack}
                    is_absolute={isMobile()}
                    is_loading={isSubmitting}
                    label={localize('Add account')}
                    form_error={props.form_error}
                />
            </form>
        )}
    </Formik>
);

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
                        <h2>
                            <Localize
                                i18n_default_text='Choose a server for your DMT5 {{ account_type }} account'
                                values={{
                                    account_type: props.account_title,
                                }}
                            />
                        </h2>
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
    disableCFDPasswordModal,
    email,
    // error_message,
    landing_companies,
    is_eu,
    is_eu_country,
    is_logged_in,
    form_error,
    history,
    has_cfd_error,
    is_cfd_password_modal_enabled,
    is_cfd_success_dialog_enabled,
    platform,
    setCFDSuccessDialog,
    setMt5Error,
    submitMt5Password,
    submitCFDPassword,
    trading_servers,
    mt5_login_list,
    cfd_new_account,
}) => {
    const [server, setServer] = React.useState('');

    const is_bvi = React.useMemo(() => {
        return landing_companies?.mt_financial_company?.financial_stp?.shortcode === 'bvi';
    }, [landing_companies]);

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

    const onBack = () => {
        if (server) {
            setServer('');
        } else {
            closeModal();
        }
    };

    const closeOpenSuccess = () => {
        disableCFDPasswordModal();
        closeDialogs();
        if (account_type.category === 'real') {
            sessionStorage.setItem('cfd_transfer_to_login_id', cfd_new_account.login);
            history.push(routes.cashier_acc_transfer);
        }
    };

    const submitPassword = (values, setSubmitting) => {
        if (platform === 'mt5') {
            submitMt5Password(values, setSubmitting);
        } else {
            values.platform = platform;
            submitCFDPassword(values, setSubmitting);
        }
    };

    const IconType = () => getIconFromType(account_type.type);
    const should_show_password = is_cfd_password_modal_enabled && !has_cfd_error && !is_cfd_success_dialog_enabled;
    const should_show_success = !has_cfd_error && is_cfd_success_dialog_enabled;
    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';
    const is_real_synthetic = [account_type.category, account_type.type].join('_') === 'real_synthetic';
    const should_show_server_form = React.useMemo(() => {
        return (
            (is_logged_in ? !is_eu : !is_eu_country) &&
            is_real_synthetic &&
            mt5_login_list.some(item => item.account_type === 'real' && item.market_type === 'gaming') &&
            !server &&
            platform === 'mt5'
        );
    }, [is_eu, is_eu_country, is_logged_in, is_real_synthetic, server, mt5_login_list, platform]);

    React.useEffect(() => {
        if (has_cfd_error || is_cfd_success_dialog_enabled) {
            setServer('');
        }
    }, [has_cfd_error, is_cfd_success_dialog_enabled]);

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='cfd-password-modal'
                    is_open={should_show_password}
                    toggleModal={closeModal}
                    has_close_icon
                >
                    {should_show_server_form ? (
                        <CFDServerForm
                            trading_servers={trading_servers}
                            mt5_login_list={mt5_login_list}
                            account_title={account_title}
                            closeModal={closeModal}
                            submitMt5Server={setServer}
                        />
                    ) : (
                        <CFDPasswordForm
                            is_bvi={is_bvi}
                            account_title={account_title}
                            closeModal={closeModal}
                            form_error={form_error}
                            server={server}
                            onBack={onBack}
                            submitPassword={submitPassword}
                            is_real_financial_stp={is_real_financial_stp}
                            validatePassword={validatePassword}
                            should_show_server_form={should_show_server_form}
                            platform={platform}
                        />
                    )}
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
                    {should_show_server_form ? (
                        <CFDServerForm
                            trading_servers={trading_servers}
                            mt5_login_list={mt5_login_list}
                            account_title={account_title}
                            closeModal={closeModal}
                            submitMt5Server={setServer}
                        />
                    ) : (
                        <CFDPasswordForm
                            is_bvi={is_bvi}
                            account_title={account_title}
                            closeModal={closeModal}
                            form_error={form_error}
                            server={server}
                            onBack={onBack}
                            submitPassword={(v, setSubmitting) => submitMt5Password(v, setSubmitting)}
                            is_real_financial_stp={is_real_financial_stp}
                            validatePassword={validatePassword}
                            should_show_server_form={should_show_server_form}
                            platform={platform}
                        />
                    )}
                </MobileDialog>
            </MobileWrapper>
            <SuccessDialog
                is_open={should_show_success}
                toggleModal={closeModal}
                onCancel={closeModal}
                onSubmit={closeOpenSuccess}
                classNameMessage='cfd-password-modal__message'
                message={getSubmitText(account_title, account_type.category, platform)}
                // message={error_message}
                icon={<IconType />}
                icon_size='xlarge'
                text_submit={account_type.category === 'real' ? localize('Transfer now') : localize('OK')}
                has_cancel={account_type.category === 'real'}
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
    disableCFDPasswordModal: modules.cfd.disableCFDPasswordModal,
    error_message: modules.cfd.error_message,
    has_cfd_error: modules.cfd.has_cfd_error,
    landing_companies: client.landing_companies,
    is_eu: client.is_eu,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    is_cfd_success_dialog_enabled: modules.cfd.is_cfd_success_dialog_enabled,
    is_cfd_password_modal_enabled: modules.cfd.is_cfd_password_modal_enabled,
    setMt5Error: modules.cfd.setError,
    setCFDSuccessDialog: modules.cfd.setCFDSuccessDialog,
    submitMt5Password: modules.cfd.submitMt5Password,
    submitCFDPassword: modules.cfd.submitCFDPassword,
    cfd_new_account: modules.cfd.new_account_response,
    trading_servers: client.trading_servers,
    mt5_login_list: client.mt5_login_list,
}))(withRouter(CFDPasswordModal));
