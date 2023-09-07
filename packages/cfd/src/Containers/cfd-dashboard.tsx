import React from 'react';
import { RouteComponentProps, useLocation } from 'react-router';
import { Redirect, useHistory } from 'react-router-dom';
import { Icon, Tabs, PageError, Loading, Text } from '@deriv/components';
import {
    isEmptyObject,
    isMobile,
    routes,
    getCFDPlatformLabel,
    getPlatformSettings,
    CFD_PLATFORMS,
    isLandingCompanyEnabled,
} from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { ResetTradingPasswordModal } from '@deriv/account';
import MissingRealAccount from './missing-real-account';
import LoadingCFDRealAccountDisplay from './loading-cfd-real-account-display';
import CompareAccountsModal from './compare-accounts-modal';
import JurisdictionModal from './jurisdiction-modal/jurisdiction-modal';
import MT5TradeModal from './mt5-trade-modal';
import CFDDbviOnboarding from './cfd-dbvi-onboarding';
import CFDDownloadContainer from '../Components/cfd-download-container';
import CFDPasswordManagerModal from './cfd-password-manager-modal';
import CFDPasswordModal from './cfd-password-modal';
import CFDServerErrorDialog from './cfd-server-error-dialog';
import CFDTopUpDemoModal from './cfd-top-up-demo-modal';
import CFDResetPasswordModal from './cfd-reset-password-modal';
import { general_messages } from '../Constants/cfd-shared-strings';
import SwitchToRealAccountModal from './switch-to-real-account';
import 'Sass/cfd-dashboard.scss';
import { LandingCompany, DetailsOfEachMT5Loginid } from '@deriv/api-types';
// TODO: Change these imports after real released
import CFDDxtradeDemoAccountDisplay from '../Components/cfd-dxtrade-demo-account-display';
import CFDMT5DemoAccountDisplay from '../Components/cfd-mt5-demo-account-display';
import { CFDRealAccountDisplay } from '../Components/cfd-real-account-display';
import { observer, useStore } from '@deriv/stores';
import { TCFDPasswordReset } from './props.types';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import { TTradingPlatformAccounts } from 'Components/props.types';

declare module 'react' {
    interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
        label?: string;
        hash?: string;
    }
}

type TLoadTab = {
    children: React.ReactNode;
    is_loading: boolean;
    loading_component: () => JSX.Element;
    active_index: number;
    top: boolean;
    center: boolean;
    is_logged_in: boolean;
    onTabItemClick: (index: number) => void;
    should_update_hash: boolean;
    landing_companies?: LandingCompany;
};

const LoadTab = ({ children, is_loading, loading_component, ...props }: TLoadTab) => {
    const LoadingComponent = loading_component;
    if (is_loading) {
        return <LoadingComponent />;
    }

    return <Tabs {...props}>{children}</Tabs>;
};

type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

type TMt5StatusServerType = {
    all: number;
    platform: number;
    server_number: number;
    deposits?: number;
    withdrawals?: number;
};

type TMt5StatusServer = Record<'demo' | 'real', TMt5StatusServerType[]>;

export type TObjectCFDAccount = { category: string; type: string; set_password?: number; platform?: string };

export type TCFDDashboardProps = RouteComponentProps & {
    account_status: object;
    // TODO: update this type (DetailsOfEachMT5Loginid) when BE changed the schema
    platform: 'mt5' | 'dxtrade';
};

type TPasswordManager = {
    is_visible: boolean;
    selected_login: string;
    selected_account: string;
    selected_account_type: string;
    selected_account_group: TCFDPasswordReset['account_group'];
    selected_server: string;
};

