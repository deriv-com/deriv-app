import React from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { DesktopWrapper, Icon, MobileWrapper, Tabs, PageError, Loading, Text } from '@deriv/components';
import {
    isEmptyObject,
    isMobile,
    routes,
    getCFDPlatformLabel,
    CFD_PLATFORMS,
    isLandingCompanyEnabled,
} from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { ResetTradingPasswordModal } from '@deriv/account';
import { connect } from 'Stores/connect';
import MissingRealAccount from './missing-real-account';
import LoadingCFDRealAccountDisplay from './loading-cfd-real-account-display';
import MT5AccountOpeningRealFinancialStpModal from './mt5-account-opening-real-financial-stp-modal';
import CompareAccountsModal from './compare-accounts-modal';
import CFDDashboardContainer from './cfd-dashboard-container';
import CFDPasswordManagerModal from './cfd-password-manager-modal';
import CFDPasswordModal from './cfd-password-modal';
import CFDServerErrorDialog from './cfd-server-error-dialog';
import CFDTopUpDemoModal from './cfd-top-up-demo-modal';
import CFDResetPasswordModal from './cfd-reset-password-modal';
import { general_messages } from '../Constants/cfd-shared-strings';
import CFDFinancialStpPendingDialog from '../Components/cfd-financial-stp-pending-dialog';
import { CFDDemoAccountDisplay } from '../Components/cfd-demo-account-display';
import { CFDRealAccountDisplay } from '../Components/cfd-real-account-display';
import { getPlatformMt5DownloadLink, getPlatformDXTradeDownloadLink } from '../Helpers/constants';
import 'Sass/app/modules/mt5/cfd-dashboard.scss';
import RootStore from 'Stores/index';
import { DetailsOfEachMT5Loginid, LandingCompany, ResidenceList } from '@deriv/api-types';
import { History } from 'history';

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

type TStandPoint = {
    financial_company: string;
    gaming_company: string;
    iom: boolean;
    malta: boolean;
    maltainvest: boolean;
    svg: boolean;
};

type TCFDDashboardProps = {
    account_settings: { residence: string };
    account_status: object;
    beginRealSignupForMt5: () => void;
    country: string;
    createCFDAccount: (objCFDAccount: { category: string; type: string; set_password?: number }) => void;
    current_list: Array<DetailsOfEachMT5Loginid> & { [key: string]: DetailsOfEachMT5Loginid };
    dxtrade_accounts_list_error: null;
    isAccountOfTypeDisabled: (
        account: Array<DetailsOfEachMT5Loginid> & { [key: string]: DetailsOfEachMT5Loginid }
    ) => boolean;
    is_accounts_switcher_on: boolean;
    is_dark_mode_on: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    is_fully_authenticated: boolean;
    is_loading: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_mt5_allowed: boolean;
    is_dxtrade_allowed: boolean;
    is_pending_authentication: boolean;
    is_virtual: boolean;
    landing_companies: LandingCompany;
    has_malta_account: boolean;
    has_maltainvest_account: boolean;
    has_cfd_account: boolean;
    has_mt5_real_account_error: boolean;
    has_mt5_demo_account_error: boolean;
    has_dxtrade_real_account_error: boolean;
    has_dxtrade_demo_account_error: boolean;
    mt5_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    dxtrade_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    has_real_account: boolean;
    NotificationMessages: ({ ...props }) => JSX.Element;
    platform: 'mt5' | 'dxtrade';
    openAccountNeededModal: () => void;
    residence: string;
    residence_list: ResidenceList;
    standpoint: TStandPoint;
    toggleAccountsDialog: () => void;
    toggleShouldShowRealAccountsList: () => void;
    can_have_more_real_synthetic_mt5: boolean;
    upgradeable_landing_companies: unknown[];
    is_reset_trading_password_modal_visible: boolean;
    toggleResetTradingPasswordModal: () => void;
    enableApp: () => void;
    disableApp: () => void;
    mt5_verification_code: object;
    dxtrade_verification_code: object;
    onMount: () => void;
    onUnmount: () => void;
    location: {
        state: string;
        pathname: string;
        hash: string;
    };
    checkShouldOpenAccount: () => void;
    setCFDPasswordResetModal: (value: boolean) => void;
    disableCFDPasswordModal: () => void;
    openPasswordModal: (account_type?: TOpenAccountTransferMeta) => void;
    openTopUpModal: () => void;
    history: History;
    setCurrentAccount: (data: DetailsOfEachMT5Loginid, meta: TOpenAccountTransferMeta) => void;
    setAccountType: (account_type: TOpenAccountTransferMeta) => void;
};

