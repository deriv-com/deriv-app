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
    Text,
    Button,
} from '@deriv/components';
import { isMobile, routes, validLength, validPassword, getErrorMessages, getStaticUrl } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import SuccessDialog from 'App/Containers/Modals/success-dialog.jsx';
import 'Sass/app/modules/mt5/mt5.scss';
import { connect } from 'Stores/connect';

const MT5PasswordResetHint = ({ closeModal }) => {
    const onResetPasswordClick = () => {
        location.href = getStaticUrl('/reset-password');
    };

    return (
        <div className='mt5-password-hint'>
            <Text as='p' size='s' weight='bold' align='center' className='mt5-password-hint__header'>
                <Localize i18n_default_text='Too many failed attempts' />
            </Text>
            <Text as='p' size='xxs' align='center' className='mt5-password-hint__description'>
                <Localize i18n_default_text='Unavailable because of too many failed attempts. Please try again in an hour or reset your account password to continue.' />
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

const MT5PasswordForm = props => (
    <Formik
        initialValues={{
            password: '',
        }}
        validate={props.validatePassword}
        onSubmit={(values, actions) => {
            props.submitMt5Password(values.password, actions.setSubmitting);
            actions.setFieldValue('password', '');
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
            isSubmitting,
            touched,
        }) => (
            <form onSubmit={handleSubmit}>
                <div className='mt5-password-modal__content'>
                    <h2>
                        <Localize i18n_default_text='Confirm your password' />
                    </h2>
                    <div className='dc-modal__container_mt5-password-modal__body'>
                        <div className='input-element'>
                            <PasswordMeter
                                input={values.password}
                                has_error={!!(touched.password && errors.password)}
                                custom_feedback_messages={getErrorMessages().password_warnings}
                            >
                                {() => (
                                    <PasswordInput
                                        autoComplete='new-password'
                                        label={localize('Password')}
                                        error={touched.password && (errors.password || props.error_message)}
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
                        <Text as='p' align='center' size='xxs' className='dc-modal__container_mt5-password-modal__hint'>
                            <Localize
                                i18n_default_text='Please confirm your Deriv/Binary.com password to create a DMT5/an MT5 account. <0 /> If you’ve forgotten your password, click <1>Reset password</1>.'
                                components={[
                                    <br key={0} />,
                                    <a
                                        key={1}
                                        href={getStaticUrl('/reset-password')}
                                        className='dc-modal__container_mt5-password-modal__password-hint'
                                        target='_blank'
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
                    is_disabled={isSubmitting || !values.password || Object.keys(errors).length > 0}
                    has_cancel
                    cancel_label={localize('Reset Password')}
                    onCancel={props.handleCancel}
                    is_absolute={isMobile()}
                    is_loading={isSubmitting}
                    label={localize('Next')}
                    form_error={props.form_error}
                />
            </form>
        )}
    </Formik>
);

const MT5PasswordModal = ({
    account_status,
    account_title,
    account_type,
    disableMt5PasswordModal,
    email,
    error_message,
    error_type,
    form_error,
    history,
    has_mt5_error,
    is_mt5_password_modal_enabled,
    is_mt5_success_dialog_enabled,
    setMt5SuccessDialog,
    setMt5Error,
    submitMt5Password,
}) => {
    const handleCancel = () => {
        location.href = getStaticUrl('/reset-password');
        closeModal();
    };

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
    };

    const closeModal = () => {
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

    const password_reset_body = (
        <div className='dc-modal__container_mt5-reset-password-modal__body'>
            <Icon icon='IcMt5OnePassword' size='128' />
            <Text as='p' align='center' size='xxs'>
                <Localize i18n_default_text='We’ve upgraded our system to support a single, more secure password across all of Deriv/Binary.com. Once you’ve set a new password, you can use it to log into all your Deriv/Binary.com, and DMT5/MT5 accounts.' />
            </Text>
            <a
                href={getStaticUrl('reset-password')}
                target='_blank'
                rel='noreferrer'
                className='dc-btn dc-btn--primary dc-btn__large dc-modal__container_mt5-reset-password-modal__button'
            >
                <Localize i18n_default_text='Reset password' />
            </a>
        </div>
    );
    if (account_status.status.includes('password_reset_required')) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal
                        width='50rem'
                        className='mt5-reset-password-modal'
                        is_open={should_show_password}
                        toggleModal={closeModal}
                        has_close_icon
                        renderTitle={() => {
                            return <Localize i18n_default_text='All you’ll need from now is one password' />;
                        }}
                    >
                        {password_reset_body}
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
                        {password_reset_body}
                    </MobileDialog>
                </MobileWrapper>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='mt5-password-modal'
                    is_open={should_show_password}
                    toggleModal={closeModal}
                    has_close_icon
                >
                    {!is_password_reset && (
                        <MT5PasswordForm
                            account_title={account_title}
                            handleCancel={handleCancel}
                            form_error={form_error}
                            error_type={error_type}
                            error_message={error_message}
                            submitMt5Password={submitMt5Password}
                            is_real_financial_stp={is_real_financial_stp}
                            validatePassword={validatePassword}
                        />
                    )}
                    {is_password_reset && <MT5PasswordResetHint closeModal={closeModal} />}
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
                    {!is_password_reset && (
                        <MT5PasswordForm
                            account_title={account_title}
                            handleCancel={handleCancel}
                            form_error={form_error}
                            error_type={error_type}
                            error_message={error_message}
                            submitMt5Password={submitMt5Password}
                            is_real_financial_stp={is_real_financial_stp}
                            validatePassword={validatePassword}
                        />
                    )}
                    {is_password_reset && <MT5PasswordResetHint closeModal={closeModal} />}
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
    disableMt5PasswordModal: modules.mt5.disableMt5PasswordModal,
    error_message: modules.mt5.error_message,
    error_type: modules.mt5.error_type,
    has_mt5_error: modules.mt5.has_mt5_error,
    is_mt5_success_dialog_enabled: modules.mt5.is_mt5_success_dialog_enabled,
    is_mt5_password_modal_enabled: modules.mt5.is_mt5_password_modal_enabled,
    setMt5Error: modules.mt5.setError,
    setMt5SuccessDialog: modules.mt5.setMt5SuccessDialog,
    submitMt5Password: modules.mt5.submitMt5Password,
}))(withRouter(MT5PasswordModal));