const CFDDashboard = observer((props: TCFDDashboardProps) => {
    const { client, ui, traders_hub, notifications } = useStore();

    const {
        landing_companies,
        isAccountOfTypeDisabled,
        is_logged_in,
        is_logging_in,
        is_eu,
        is_eu_country,
        is_virtual,
        is_mt5_allowed,
        is_dxtrade_allowed,
        mt5_disabled_signup_types,
        dxtrade_disabled_signup_types,
        has_maltainvest_account,
        dxtrade_accounts_list_error,
        residence,
        is_populating_mt5_account_list: is_loading,
        has_account_error_in_mt5_real_list: has_mt5_real_account_error,
        has_account_error_in_mt5_demo_list: has_mt5_demo_account_error,
        has_account_error_in_dxtrade_real_list: has_dxtrade_real_account_error,
        has_account_error_in_dxtrade_demo_list: has_dxtrade_demo_account_error,
        has_active_real_account: has_real_account,
        standpoint,
        verification_code: platform_verification_code,
        website_status,
        upgradeable_landing_companies,
        real_account_creation_unlock_date,
        account_settings,
    } = client;

    const {
        trading_platform_mt5_password_reset: mt5_verification_code,
        trading_platform_dxtrade_password_reset: dxtrade_verification_code,
    } = platform_verification_code;
    const { mt5_status: mt5_status_server, dx_trade_status: dxtrade_status_server } = website_status;
    const { dxtrade_user_exception: is_user_exception, residence: country } = account_settings;

    const {
        setCFDPasswordResetModal,
        openAccountNeededModal,
        is_accounts_switcher_on,
        openTopUpModal,
        notification_messages_ui: NotificationMessages,
        toggleAccountsDialog,
        toggleShouldShowRealAccountsList,
        is_dark_mode_on,
        disableApp,
        enableApp,
        is_reset_trading_password_modal_visible,
        setResetTradingPasswordModalOpen: toggleResetTradingPasswordModal,
        openDerivRealAccountNeededModal,
        setShouldShowCooldownModal,
    } = ui;
    const { show_eu_related_content } = traders_hub;
    const { refreshNotifications } = notifications;

    const {
        onMount,
        onUnmount,
        setAccountType,
        setCurrentAccount,
        enableCFDPasswordModal,
        getRealSyntheticAccountsExistingData,
        getRealFinancialAccountsExistingData,
        toggleMT5TradeModal,
        beginRealSignupForMt5,
        disableCFDPasswordModal,
        checkShouldOpenAccount,
        is_mt5_trade_modal_visible,
        createCFDAccount,
        current_list,
        dxtrade_tokens,
        derivez_tokens,
    } = useCfdStore();

    const [is_demo_enabled, setIsDemoEnabled] = React.useState<boolean>(false);
    const [is_real_enabled, setIsRealEnabled] = React.useState<boolean>(false);
    const [active_index, setActiveIndex] = React.useState<number>(0);
    const [is_demo_tab, setIsDemoTab] = React.useState<boolean>(false);
    const [is_notification_loaded, setIsNotificationLoaded] = React.useState<boolean>(false);
    const [password_manager, setPasswordManager] = React.useState<TPasswordManager>({
        is_visible: false,
        selected_login: '',
        selected_account: '',
        selected_account_type: '',
        selected_account_group: '',
        selected_server: '',
    });

    const history = useHistory();
    const location = useLocation();

    React.useEffect(() => {
        if (window.location.href.includes(routes.mt5) || window.location.href.includes(routes.dxtrade)) {
            history.push(routes.traders_hub);
        }
    }, [history]);

    React.useEffect(() => {
        updateActiveIndex(getIndexToSet());
        openResetPassword();
        refreshNotifications();
        onMount();
        return () => {
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        checkShouldOpenAccount();

        if (is_logged_in) {
            ['demo', 'real'].forEach(account_type => {
                const should_enable_tab =
                    isDxtradeAllCardVisible(account_type) ||
                    isSyntheticCardVisible(account_type) ||
                    isFinancialCardVisible();

                if (account_type === 'real' && is_real_enabled !== should_enable_tab) {
                    setIsRealEnabled(should_enable_tab);
                }

                if (account_type === 'demo' && is_demo_enabled !== should_enable_tab) {
                    setIsDemoEnabled(should_enable_tab);
                }
            });
        }

        if (!is_logged_in && (!is_real_enabled || !is_demo_enabled)) {
            setIsRealEnabled(true);
            setIsDemoEnabled(true);
        }
        if (props.location.hash === '#demo') {
            setIsDemoEnabled(true);
            setActiveIndex(1);
        }
    });

    React.useEffect(() => {
        if (props.location.hash === '#real') {
            setActiveIndex(0);
        }
        if (props.location.hash === '#demo-all' || props.location.hash === '#demo') {
            setActiveIndex(1);
        }
    }, [props.location.hash]);

    const openResetPassword = () => {
        if (!/reset-password/.test(location.hash)) {
            return;
        }

        setCFDPasswordResetModal(true);
    };

    const getIndexToSet = () => {
        if (is_real_enabled) {
            return 0;
        }
        if (is_demo_enabled) {
            return 1;
        }

        const hash = location.hash;
        if (hash) {
            return /demo/.test(location.hash) ? 1 : 0;
        }
        return undefined;
    };

    const stopNotificationLoading = () => {
        setIsNotificationLoaded(true);
    };

    const updateActiveIndex = (index?: number) => {
        if (index === undefined) return;
        const updated_state: { is_demo_tab?: boolean; active_index?: number } = {};
        // updateActiveIndex is called in componentDidUpdate causing tab_index to always revert back to 0
        if (index === 1) updated_state.is_demo_tab = true;
        else if (index === 0) updated_state.is_demo_tab = false;

        if (active_index !== index) {
            updated_state.active_index = index;
        }

        if (!isEmptyObject(updated_state)) {
            setActiveIndex(updated_state.active_index as number);
            setIsDemoTab(updated_state.is_demo_tab as boolean);
        }
    };

    const openAccountTransfer = (
        data: DetailsOfEachMT5Loginid | TTradingPlatformAccounts,
        meta: TOpenAccountTransferMeta
    ) => {
        if (meta.category === 'real') {
            if (data) {
                if ('platform' in data && data.platform === CFD_PLATFORMS.DXTRADE)
                    sessionStorage.setItem('cfd_transfer_to_login_id', data.account_id || '');
                else sessionStorage.setItem('cfd_transfer_to_login_id', data.login || '');

                disableCFDPasswordModal();
                history.push(routes.cashier_acc_transfer);
            }
        } else {
            if ('sub_account_type' in data) setCurrentAccount(data, meta);
            openTopUpModal();
        }
    };

    const togglePasswordManagerModal = (
        login?: string,
        title?: string,
        group?: TCFDPasswordReset['account_group'],
        type?: string,
        server?: string
    ) => {
        setPasswordManager(prev_state => ({
            is_visible: !prev_state.is_visible,
            selected_login: typeof login === 'string' ? login : '',
            selected_account: typeof title === 'string' ? title : '',
            selected_account_group: group || '',
            selected_account_type: type || '',
            selected_server: server || '',
        }));
    };

    const openRealPasswordModal = (account_type: TOpenAccountTransferMeta) => {
        setAccountType(account_type);
        enableCFDPasswordModal();
    };

    const hasAccount = (category: string, type: string) => {
        return Object.keys(current_list).some(key => key.startsWith(`${platform}.${category}.${type}`));
    };

    const isDxtradeAllCardVisible = (account_category: string) => {
        const { platform } = props;

        const has_synthetic_account = hasAccount(account_category, 'synthetic');
        const has_financial_account = hasAccount(account_category, 'financial');

        if (has_synthetic_account || has_financial_account) return false;

        if (is_dxtrade_allowed && !is_logged_in) return true;

        return isLandingCompanyEnabled({
            landing_companies,
            platform,
            type: 'all',
        });
    };

    const isSyntheticCardVisible = (account_category: string) => {
        const { platform } = props;
        const has_synthetic_account = hasAccount(account_category, 'synthetic');
        const has_financial_account = hasAccount(account_category, 'financial');

        // Hiding card for logged out EU users
        if (!is_logged_in && is_eu_country) return false;

        if (is_eu && !has_synthetic_account && platform === CFD_PLATFORMS.DXTRADE) return false;

        if (!has_synthetic_account && !has_financial_account && platform === CFD_PLATFORMS.DXTRADE) return false;

        return isLandingCompanyEnabled({ landing_companies, platform, type: 'gaming' }) || !is_logged_in;
    };

    const isFinancialCardVisible = () => {
        const { platform } = props;

        const has_synthetic_account = hasAccount('real', 'synthetic');
        const has_financial_account = hasAccount('real', 'financial');

        if (!has_synthetic_account && !has_financial_account && platform === CFD_PLATFORMS.DXTRADE) return false;

        return (
            !is_logged_in ||
            isLandingCompanyEnabled({
                landing_companies,
                platform,
                type: 'financial',
            })
        );
    };

    const { account_status, platform } = props;

    const isSwapFreeCardVisible = () => {
        return (
            !is_logged_in ||
            isLandingCompanyEnabled({
                landing_companies,
                platform,
                type: 'all',
            })
        );
    };

    const should_show_missing_real_account =
        is_logged_in && !has_real_account && upgradeable_landing_companies?.length > 0;
    const should_enable_add_button = should_show_missing_real_account && CFD_PLATFORMS.MT5 && is_real_enabled;

    if ((!country && is_logged_in) || is_logging_in) return <Loading />; // Wait for country name to be loaded before rendering

    // all: 1 in mt5_status response means that server is suspended
    const getIsSuspendedMt5Server = (type_server: TMt5StatusServer['demo' | 'real']) =>
        type_server?.map((item: TMt5StatusServerType) => item.all).some((item: number) => item === 1);

    const is_suspended_mt5_demo_server = getIsSuspendedMt5Server(mt5_status_server?.demo);
    const is_suspended_mt5_real_server = getIsSuspendedMt5Server(mt5_status_server?.real);
    const is_suspended_dxtrade_demo_server = !!dxtrade_status_server?.demo;
    const is_suspended_dxtrade_real_server = !!dxtrade_status_server?.real;

    const has_mt5_account_error = is_demo_tab
        ? is_suspended_mt5_demo_server || has_mt5_demo_account_error || mt5_disabled_signup_types.demo
        : is_suspended_mt5_real_server || has_mt5_real_account_error || mt5_disabled_signup_types.real;

    const has_dxtrade_account_error = is_demo_tab
        ? is_suspended_dxtrade_demo_server || has_dxtrade_demo_account_error || dxtrade_disabled_signup_types.demo
        : is_suspended_dxtrade_real_server || has_dxtrade_real_account_error || dxtrade_disabled_signup_types.real;

    // eslint-disable-next-line no-nested-ternary
    const has_cfd_account_error = is_user_exception
        ? !is_user_exception
        : platform === CFD_PLATFORMS.MT5
        ? has_mt5_account_error
        : has_dxtrade_account_error || !!dxtrade_accounts_list_error;

    const has_cfd_real_account_dxtrade_error =
        is_suspended_dxtrade_real_server || dxtrade_disabled_signup_types.real || !!dxtrade_accounts_list_error;
    const has_cfd_demo_account_dxtrade_error =
        is_suspended_dxtrade_demo_server || dxtrade_disabled_signup_types.demo || !!dxtrade_accounts_list_error;
    const has_cfd_real_account_mt5_error = is_suspended_mt5_real_server || mt5_disabled_signup_types.real;
    const has_cfd_demo_account_mt5_error = is_suspended_mt5_demo_server || mt5_disabled_signup_types.demo;

    const verification_code = platform === CFD_PLATFORMS.MT5 ? mt5_verification_code : dxtrade_verification_code;

    if (platform === CFD_PLATFORMS.MT5 || platform === CFD_PLATFORMS.DXTRADE)
        return <Redirect to={routes.traders_hub} />;
    if (platform === CFD_PLATFORMS.DXTRADE && !is_dxtrade_allowed) return <Redirect to={routes.mt5} />;

    if ((is_logged_in && !landing_companies) || is_loading) return <Loading />;

    return (
        <React.Fragment>
            {is_mt5_allowed || platform === CFD_PLATFORMS.DXTRADE || !is_logged_in ? (
                <div className='cfd-dashboard__container'>
                    <NotificationMessages
                        is_mt5
                        is_notification_loaded={is_notification_loaded}
                        stopNotificationLoading={stopNotificationLoading}
                    />
                    <div className='cfd-dashboard'>
                        <div className='cfd-dashboard__welcome-message'>
                            <h1 className='cfd-dashboard__welcome-message--heading'>
                                {general_messages.getWelcomeHeader(is_logged_in, platform)}
                            </h1>
                        </div>
                        {is_logged_in && has_cfd_account_error && (
                            <div className='cfd-dashboard__accounts-error'>
                                <Text
                                    as='p'
                                    className='cfd-dashboard__accounts-error-message'
                                    line_height='l'
                                    size='xxs'
                                    color='prominent'
                                    weight='normal'
                                    align='center'
                                >
                                    <Localize
                                        i18n_default_text='Due to an issue on our server, some of your {{platform}} accounts are unavailable at the moment. Please bear with us and thank you for your patience.'
                                        values={{
                                            platform: getCFDPlatformLabel(platform),
                                        }}
                                    />
                                </Text>
                            </div>
                        )}
                        <div className='cfd-dashboard__accounts-display'>
                            <CFDPasswordManagerModal
                                is_visible={password_manager.is_visible}
                                platform={platform}
                                selected_login={password_manager.selected_login}
                                selected_account_group={password_manager.selected_account_group}
                                selected_account_type={password_manager.selected_account_type}
                                selected_server={password_manager.selected_server}
                                toggleModal={togglePasswordManagerModal}
                            />
                            <LoadTab
                                active_index={active_index}
                                top
                                center
                                is_loading={is_loading}
                                is_logged_in={is_logged_in}
                                loading_component={LoadingCFDRealAccountDisplay}
                                onTabItemClick={updateActiveIndex}
                                should_update_hash
                            >
                                {is_real_enabled && (
                                    <div label={localize('Real account')} data-hash='real'>
                                        <React.Fragment>
                                            {should_show_missing_real_account && (
                                                <MissingRealAccount
                                                    onClickSignup={() => {
                                                        if (real_account_creation_unlock_date) {
                                                            setShouldShowCooldownModal(true);
                                                        } else {
                                                            beginRealSignupForMt5();
                                                        }
                                                    }}
                                                    platform={platform}
                                                />
                                            )}
                                            <CFDRealAccountDisplay
                                                is_accounts_switcher_on={is_accounts_switcher_on}
                                                is_eu={is_eu}
                                                is_eu_country={is_eu_country}
                                                is_logged_in={is_logged_in}
                                                has_cfd_account_error={
                                                    // eslint-disable-next-line no-nested-ternary
                                                    platform === CFD_PLATFORMS.MT5
                                                        ? has_cfd_real_account_mt5_error
                                                        : is_user_exception
                                                        ? !is_user_exception
                                                        : has_cfd_real_account_dxtrade_error
                                                }
                                                current_list={current_list}
                                                account_status={account_status}
                                                onSelectAccount={createCFDAccount}
                                                realSyntheticAccountsExistingData={getRealSyntheticAccountsExistingData}
                                                realFinancialAccountsExistingData={getRealFinancialAccountsExistingData}
                                                is_virtual={is_virtual}
                                                isSyntheticCardVisible={isSyntheticCardVisible}
                                                isFinancialCardVisible={isFinancialCardVisible}
                                                isDxtradeAllCardVisible={isDxtradeAllCardVisible}
                                                openAccountTransfer={openAccountTransfer}
                                                openPasswordManager={togglePasswordManagerModal}
                                                platform={platform}
                                                isAccountOfTypeDisabled={isAccountOfTypeDisabled}
                                                has_real_account={has_real_account}
                                                standpoint={standpoint}
                                                toggleAccountsDialog={toggleAccountsDialog}
                                                toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
                                                residence={residence}
                                                openDerivRealAccountNeededModal={openDerivRealAccountNeededModal}
                                                should_enable_add_button={should_enable_add_button}
                                                real_account_creation_unlock_date={real_account_creation_unlock_date}
                                                setShouldShowCooldownModal={setShouldShowCooldownModal}
                                                show_eu_related_content={show_eu_related_content}
                                            />
                                        </React.Fragment>
                                    </div>
                                )}
                                {is_demo_enabled && (
                                    <div label={localize('Demo account')} data-hash='demo'>
                                        {platform === CFD_PLATFORMS.DXTRADE && (
                                            <CFDDxtradeDemoAccountDisplay
                                                is_logged_in={is_logged_in}
                                                has_cfd_account_error={
                                                    is_user_exception
                                                        ? !is_user_exception
                                                        : has_cfd_demo_account_dxtrade_error
                                                }
                                                standpoint={standpoint}
                                                is_loading={is_loading}
                                                current_list={current_list}
                                                onSelectAccount={createCFDAccount}
                                                landing_companies={landing_companies}
                                                openAccountTransfer={openAccountTransfer}
                                                openPasswordManager={togglePasswordManagerModal}
                                                platform={platform}
                                            />
                                        )}
                                        {platform === CFD_PLATFORMS.MT5 && (
                                            <CFDMT5DemoAccountDisplay
                                                is_eu={is_eu}
                                                is_eu_country={is_eu_country}
                                                is_logged_in={is_logged_in}
                                                has_maltainvest_account={has_maltainvest_account}
                                                has_cfd_account_error={has_cfd_demo_account_mt5_error}
                                                openAccountNeededModal={openAccountNeededModal}
                                                standpoint={standpoint}
                                                is_loading={is_loading}
                                                isSyntheticCardVisible={isSyntheticCardVisible}
                                                isFinancialCardVisible={isFinancialCardVisible}
                                                isSwapFreeCardVisible={isSwapFreeCardVisible}
                                                current_list={current_list}
                                                onSelectAccount={createCFDAccount}
                                                landing_companies={landing_companies}
                                                openAccountTransfer={openAccountTransfer}
                                                openPasswordManager={togglePasswordManagerModal}
                                                toggleMT5TradeModal={toggleMT5TradeModal}
                                                platform={platform}
                                                residence={residence}
                                                show_eu_related_content={show_eu_related_content}
                                            />
                                        )}
                                    </div>
                                )}
                            </LoadTab>
                            <CompareAccountsModal
                                platform={platform}
                                is_demo_tab={is_demo_tab}
                                openPasswordModal={openRealPasswordModal}
                                is_real_enabled={is_real_enabled}
                                real_account_creation_unlock_date={real_account_creation_unlock_date}
                                setShouldShowCooldownModal={setShouldShowCooldownModal}
                                has_unmerged_account={
                                    hasAccount('real', 'synthetic') || hasAccount('real', 'financial')
                                }
                            />
                            <SwitchToRealAccountModal />
                            <JurisdictionModal openPasswordModal={openRealPasswordModal} />
                            <MT5TradeModal
                                is_demo=''
                                is_open={is_mt5_trade_modal_visible}
                                onPasswordManager={togglePasswordManagerModal}
                                toggleModal={toggleMT5TradeModal}
                                is_eu_user={(is_logged_in && is_eu) || (!is_logged_in && is_eu_country)}
                            />
                            <div className='cfd-dashboard__maintenance'>
                                <Icon
                                    icon='IcAlertWarning'
                                    size={isMobile() ? 28 : 16}
                                    className='cfd-dashboard__maintenance-icon'
                                />
                                <div className='cfd-dashboard__maintenance-text'>
                                    {platform === CFD_PLATFORMS.DXTRADE && (
                                        <Localize i18n_default_text='Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.' />
                                    )}
                                    {platform === CFD_PLATFORMS.MT5 && (
                                        <Localize i18n_default_text='Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.' />
                                    )}
                                </div>
                            </div>
                        </div>
                        <CFDDownloadContainer
                            platform={platform}
                            active_index={active_index}
                            is_dark_mode_on={is_dark_mode_on}
                            dxtrade_tokens={dxtrade_tokens}
                            derivez_tokens={derivez_tokens}
                        />
                        <CFDTopUpDemoModal platform={platform} />
                        <CFDPasswordModal platform={platform} />
                        <CFDServerErrorDialog />
                        {platform === CFD_PLATFORMS.MT5 && is_logged_in && <CFDDbviOnboarding />}
                        <CFDResetPasswordModal platform={platform} />
                        <ResetTradingPasswordModal
                            platform={platform}
                            enableApp={enableApp}
                            disableApp={disableApp}
                            toggleResetTradingPasswordModal={toggleResetTradingPasswordModal}
                            is_visible={is_reset_trading_password_modal_visible}
                            is_loading={is_loading}
                            verification_code={verification_code}
                        />
                    </div>
                </div>
            ) : (
                <PageError
                    buttonSize={'medium'}
                    header={
                        <Localize
                            i18n_default_text='{{platform_name_mt5}} is not available in {{country}}'
                            values={{
                                country,
                                platform_name_mt5: getPlatformSettings('mt5').name,
                            }}
                            components={[<br key={0} />]}
                        />
                    }
                    messages={[<Localize key={0} i18n_default_text='Please explore our other platforms.' />]}
                    redirect_urls={[routes.trade, routes.bot]}
                    redirect_labels={[
                        <Localize
                            key={0}
                            i18n_default_text='Explore {{platform_name_trader}}'
                            values={{ platform_name_trader: getPlatformSettings('trader').name }}
                        />,
                        <Localize
                            key={1}
                            i18n_default_text='Explore {{platform_name_dbot}}'
                            values={{ platform_name_dbot: getPlatformSettings('dbot').name }}
                        />,
                    ]}
                />
            )}
        </React.Fragment>
    );
});

export default CFDDashboard;
