import React from 'react';
import { useHistory } from 'react-router';
import { FormikErrors } from 'formik';

import { SentEmailModal } from '@deriv/account';
import { MobileDialog, Modal, MobileWrapper, DesktopWrapper } from '@deriv/components';
import {
    getAuthenticationStatusInfo,
    getCFDPlatformLabel,
    getErrorMessages,
    isDesktop,
    routes,
    validLength,
    validPassword,
    validMT5Password,
    WS,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

import SuccessDialog from '../../Components/success-dialog.jsx';
import MigrationSuccessModal from '../../Components/migration-success-modal/index';
import {
    getDxCompanies,
    getMtCompanies,
    TDxCompanies,
    TMtCompanies,
} from '../../Stores/Modules/CFD/Helpers/cfd-config';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { CFD_PLATFORMS, JURISDICTION, CATEGORY } from '../../Helpers/cfd-config';
import CFDPasswordChange, { TCFDPasswordFormValues } from '../cfd-password-change';

import PasswordModalHeader from './password-modal-header';
import ReviewMessageForMT5 from './review-message-for-mt5';
import IconType from './icon-type';
import CFDPasswordChangeContent from '../cfd-password-change-content';
import CFDPasswordForm from './cfd-password-form';

import '../../sass/cfd.scss';

import { TCFDPasswordModalProps, TOnSubmitPassword } from './cfd-password-modal.types';

const CFDPasswordModal = observer(({ form_error, platform }: TCFDPasswordModalProps) => {
    const { client, traders_hub, ui } = useStore();

    const {
        email,
        account_status,
        landing_companies,
        is_logged_in,
        is_populating_mt5_account_list,
        is_dxtrade_allowed,
        mt5_login_list,
        updateAccountStatus,
        updateMT5Status,
    } = client;
    const { show_eu_related_content, is_eu_user, toggleAccountTransferModal } = traders_hub;
    const { is_mobile, is_mt5_migration_modal_enabled, setMT5MigrationModalEnabled, is_mt5_migration_modal_open } = ui;

    const {
        account_type,
        disableCFDPasswordModal,
        error_message,
        error_type,
        getAccountStatus,
        has_cfd_error,
        is_cfd_success_dialog_enabled,
        is_cfd_password_modal_enabled,
        jurisdiction_selected_shortcode,
        setError,
        setCFDSuccessDialog,
        submitMt5Password,
        submitCFDPassword,
        new_account_response,
        setMigratedMT5Accounts,
        is_mt5_password_changed_modal_visible,
        is_mt5_password_invalid_format_modal_visible,
        setIsMt5PasswordInvalidFormatModalVisible,
        is_sent_email_modal_enabled,
        setSentEmailModalStatus,
    } = useCfdStore();

    const history = useHistory();

    const [is_password_modal_exited, setPasswordModalExited] = React.useState(true);
    const is_bvi = landing_companies?.mt_financial_company?.financial_stp?.shortcode === 'bvi';
    const has_mt5_account = Boolean(mt5_login_list?.length);
    const should_set_trading_password =
        Array.isArray(account_status?.status) &&
        account_status.status.includes(
            platform === CFD_PLATFORMS.MT5 ? 'mt5_password_not_set' : 'dxtrade_password_not_set'
        );
    const is_password_error = error_type === 'PasswordError';
    const is_password_reset = error_type === 'PasswordReset';
    const is_incorrect_mt5_password_format_error =
        error_type === 'InvalidTradingPlatformPasswordFormat' || error_type === 'IncorrectMT5PasswordFormat';

    const { poi_verified_for_bvi_labuan_vanuatu, poi_verified_for_maltainvest, poa_verified, manual_status } =
        getAuthenticationStatusInfo(account_status);

    const [is_selected_mt5_verified, setIsSelectedMT5Verified] = React.useState(false);

    const [new_password_value, setNewPasswordValue] = React.useState('');

    const getVerificationStatus = () => {
        switch (jurisdiction_selected_shortcode) {
            case JURISDICTION.SVG:
                setIsSelectedMT5Verified(true);
                break;
            case JURISDICTION.BVI:
            case JURISDICTION.VANUATU:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu);
                break;
            case JURISDICTION.LABUAN:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu && poa_verified);
                break;
            case JURISDICTION.MALTA_INVEST:
                setIsSelectedMT5Verified(poi_verified_for_maltainvest && poa_verified);
                break;
            default:
        }
    };

    // Usecase: Added this timeout to render the Password Change modal after the password modal is closed.
    // It is to avoid the flickering of the modal.
    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (is_incorrect_mt5_password_format_error) {
            timeout = setTimeout(() => {
                setIsMt5PasswordInvalidFormatModalVisible(true);
            }, 500);
        }

        return () => clearTimeout(timeout);
    }, [is_incorrect_mt5_password_format_error, setIsMt5PasswordInvalidFormatModalVisible]);

    React.useEffect(() => {
        if (is_logged_in) {
            updateMT5Status();
            updateAccountStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        getVerificationStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jurisdiction_selected_shortcode, account_status]);

    const validatePassword = (values: TCFDPasswordFormValues) => {
        const errors: FormikErrors<TCFDPasswordFormValues> = {};
        const max_length = platform === CFD_PLATFORMS.MT5 && should_set_trading_password ? 16 : 25;
        if (
            !validLength(values.password, {
                min: 8,
                max: max_length,
            })
        ) {
            errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: max_length,
            });
        } else if (!validPassword(values.password)) {
            errors.password = getErrorMessages().password();
        } else if (
            platform === CFD_PLATFORMS.MT5 &&
            should_set_trading_password &&
            !validMT5Password(values.password)
        ) {
            errors.password = localize(
                'Please include at least 1 special character such as ( _ @ ? ! / # ) in your password.'
            );
        }
        if (values.password?.toLowerCase() === email.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }
        return errors;
    };

    const closeDialogs = () => {
        setCFDSuccessDialog(false);
        if (is_mt5_migration_modal_enabled) setMT5MigrationModalEnabled(false);
        setMigratedMT5Accounts([]);
        setError(false);
    };

    const closeModal = () => {
        updateMT5Status();
        closeDialogs();
        disableCFDPasswordModal();
    };

    const closeOpenSuccess = () => {
        disableCFDPasswordModal();
        closeDialogs();
        if (account_type.category === CATEGORY.REAL) {
            if (is_eu_user) {
                toggleAccountTransferModal();
            } else {
                sessionStorage.setItem('cfd_transfer_to_login_id', new_account_response.login || '');
                history.push(routes.cashier_acc_transfer);
            }
        }
    };

    const handleForgotPassword = () => {
        closeModal();
        let redirect_to = platform === CFD_PLATFORMS.MT5 ? 1 : 2;

        // if account type is real convert redirect_to from 1 or 2 to 10 or 20
        // and if account type is demo convert redirect_to from 1 or 2 to 11 or 21
        if (account_type.category === CATEGORY.REAL) {
            redirect_to = Number(`${redirect_to}0`);
        } else if (account_type.category === CATEGORY.DEMO) {
            redirect_to = Number(`${redirect_to}1`);
        }

        const password_reset_code =
            platform === CFD_PLATFORMS.MT5
                ? 'trading_platform_mt5_password_reset'
                : 'trading_platform_dxtrade_password_reset';
        WS.verifyEmail(email, password_reset_code, {
            url_parameters: {
                redirect_to,
            },
        });
        setSentEmailModalStatus(true);
    };

    const submitPassword: TOnSubmitPassword = (values, actions) => {
        if (platform === CFD_PLATFORMS.MT5) {
            submitMt5Password(
                {
                    ...values,
                },
                actions
            );
        } else {
            (values as TCFDPasswordFormValues & { platform: string }).platform = platform;
            submitCFDPassword(values, actions);
        }
    };

    const should_show_password =
        is_cfd_password_modal_enabled &&
        !is_cfd_success_dialog_enabled &&
        (!has_cfd_error || is_password_error || is_password_reset);

    const should_show_success_modals = !has_cfd_error && is_cfd_success_dialog_enabled && is_password_modal_exited;

    const should_show_success = should_show_success_modals && !is_mt5_migration_modal_enabled;

    const should_show_migration_success =
        should_show_success_modals &&
        is_mt5_migration_modal_enabled &&
        !is_populating_mt5_account_list &&
        !is_mt5_migration_modal_open;

    const should_show_sent_email_modal = is_sent_email_modal_enabled && is_password_modal_exited;

    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';

    const should_show_password_modal = React.useMemo(() => {
        if (should_show_password) {
            return should_set_trading_password ? true : isDesktop();
        }
        return false;
    }, [should_set_trading_password, should_show_password]);

    const should_show_password_dialog = React.useMemo(() => {
        if (should_show_password) {
            if (!should_set_trading_password) return is_mobile;
        }
        return false;
    }, [is_mobile, should_set_trading_password, should_show_password]);

    const success_modal_submit_label = React.useMemo(() => {
        if (account_type.category === CATEGORY.REAL) {
            if (platform === CFD_PLATFORMS.MT5) {
                return is_eu_user || is_selected_mt5_verified ? localize('Transfer now') : localize('OK');
            }
            return localize('Transfer now');
        }
        return localize('Continue');
    }, [platform, account_type, is_eu_user, is_selected_mt5_verified]);

    const success_modal_cancel_label = React.useMemo(() => {
        if (is_eu_user && account_type.category === 'real' && platform === CFD_PLATFORMS.MT5) {
            return localize('Maybe later');
        }
        return '';
    }, [platform, account_type, is_eu_user]);

    const getSubmitText = () => {
        const { category, type } = account_type;
        if (!category && !type) return '';

        const category_label = category === CATEGORY.REAL ? localize('real') : localize('demo');
        let type_label = '';
        switch (platform) {
            case CFD_PLATFORMS.MT5:
                type_label =
                    getMtCompanies(show_eu_related_content)[category as keyof TMtCompanies][
                        type as keyof TMtCompanies['demo' | 'real']
                    ].short_title;
                break;
            case CFD_PLATFORMS.DXTRADE:
                type_label =
                    getDxCompanies()[category as keyof TDxCompanies][type as keyof TDxCompanies['demo' | 'real']]
                        .short_title;
                break;
            default:
                type_label = '';
                break;
        }

        const accountTypes = () => {
            if (platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER) {
                return '';
            }
            return type_label;
        };

        if (category === CATEGORY.REAL) {
            return (
                <React.Fragment>
                    {platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER ? (
                        <Localize
                            i18n_default_text='Congratulations, you have successfully created your <0/>{{category}} {{platform}} {{type}} account. To start trading, <1 />transfer funds <2 />from your Deriv account into this account.'
                            values={{
                                type: accountTypes(),
                                platform: getCFDPlatformLabel(platform),
                                category: category_label,
                            }}
                            components={[
                                <br key={0} />,
                                platform === CFD_PLATFORMS.CTRADER && <br key={1} />,
                                platform === CFD_PLATFORMS.DXTRADE && <br key={2} />,
                            ]}
                        />
                    ) : (
                        <React.Fragment>
                            <Localize
                                i18n_default_text='Your Deriv MT5 {{type}} account is ready. '
                                values={{
                                    type: accountTypes(),
                                }}
                            />
                            <ReviewMessageForMT5
                                is_selected_mt5_verified={is_selected_mt5_verified}
                                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                                manual_status={manual_status}
                            />
                        </React.Fragment>
                    )}
                </React.Fragment>
            );
        }

        if (platform === CFD_PLATFORMS.MT5) {
            return (
                <Localize
                    i18n_default_text='Your demo {{type}} account is ready.'
                    values={{
                        type: accountTypes(),
                    }}
                />
            );
        }

        return (
            <Localize
                i18n_default_text='Congratulations, you have successfully created your <0/>{{category}} {{platform}} {{type}} account. '
                values={{
                    type: accountTypes(),
                    platform: is_eu_user ? '' : getCFDPlatformLabel(platform),
                    category: category_label,
                }}
                components={[<br key={0} />]}
            />
        );
    };

    const cfd_password_form = (
        <CFDPasswordForm
            is_bvi={is_bvi}
            closeModal={closeModal}
            error_type={error_type}
            error_message={error_type !== 'InvalidTradingPlatformPasswordFormat' ? error_message : ''}
            has_mt5_account={has_mt5_account}
            form_error={form_error}
            should_set_trading_password={should_set_trading_password}
            is_real_financial_stp={is_real_financial_stp}
            validatePassword={validatePassword}
            onForgotPassword={handleForgotPassword}
            submitPassword={submitPassword}
            platform={platform}
            is_dxtrade_allowed={is_dxtrade_allowed}
            onCancel={closeModal}
        />
    );

    const password_modal = (
        <Modal
            className='cfd-password-modal'
            has_close_icon
            is_open={should_show_password_modal}
            toggleModal={closeModal}
            should_header_stick_body
            renderTitle={() => (
                <PasswordModalHeader
                    should_set_trading_password={should_set_trading_password}
                    is_password_reset_error={is_password_reset}
                    platform={platform}
                />
            )}
            onUnmount={() => getAccountStatus(platform)}
            onExited={() => setPasswordModalExited(true)}
            onEntered={() => setPasswordModalExited(false)}
            width={is_mobile ? '32.8rem' : 'auto'}
        >
            {cfd_password_form}
        </Modal>
    );

    const password_dialog = (
        <MobileDialog
            has_full_height
            portal_element_id='modal_root'
            visible={should_show_password_dialog}
            onClose={closeModal}
            wrapper_classname='cfd-password-modal'
        >
            <PasswordModalHeader
                should_set_trading_password={should_set_trading_password}
                has_mt5_account={has_mt5_account}
                is_password_reset_error={is_password_reset}
                platform={platform}
            />

            {cfd_password_form}
        </MobileDialog>
    );

    const is_mt5_password_format_invalid = (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='cfd-password-modal'
                    has_close_icon
                    is_open={is_mt5_password_invalid_format_modal_visible}
                    toggleModal={closeModal}
                    should_header_stick_body
                    title={localize('Deriv MT5 latest password requirements')}
                    width='auto'
                >
                    <CFDPasswordChange
                        error_type={error_type}
                        error_message={error_message}
                        form_error={form_error}
                        should_set_trading_password={should_set_trading_password}
                        setNewPasswordValue={setNewPasswordValue}
                        validatePassword={validatePassword}
                        onForgotPassword={handleForgotPassword}
                        platform={CFD_PLATFORMS.MT5}
                        onCancel={closeModal}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    has_full_height
                    portal_element_id='modal_root'
                    title={localize('Deriv MT5 latest password requirements')}
                    visible={is_mt5_password_invalid_format_modal_visible}
                    onClose={closeModal}
                    wrapper_classname='cfd-password-modal'
                >
                    <CFDPasswordChange
                        error_type={error_type}
                        error_message={error_message}
                        form_error={form_error}
                        should_set_trading_password={should_set_trading_password}
                        setNewPasswordValue={setNewPasswordValue}
                        validatePassword={validatePassword}
                        onForgotPassword={handleForgotPassword}
                        platform={CFD_PLATFORMS.MT5}
                        onCancel={closeModal}
                    />
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            {password_modal}
            {password_dialog}
            <SuccessDialog
                is_open={should_show_success}
                toggleModal={closeModal}
                onCancel={closeModal}
                onSubmit={
                    !is_eu_user && platform === CFD_PLATFORMS.MT5 && !is_selected_mt5_verified
                        ? closeModal
                        : closeOpenSuccess
                }
                classNameMessage='cfd-password-modal__message'
                message={getSubmitText()}
                icon={
                    <IconType
                        platform={platform}
                        type={account_type.type}
                        show_eu_related_content={show_eu_related_content}
                    />
                }
                icon_size='xlarge'
                text_submit={success_modal_submit_label}
                text_cancel={success_modal_cancel_label}
                has_cancel={
                    platform === CFD_PLATFORMS.MT5
                        ? (is_eu_user || is_selected_mt5_verified) && account_type.category === CATEGORY.REAL
                        : account_type.category === CATEGORY.REAL
                }
                has_close_icon={false}
                width={is_mobile ? '32.8rem' : 'auto'}
                is_medium_button={is_mobile}
            />
            <MigrationSuccessModal is_open={should_show_migration_success} closeModal={closeModal} />
            <SentEmailModal
                is_open={should_show_sent_email_modal}
                identifier_title='trading_password'
                onClose={() => setSentEmailModalStatus(false)}
                onClickSendEmail={handleForgotPassword}
            />
            {is_incorrect_mt5_password_format_error && is_mt5_password_format_invalid}
            {is_mt5_password_changed_modal_visible && (
                <CFDPasswordChangeContent closeModal={closeModal} password_value={new_password_value} />
            )}
        </React.Fragment>
    );
});

export default CFDPasswordModal;