const CFDDashboard = (props: TCFDDashboardProps) => {
    const [is_demo_enabled, setIsDemoEnabled] = React.useState<boolean>(false);
    const [is_real_enabled, setIsRealEnabled] = React.useState<boolean>(false);
    const [active_index, setActiveIndex] = React.useState<number>(0);
    const [is_demo_tab, setIsDemoTab] = React.useState<boolean>(true);
    const [is_notification_loaded, setIsNotificationLoaded] = React.useState<boolean>(false);
    const [password_manager, setPasswordManager] = React.useState<{
        is_visible: boolean;
        selected_login: string;
        selected_account: string;
        selected_account_type?: string;
        selected_account_group?: string;
        selected_server?: string;
    }>({
        is_visible: false,
        selected_login: '',
        selected_account: '',
        selected_account_type: '',
        selected_account_group: '',
        selected_server: '',
    });

    React.useEffect(() => {
        updateActiveIndex(getIndexToSet());
        openResetPassword();
        props.onMount();
        return () => {
            props.onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        updateActiveIndex();
        props.checkShouldOpenAccount();

        if (props.is_logged_in) {
            ['demo', 'real'].forEach(account_type => {
                const should_enable_tab =
                    isSyntheticCardVisible(account_type) || isFinancialCardVisible() || isFinancialStpCardVisible();

                if (account_type === 'real' && is_real_enabled !== should_enable_tab) {
                    setIsRealEnabled(should_enable_tab);
                }

                if (account_type === 'demo' && is_demo_enabled !== should_enable_tab) {
                    setIsDemoEnabled(should_enable_tab);
                }
            });
        }

        if (!props.is_logged_in && (!is_real_enabled || !is_demo_enabled)) {
            setIsRealEnabled(true);
            setIsDemoEnabled(true);
        }
    });

    const openResetPassword = () => {
        if (!/reset-password/.test(props.location.hash)) {
            return;
        }

        props.setCFDPasswordResetModal(true);
    };

    const getIndexToSet = () => {
        if (is_real_enabled) {
            return 0;
        }
        if (is_demo_enabled) {
            return 1;
        }

        const hash = props.location.hash;
        if (hash) {
            return /demo/.test(props.location.hash) ? 1 : 0;
        }
        return undefined;
    };

    const stopNotificationLoading = () => {
        setIsNotificationLoaded(true);
    };

    const updateActiveIndex = (index?: number) => {
        if (!index) return;
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

    const openAccountTransfer = (data: DetailsOfEachMT5Loginid, meta: { category: string; type?: string }) => {
        if (meta.category === 'real') {
            sessionStorage.setItem('cfd_transfer_to_login_id', data.login as string);
            props.disableCFDPasswordModal();
            props.history.push(routes.cashier_acc_transfer);
        } else {
            props.setCurrentAccount(data, meta);
            props.openTopUpModal();
        }
    };

    const togglePasswordManagerModal = (
        login?: string,
        title?: string,
        group?: string,
        type?: string,
        server?: string
    ) => {
        setPasswordManager(prev_state => ({
            is_visible: !prev_state.is_visible,
            selected_login: typeof login === 'string' ? login : '',
            selected_account: typeof title === 'string' ? title : '',
            selected_account_group: group,
            selected_account_type: type,
            selected_server: server,
        }));
    };

    const openRealPasswordModal = (account_type: TOpenAccountTransferMeta) => {
        props.setAccountType(account_type);
        props.openPasswordModal();
    };

    const isSyntheticCardVisible = (account_category: string) => {
        const { current_list, platform, is_eu, is_eu_country, landing_companies, is_logged_in } = props;
        const has_synthetic_account = Object.keys(current_list).some(key =>
            key.startsWith(`${platform}.${account_category}.synthetic`)
        );

        // Hiding card for logged out EU users
        if (!is_logged_in && is_eu_country) return false;

        if (is_eu && !has_synthetic_account) return false;

        return isLandingCompanyEnabled({ landing_companies, platform, type: 'gaming' }) || !is_logged_in;
    };

    const isFinancialCardVisible = () => {
        const { platform, landing_companies, is_logged_in } = props;

        return (
            !is_logged_in ||
            isLandingCompanyEnabled({
                landing_companies,
                platform,
                type: 'financial',
            })
        );
    };

    const isFinancialStpCardVisible = () => {
        const { platform, landing_companies, is_logged_in, is_eu_country } = props;

        // Hiding card for logged out EU users
        if (!is_logged_in && is_eu_country) return false;

        return (
            (landing_companies?.mt_financial_company?.financial_stp || !is_logged_in) && platform === CFD_PLATFORMS.MT5
        );
    };

    const {
        account_settings,
        account_status,
        beginRealSignupForMt5,
        country,
        createCFDAccount,
        current_list,
        dxtrade_accounts_list_error,
        isAccountOfTypeDisabled,
        is_accounts_switcher_on,
        is_dark_mode_on,
        is_eu,
        is_eu_country,
        is_fully_authenticated,
        is_loading,
        is_logged_in,
        is_logging_in,
        is_mt5_allowed,
        is_dxtrade_allowed,
        is_pending_authentication,
        is_virtual,
        landing_companies,
        has_malta_account,
        has_maltainvest_account,
        has_cfd_account,
        has_mt5_real_account_error,
        has_mt5_demo_account_error,
        has_dxtrade_real_account_error,
        has_dxtrade_demo_account_error,
        mt5_disabled_signup_types,
        dxtrade_disabled_signup_types,
        has_real_account,
        NotificationMessages,
        platform,
        openAccountNeededModal,
        residence,
        residence_list,
        standpoint,
        toggleAccountsDialog,
        toggleShouldShowRealAccountsList,
        can_have_more_real_synthetic_mt5,
        upgradeable_landing_companies,
        is_reset_trading_password_modal_visible,
        toggleResetTradingPasswordModal,
        enableApp,
        disableApp,
        mt5_verification_code,
        dxtrade_verification_code,
    } = props;

    const should_show_missing_real_account =
        !is_eu && is_logged_in && !has_real_account && upgradeable_landing_companies?.length > 0;
    if ((!country && is_logged_in) || is_logging_in) return <Loading />; // Wait for country name to be loaded before rendering

    const has_mt5_account_error = is_demo_tab
        ? has_mt5_demo_account_error || mt5_disabled_signup_types.demo
        : has_mt5_real_account_error || mt5_disabled_signup_types.real;

    const has_dxtrade_account_error = is_demo_tab
        ? has_dxtrade_demo_account_error || dxtrade_disabled_signup_types.demo
        : has_dxtrade_real_account_error || dxtrade_disabled_signup_types.real;

    const has_cfd_account_error =
        platform === CFD_PLATFORMS.MT5
            ? has_mt5_account_error
            : has_dxtrade_account_error || !!dxtrade_accounts_list_error;

    const verification_code = platform === CFD_PLATFORMS.MT5 ? mt5_verification_code : dxtrade_verification_code;

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
                                    lineHeight='l'
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
                                selected_account={password_manager.selected_account}
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
                                    <div label={localize('Real account')} hash='real'>
                                        <React.Fragment>
                                            {should_show_missing_real_account && (
                                                <MissingRealAccount
                                                    onClickSignup={beginRealSignupForMt5}
                                                    platform={platform}
                                                />
                                            )}
                                            <CFDRealAccountDisplay
                                                is_accounts_switcher_on={is_accounts_switcher_on}
                                                is_eu={is_eu}
                                                is_eu_country={is_eu_country}
                                                is_logged_in={is_logged_in}
                                                has_maltainvest_account={has_maltainvest_account}
                                                has_malta_account={has_malta_account}
                                                has_cfd_account_error={
                                                    platform === CFD_PLATFORMS.MT5
                                                        ? mt5_disabled_signup_types.real
                                                        : dxtrade_disabled_signup_types.real ||
                                                          !!dxtrade_accounts_list_error
                                                }
                                                openAccountNeededModal={openAccountNeededModal}
                                                current_list={current_list}
                                                account_status={account_status}
                                                has_cfd_account={has_cfd_account}
                                                onSelectAccount={createCFDAccount}
                                                account_settings={account_settings}
                                                landing_companies={landing_companies}
                                                is_pending_authentication={is_pending_authentication}
                                                is_fully_authenticated={is_fully_authenticated}
                                                is_virtual={is_virtual}
                                                isSyntheticCardVisible={isSyntheticCardVisible}
                                                isFinancialCardVisible={isFinancialCardVisible}
                                                isFinancialStpCardVisible={isFinancialStpCardVisible}
                                                openAccountTransfer={openAccountTransfer}
                                                openPasswordManager={togglePasswordManagerModal}
                                                openPasswordModal={openRealPasswordModal}
                                                platform={platform}
                                                isAccountOfTypeDisabled={isAccountOfTypeDisabled}
                                                has_real_account={has_real_account}
                                                standpoint={standpoint}
                                                toggleAccountsDialog={toggleAccountsDialog}
                                                toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
                                                can_have_more_real_synthetic_mt5={can_have_more_real_synthetic_mt5}
                                                residence={residence}
                                                residence_list={residence_list}
                                            />
                                        </React.Fragment>
                                    </div>
                                )}
                                {is_demo_enabled && (
                                    <div label={localize('Demo account')} hash='demo'>
                                        <CFDDemoAccountDisplay
                                            is_eu={is_eu}
                                            is_eu_country={is_eu_country}
                                            is_logged_in={is_logged_in}
                                            has_maltainvest_account={has_maltainvest_account}
                                            has_cfd_account_error={
                                                platform === CFD_PLATFORMS.MT5
                                                    ? mt5_disabled_signup_types.demo
                                                    : dxtrade_disabled_signup_types.demo ||
                                                      !!dxtrade_accounts_list_error
                                            }
                                            openAccountNeededModal={openAccountNeededModal}
                                            standpoint={standpoint}
                                            is_loading={is_loading}
                                            isSyntheticCardVisible={isSyntheticCardVisible}
                                            isFinancialCardVisible={isFinancialCardVisible}
                                            isFinancialStpCardVisible={isFinancialStpCardVisible}
                                            has_cfd_account={has_cfd_account}
                                            current_list={current_list}
                                            onSelectAccount={createCFDAccount}
                                            landing_companies={landing_companies}
                                            openAccountTransfer={openAccountTransfer}
                                            openPasswordManager={togglePasswordManagerModal}
                                            platform={platform}
                                            residence={residence}
                                        />
                                    </div>
                                )}
                            </LoadTab>
                            <CompareAccountsModal platform={platform} />
                            <div className='cfd-dashboard__maintenance'>
                                <Icon
                                    icon='IcAlertWarning'
                                    size={isMobile() ? 28 : 16}
                                    className='cfd-dashboard__maintenance-icon'
                                />
                                <div className='cfd-dashboard__maintenance-text'>
                                    {platform === CFD_PLATFORMS.DXTRADE && (
                                        <Localize i18n_default_text='Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. Service may be disrupted during this time.' />
                                    )}
                                    {platform === CFD_PLATFORMS.MT5 && (
                                        <Localize i18n_default_text='Server maintenance starting 01:00 GMT every Sunday. This process may take up to 2 hours to complete. Service may be disrupted during this time.' />
                                    )}
                                </div>
                            </div>
                        </div>
                        <DesktopWrapper>
                            <CFDDashboardContainer
                                platform={platform}
                                active_index={active_index}
                                is_dark_mode_on={is_dark_mode_on}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <div className='cfd-dashboard__download-center'>
                                <h1 className='cfd-dashboard__download-center--heading'>
                                    {platform === CFD_PLATFORMS.MT5 && (
                                        <Localize i18n_default_text='Download the MT5 app' />
                                    )}
                                    {platform === CFD_PLATFORMS.DXTRADE && (
                                        <Localize i18n_default_text='Download the Deriv X app' />
                                    )}
                                </h1>
                                <div className='cfd-dashboard__download-center-options--mobile'>
                                    <div className='cfd-dashboard__download-center-options--mobile-devices'>
                                        {platform === CFD_PLATFORMS.MT5 && (
                                            <React.Fragment>
                                                <Icon icon='IcMt5DeviceTablet' width={133} height={106} />
                                                <Icon icon='IcMt5DevicePhone' width={48} height={74} />
                                            </React.Fragment>
                                        )}
                                        {platform === CFD_PLATFORMS.DXTRADE && (
                                            <React.Fragment>
                                                <Icon icon='IcDxtradeDeviceTablet' width={133} height={106} />
                                                <Icon icon='IcDxtradeDevicePhone' width={48} height={74} />
                                            </React.Fragment>
                                        )}
                                    </div>
                                    <div className='cfd-dashboard__download-center-options--mobile-links'>
                                        <a
                                            href={
                                                platform === CFD_PLATFORMS.MT5
                                                    ? getPlatformMt5DownloadLink('android')
                                                    : getPlatformDXTradeDownloadLink('android')
                                            }
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            <Icon icon='IcInstallationGoogle' width={135} height={40} />
                                        </a>
                                        <a
                                            href={
                                                platform === CFD_PLATFORMS.MT5
                                                    ? getPlatformMt5DownloadLink('ios')
                                                    : getPlatformDXTradeDownloadLink('ios')
                                            }
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            <Icon icon='IcInstallationApple' width={135} height={40} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </MobileWrapper>
                        <CFDTopUpDemoModal platform={platform} />
                        <CFDPasswordModal platform={platform} has_suspended_account={has_cfd_account_error} />
                        <CFDServerErrorDialog />
                        {platform === CFD_PLATFORMS.MT5 && (
                            <React.Fragment>
                                <MT5AccountOpeningRealFinancialStpModal />
                                <CFDFinancialStpPendingDialog />
                            </React.Fragment>
                        )}
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
                            i18n_default_text='DMT5 is not available in {{country}}'
                            values={{ country: account_settings.residence }}
                            components={[<br key={0} />]}
                        />
                    }
                    messages={[<Localize key={0} i18n_default_text='Please explore our other platforms.' />]}
                    redirect_urls={[routes.trade, routes.bot]}
                    redirect_labels={[
                        <Localize key={0} i18n_default_text='Explore DTrader' />,
                        <Localize key={1} i18n_default_text='Explore DBot' />,
                    ]}
                />
            )}
        </React.Fragment>
    );
};

