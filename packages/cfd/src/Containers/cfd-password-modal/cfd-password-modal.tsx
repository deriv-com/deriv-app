import React from 'react';
import { useHistory } from 'react-router';
import { FormikErrors, FormikHelpers } from 'formik';
import { SentEmailModal } from '@deriv/account';
import { MobileDialog, Modal, WalletCFDSuccessDialog } from '@deriv/components';
import {
    CFD_PLATFORMS,
    getAuthenticationStatusInfo,
    getErrorMessages,
    isDesktop,
    isMobile,
    Jurisdiction,
    routes,
    validLength,
    validPassword,
    WS,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { getMtCompanies, TMtCompanies } from '../../Stores/Modules/CFD/Helpers/cfd-config';
import { useActiveWallet, useFeatureFlags } from '@deriv/hooks';
import CFDPasswordForm from './cfd-password-form/cfd-password-form';
import PasswordModalHeader from './modal-elements/password-modal-header';
import {
    useCreateMT5Account,
    useCreateOtherCFDAccount,
    useMT5LoginList,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api';
import PasswordModalMessage from './modal-elements/password-modal-message';
import SuccessModalIcons from './modal-elements/success-modal-icons';
import SuccessDialog from '../../Components/success-dialog.jsx';
import '../../sass/cfd.scss';

export type TCFDPasswordFormValues = { password: string };

export type TOnSubmitPassword = (
    values: TCFDPasswordFormValues,
    actions: FormikHelpers<TCFDPasswordFormValues>
) => void;

export type TCFDPasswordFormReusedProps = {
    platform: string;
    error_message: string;
    validatePassword: (values: TCFDPasswordFormValues) => FormikErrors<TCFDPasswordFormValues>;
};

type TCFDPasswordModalProps = {
    error_type?: string;
    form_error?: string;
    platform: string;
};

const CFDPasswordModal = observer(({ form_error, platform }: TCFDPasswordModalProps) => {
    const { client, traders_hub } = useStore();

    const { account_status, email, is_dxtrade_allowed, is_logged_in, landing_companies, updateAccountStatus } = client;
    const { show_eu_related_content } = traders_hub;

    const {
        account_title,
        account_type,
        disableCFDPasswordModal,
        getAccountStatus,
        is_cfd_password_modal_enabled,
        is_cfd_success_dialog_enabled,
        jurisdiction_selected_shortcode,
        new_account_response,
        setCFDSuccessDialog,
    } = useCfdStore();

    const history = useHistory();
    const { data: mt5_login_list } = useMT5LoginList();
    const { data: settings_data } = useSettings();
    const { is_wallet_enabled } = useFeatureFlags();
    const { mutate: changePlatformPassword } = useTradingPlatformPasswordChange();
    const { mutate: createMT5Account, data: newly_created_mt5_account, error } = useCreateMT5Account();
    const { mutate: createOtherCFDAccount, data: newly_created_cfd_account } = useCreateOtherCFDAccount();
    const active_wallet = useActiveWallet();

    const [is_password_modal_exited, setPasswordModalExited] = React.useState(true);
    const is_bvi = landing_companies?.mt_financial_company?.financial_stp?.shortcode === 'bvi';
    const has_mt5_account = React.useMemo(() => {
        return Boolean(mt5_login_list?.length);
    }, [mt5_login_list]);

    const should_set_trading_password =
        Array.isArray(account_status?.status) &&
        account_status.status.includes(
            platform === CFD_PLATFORMS.MT5 ? 'mt5_password_not_set' : 'dxtrade_password_not_set'
        );
    const has_cfd_error = !!error;
    const error_type = error && error.code;
    const error_message = error && error.message;
    const is_password_error = !!error && error.code === 'PasswordError';
    const is_password_reset = !!error && error.code === 'PasswordReset';
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    let market_type_account: 'all' | 'financial' | 'gaming' | 'demo';
    if (account_type.category === 'real') {
        switch (account_type.type) {
            case 'synthetic':
                market_type_account = 'gaming';
                break;
            case 'all':
                market_type_account = 'all';
                break;
            case 'financial':
                market_type_account = 'financial';
                break;
            default:
                market_type_account = 'demo';
                break;
        }
    } else market_type_account = 'demo';

    const { country_code, first_name, last_name, email: user_email } = settings_data;
    const name = `${first_name} ${last_name}`;
    const leverage =
        account_type.type &&
        account_type.category &&
        getMtCompanies(show_eu_related_content)[account_type.category as keyof TMtCompanies][
            account_type.type as keyof TMtCompanies['demo' | 'real']
        ].leverage;

    const { poi_verified_for_bvi_labuan_vanuatu, poi_verified_for_maltainvest, poa_verified, manual_status } =
        getAuthenticationStatusInfo(account_status);

    const [is_selected_mt5_verified, setIsSelectedMT5Verified] = React.useState(false);

    const getVerificationStatus = () => {
        switch (jurisdiction_selected_shortcode) {
            case Jurisdiction.SVG:
                setIsSelectedMT5Verified(true);
                break;
            case Jurisdiction.BVI:
            case Jurisdiction.VANUATU:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu);
                break;
            case Jurisdiction.LABUAN:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu && poa_verified);
                break;
            case Jurisdiction.MALTA_INVEST:
                setIsSelectedMT5Verified(poi_verified_for_maltainvest && poa_verified);
                break;
            default:
        }
    };

    React.useEffect(() => {
        if (is_logged_in) {
            updateAccountStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        getVerificationStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jurisdiction_selected_shortcode, account_status]);

    const submitPassword: TOnSubmitPassword = async (values, actions) => {
        if (platform === CFD_PLATFORMS.MT5) {
            if (has_mt5_account) {
                createMT5Account({
                    payload: {
                        account_type: market_type_account,
                        email: user_email,
                        leverage,
                        mainPassword: values.password,
                        name,
                        country: country_code,
                        ...(account_type.type === 'financial' && { mt5_account_type: 'financial' }),
                        ...(account_type.type === 'all' && { sub_account_category: 'swap_free' }),
                    },
                });
            } else {
                changePlatformPassword({
                    new_password: values.password,
                    platform,
                });
                createMT5Account({
                    payload: {
                        account_type: market_type_account,
                        country: country_code,
                        email: user_email,
                        leverage,
                        mainPassword: values.password,
                        name,
                        ...(account_type.type === 'financial' && { mt5_account_type: 'financial' }),
                        ...(account_type.type === 'all' && { sub_account_category: 'swap_free' }),
                    },
                });
            }
        } else {
            createOtherCFDAccount({
                payload: {
                    account_type: account_type.category,
                    password: values.password,
                    platform,
                    market_type: 'all',
                },
            });
        }

        if (!has_cfd_error) {
            actions.setStatus({ success: true });
            actions.setSubmitting(false);
            setCFDSuccessDialog(true);
            await getAccountStatus(CFD_PLATFORMS.MT5);
        } else {
            await getAccountStatus(CFD_PLATFORMS.MT5);
            actions.resetForm({});
            actions.setSubmitting(false);
            actions.setStatus({ success: false });
        }
    };

    const validatePassword = (values: TCFDPasswordFormValues) => {
        const errors: FormikErrors<TCFDPasswordFormValues> = {};
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
        if (values.password?.toLowerCase() === email.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }
        return errors;
    };

    const closeDialogs = () => {
        setCFDSuccessDialog(false);
    };

    const closeModal = () => {
        closeDialogs();
        disableCFDPasswordModal();
    };

    const closeOpenSuccess = () => {
        disableCFDPasswordModal();
        closeDialogs();
        if (account_type.category === 'real') {
            sessionStorage.setItem('cfd_transfer_to_login_id', new_account_response.login || '');
            history.push(routes.cashier_acc_transfer);
        }
    };

    const handleForgotPassword = () => {
        closeModal();
        let redirect_to = platform === CFD_PLATFORMS.MT5 ? 1 : 2;

        // if account type is real convert redirect_to from 1 or 2 to 10 or 20
        // and if account type is demo convert redirect_to from 1 or 2 to 11 or 21
        if (account_type.category === 'real') {
            redirect_to = Number(`${redirect_to}0`);
        } else if (account_type.category === 'demo') {
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
        setIsSentEmailModalOpen(true);
    };

    const should_show_password =
        is_cfd_password_modal_enabled &&
        !is_cfd_success_dialog_enabled &&
        (!has_cfd_error || is_password_error || is_password_reset);

    const should_show_success =
        !has_cfd_error &&
        is_cfd_success_dialog_enabled &&
        is_cfd_password_modal_enabled &&
        is_password_modal_exited &&
        (newly_created_mt5_account || newly_created_cfd_account);

    const should_show_sent_email_modal = is_sent_email_modal_open && is_password_modal_exited;

    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';

    const should_show_password_modal = React.useMemo(() => {
        if (should_show_password) {
            return should_set_trading_password ? true : isDesktop();
        }
        return false;
    }, [should_set_trading_password, should_show_password]);

    const should_show_password_dialog = React.useMemo(() => {
        if (should_show_password) {
            if (!should_set_trading_password) return isMobile();
        }
        return false;
    }, [should_set_trading_password, should_show_password]);

    const success_modal_submit_label = React.useMemo(() => {
        if (account_type.category === 'real') {
            if (platform === CFD_PLATFORMS.MT5) {
                return is_selected_mt5_verified ? localize('Transfer now') : localize('OK');
            }
            return localize('Transfer now');
        }
        return localize('Continue');
    }, [platform, account_type, is_selected_mt5_verified]);

    const cfd_password_form = (
        <CFDPasswordForm
            is_bvi={is_bvi}
            account_title={account_title}
            account_type={account_type}
            closeModal={closeModal}
            error_type={error_type}
            error_message={error_message}
            has_mt5_account={has_mt5_account}
            form_error={form_error}
            jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
            should_set_trading_password={should_set_trading_password}
            is_real_financial_stp={is_real_financial_stp}
            validatePassword={validatePassword}
            onForgotPassword={handleForgotPassword}
            submitPassword={submitPassword}
            platform={platform}
            is_dxtrade_allowed={is_dxtrade_allowed}
            onCancel={closeModal}
            show_eu_related_content={show_eu_related_content}
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
            width={isMobile() ? '32.8rem' : 'auto'}
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

    // TODO: Update with other platforms and CFDs
    const getWalletAccountTitle = (type: string) => {
        let account_title = '';
        switch (type) {
            case 'synthetic':
                account_title = 'MT5 Derived';
                break;
            case 'all':
                account_title = localize('MT5 SwapFree');
                break;
            case 'financial':
                account_title = localize('MT5 Financial');
                break;
            default:
                account_title = '';
                break;
        }

        return account_title;
    };

    const getWalletHeader = (account_type: { category: string; type: string }) => {
        return (
            <React.Fragment>
                {account_type.category === 'demo' ? (
                    <Localize
                        i18n_default_text='Your {{account_title}} demo account is ready'
                        values={{
                            account_title: getWalletAccountTitle(account_type.type),
                        }}
                    />
                ) : (
                    <Localize i18n_default_text='Almost there' />
                )}
            </React.Fragment>
        );
    };

    const cfd_details = {
        account_title: getWalletAccountTitle(account_type.type),
        currency: active_wallet?.currency,
        gradient_header_class: active_wallet?.gradient_header_class,
        icon: active_wallet?.icon,
        is_demo: active_wallet?.is_demo,
        type: account_type.type,
        balance: newly_created_mt5_account?.display_balance,
    };

    return (
        <React.Fragment>
            {password_modal}
            {password_dialog}
            {/* TODO: Remove this once development is completed */}
            {is_wallet_enabled && account_type.category === 'demo' && platform === CFD_PLATFORMS.MT5 ? (
                <WalletCFDSuccessDialog
                    header={getWalletHeader(account_type)}
                    is_open={should_show_success}
                    message={
                        <PasswordModalMessage
                            category={account_type.category}
                            is_selected_mt5_verified={is_selected_mt5_verified}
                            jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                            manual_status={manual_status}
                            platform={platform}
                            show_eu_related_content={show_eu_related_content}
                            type={account_type.type}
                            is_wallet_enabled={is_wallet_enabled}
                            wallet_account_title={getWalletAccountTitle(account_type.type)}
                        />
                    }
                    onSubmit={closeModal}
                    submit_button_text={success_modal_submit_label}
                    toggleModal={closeModal}
                    wallet={cfd_details}
                />
            ) : (
                <SuccessDialog
                    is_open={should_show_success}
                    toggleModal={closeModal}
                    onCancel={closeModal}
                    onSubmit={
                        platform === CFD_PLATFORMS.MT5 && !is_selected_mt5_verified ? closeModal : closeOpenSuccess
                    }
                    classNameMessage='cfd-password-modal__message'
                    message={
                        <PasswordModalMessage
                            category={account_type.category}
                            is_selected_mt5_verified={is_selected_mt5_verified}
                            jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                            manual_status={manual_status}
                            platform={platform}
                            show_eu_related_content={show_eu_related_content}
                            type={account_type.type}
                            is_wallet_enabled={is_wallet_enabled}
                            wallet_account_title={getWalletAccountTitle(account_type.type)}
                        />
                    }
                    icon={
                        <SuccessModalIcons
                            platform={platform}
                            type={account_type.type}
                            show_eu_related_content={show_eu_related_content}
                        />
                    }
                    icon_size='xlarge'
                    text_submit={success_modal_submit_label}
                    has_cancel={
                        platform === CFD_PLATFORMS.MT5
                            ? is_selected_mt5_verified && account_type.category === 'real'
                            : account_type.category === 'real'
                    }
                    has_close_icon={false}
                    width={isMobile() ? '32.8rem' : 'auto'}
                    is_medium_button={isMobile()}
                />
            )}
            <SentEmailModal
                is_open={should_show_sent_email_modal}
                identifier_title='trading_password'
                onClose={() => setIsSentEmailModalOpen(false)}
                onClickSendEmail={handleForgotPassword}
            />
        </React.Fragment>
    );
});

export default CFDPasswordModal;