export default withRouter(
    connect(({ client, modules, ui }: RootStore) => ({
        beginRealSignupForMt5: modules.cfd.beginRealSignupForMt5,
        checkShouldOpenAccount: modules.cfd.checkShouldOpenAccount,
        country: client.account_settings.residence,
        client_email: client.email_address,
        createCFDAccount: modules.cfd.createCFDAccount,
        current_list: modules.cfd.current_list,
        landing_companies: client.landing_companies,
        isAccountOfTypeDisabled: client.isAccountOfTypeDisabled,
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        is_eu: client.is_eu,
        is_eu_country: client.is_eu_country,
        is_virtual: client.is_virtual,
        is_mt5_allowed: client.is_mt5_allowed,
        is_dxtrade_allowed: client.is_dxtrade_allowed,
        mt5_disabled_signup_types: client.mt5_disabled_signup_types,
        dxtrade_disabled_signup_types: client.dxtrade_disabled_signup_types,
        has_maltainvest_account: client.has_maltainvest_account,
        has_malta_account: client.has_malta_account,
        can_upgrade_to: client.can_upgrade_to,
        account_settings: client.account_settings,
        disableCFDPasswordModal: modules.cfd.disableCFDPasswordModal,
        dxtrade_accounts_list_error: client.dxtrade_accounts_list_error,
        is_pending_authentication: client.is_pending_authentication,
        is_compare_accounts_visible: modules.cfd.is_compare_accounts_visible,
        is_fully_authenticated: client.is_fully_authenticated,
        openPasswordModal: modules.cfd.enableCFDPasswordModal,
        openAccountNeededModal: ui.openAccountNeededModal,
        is_loading: client.is_populating_mt5_account_list,
        residence: client.residence,
        residence_list: client.residence_list,
        has_cfd_account: modules.cfd.has_cfd_account,
        has_mt5_real_account_error: client.has_account_error_in_mt5_real_list,
        has_mt5_demo_account_error: client.has_account_error_in_mt5_demo_list,
        has_dxtrade_real_account_error: client.has_account_error_in_dxtrade_real_list,
        has_dxtrade_demo_account_error: client.has_account_error_in_dxtrade_demo_list,
        has_real_account: client.has_active_real_account,
        setAccountType: modules.cfd.setAccountType,
        setCFDPasswordResetModal: modules.cfd.setCFDPasswordResetModal,
        setCurrentAccount: modules.cfd.setCurrentAccount,
        standpoint: client.standpoint,
        toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
        is_accounts_switcher_on: ui.is_accounts_switcher_on,
        openTopUpModal: ui.openTopUpModal,
        NotificationMessages: ui.notification_messages_ui,
        onMount: modules.cfd.onMount,
        onUnmount: modules.cfd.onUnmount,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        toggleShouldShowRealAccountsList: ui.toggleShouldShowRealAccountsList,
        can_have_more_real_synthetic_mt5: client.can_have_more_real_synthetic_mt5,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
        is_dark_mode_on: ui.is_dark_mode_on,
        disableApp: ui.disableApp,
        enableApp: ui.enableApp,
        is_reset_trading_password_modal_visible: ui.is_reset_trading_password_modal_visible,
        toggleResetTradingPasswordModal: ui.setResetTradingPasswordModalOpen,
        mt5_verification_code: client.verification_code.trading_platform_mt5_password_reset,
        dxtrade_verification_code: client.verification_code.trading_platform_dxtrade_password_reset,
    }))(CFDDashboard)
);
