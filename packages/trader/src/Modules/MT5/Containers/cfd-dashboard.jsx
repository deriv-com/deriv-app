import React from 'react';
import { withRouter } from 'react-router';
import { DesktopWrapper, Icon, MobileWrapper, Tabs, PageError, Loading, Text } from '@deriv/components';
// TODO: [mt5-redesign] replace tabs with radiogroup once card component is ready
// import { DesktopWrapper, Icon, MobileWrapper, RadioGroup } from '@deriv/components';
import { isEmptyObject, isMobile, routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import LoadingCFDRealAccountDisplay from './loading-cfd-real-account-display.jsx';
import MissingRealAccount from './missing-real-account.jsx';
import MT5AccountOpeningRealFinancialStpModal from './mt5-account-opening-real-financial-stp-modal.jsx';
import CompareAccountsModal from './compare-accounts-modal.jsx';
import CFDDashboardContainer from './cfd-dashboard-container.jsx';
import CFDPasswordManagerModal from './cfd-password-manager-modal.jsx';
import CFDPasswordModal from './cfd-password-modal.jsx';
import CFDServerErrorDialog from './cfd-server-error-dialog.jsx';
import CFDTopUpDemoModal from './cfd-top-up-demo-modal.jsx';
import CFDResetPasswordModal from './cfd-reset-password-modal.jsx';
import { general_messages } from '../Constants/cfd-shared-strings';
import CFDFinancialStpPendingDialog from '../Components/cfd-financial-stp-pending-dialog.jsx';
import { CFDInfoCopy } from '../Components/cfd-info-copy.jsx';
import { CFDDemoAccountDisplay } from '../Components/cfd-demo-account-display.jsx';
import { CFDRealAccountDisplay } from '../Components/cfd-real-account-display.jsx';
import { getBrokerName, getServerName, getPlatformMt5DownloadLink } from '../Helpers/constants';
import 'Sass/app/modules/mt5/cfd-dashboard.scss';

const LoadTab = ({ children, is_loading, loading_component, ...props }) => {
    const LoadingComponent = loading_component;
    if (is_loading) {
        return <LoadingComponent />;
    }

    return <Tabs {...props}>{children}</Tabs>;
};

class CFDDashboard extends React.Component {
    state = {
        active_index: 0,
        is_account_needed_modal_open: false,
        is_demo_tab: true,
        required_account: {},
        password_manager: {
            is_visible: false,
            selected_login: '',
            selected_account: '',
            selected_account_type: '',
            selected_account_group: '',
            selected_server: '',
        },
    };

    async componentDidMount() {
        this.updateActiveIndex(this.getIndexToSet());
        this.openResetPassword();
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    componentDidUpdate() {
        this.updateActiveIndex();
        this.props.checkShouldOpenAccount();
    }

    openResetPassword = () => {
        if (!/reset-password/.test(this.props.location.hash)) {
            return;
        }

        this.props.setMt5PasswordResetModal(true);
    };

    getIndexToSet = () => {
        const hash = this.props.location.hash;
        if (hash) {
            return /demo/.test(this.props.location.hash) ? 1 : 0;
        }
        return undefined;
    };

    updateActiveIndex = index => {
        const updated_state = {};
        // updateActiveIndex is called in componentDidUpdate causing tab_index to always revert back to 0
        if (index === 1) updated_state.is_demo_tab = true;
        else if (index === 0) updated_state.is_demo_tab = false;

        const index_to_set = this.getIndexToSet();
        if (this.state.active_index !== index_to_set) {
            updated_state.active_index = index_to_set;
        }

        if (!isEmptyObject(updated_state)) {
            this.setState(updated_state);
        }
    };

    openAccountTransfer = (data, meta) => {
        if (meta.category === 'real') {
            sessionStorage.setItem('mt5_transfer_to_login_id', data.login);
            this.props.disableMt5PasswordModal();
            this.props.history.push(routes.cashier_acc_transfer);
        } else {
            this.props.setCurrentAccount(data, meta);
            this.props.openTopUpModal();
        }
    };

    togglePasswordManagerModal = (login, title, group, type, server) => {
        this.setState(prev_state => ({
            active_index: prev_state.active_index,
            password_manager: {
                is_visible: !prev_state.password_manager.is_visible,
                selected_login: typeof login === 'string' ? login : '',
                selected_account: typeof title === 'string' ? title : '',
                selected_account_group: group,
                selected_account_type: type,
                selected_server: server,
            },
        }));
    };

    openRealPasswordModal = account_type => {
        this.props.setAccountType(account_type);
        this.props.openPasswordModal();
    };

    render() {
        const {
            account_settings,
            account_status,
            beginRealSignupForMt5,
            country,
            createMT5Account,
            current_list,
            isAccountOfTypeDisabled,
            is_accounts_switcher_on,
            is_eu,
            is_eu_country,
            is_fully_authenticated,
            is_loading,
            is_logged_in,
            is_logging_in,
            is_mt5_allowed,
            is_pending_authentication,
            is_virtual,
            landing_companies,
            has_malta_account,
            has_maltainvest_account,
            has_mt5_account,
            has_mt5_account_error,
            mt5_disabled_signup_types,
            has_real_account,
            NotificationMessages,
            platform,
            openAccountNeededModal,
            standpoint,
            toggleAccountsDialog,
            toggleShouldShowRealAccountsList,
            trading_servers,
            can_have_more_real_synthetic_mt5,
            upgradeable_landing_companies,
        } = this.props;

        const should_show_missing_real_account =
            !is_eu && is_logged_in && !has_real_account && upgradeable_landing_companies?.length > 0;
        if ((!country && is_logged_in) || is_logging_in) return <Loading />; // Wait for country name to be loaded before rendering

        return (
            <React.Fragment>
                {is_mt5_allowed || platform === 'dxtrade' || !is_logged_in ? (
                    <div className='cfd-dashboard__container'>
                        <NotificationMessages />
                        <div className='cfd-dashboard'>
                            <div className='cfd-dashboard__welcome-message'>
                                <h1 className='cfd-dashboard__welcome-message--heading'>
                                    {general_messages.getWelcomeHeader(is_logged_in, platform)}
                                </h1>
                            </div>
                            {has_mt5_account_error && (
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
                                        <Localize i18n_default_text='Due to an issue on our server, some of your MT5 accounts are unavailable at the moment. Please bear with us and thank you for your patience.' />
                                    </Text>
                                </div>
                            )}
                            <div className='cfd-dashboard__accounts-display'>
                                <CFDPasswordManagerModal
                                    is_visible={this.state.password_manager.is_visible}
                                    selected_login={this.state.password_manager.selected_login}
                                    selected_account={this.state.password_manager.selected_account}
                                    selected_account_group={this.state.password_manager.selected_account_group}
                                    selected_account_type={this.state.password_manager.selected_account_type}
                                    selected_server={this.state.password_manager.selected_server}
                                    toggleModal={this.togglePasswordManagerModal}
                                />
                                <LoadTab
                                    active_index={this.state.active_index}
                                    top
                                    center
                                    is_loading={is_loading}
                                    is_logged_in={is_logged_in}
                                    loading_component={LoadingCFDRealAccountDisplay}
                                    onTabItemClick={this.updateActiveIndex}
                                    should_update_hash
                                >
                                    <div label={localize('Real account')} data-hash='real'>
                                        <React.Fragment>
                                            {should_show_missing_real_account && (
                                                <MissingRealAccount onClickSignup={beginRealSignupForMt5} />
                                            )}
                                            <CFDRealAccountDisplay
                                                is_accounts_switcher_on={is_accounts_switcher_on}
                                                is_eu={is_eu}
                                                is_eu_country={is_eu_country}
                                                is_logged_in={is_logged_in}
                                                has_maltainvest_account={has_maltainvest_account}
                                                has_malta_account={has_malta_account}
                                                has_mt5_account_error={mt5_disabled_signup_types.demo}
                                                openAccountNeededModal={openAccountNeededModal}
                                                current_list={current_list}
                                                account_status={account_status}
                                                has_mt5_account={has_mt5_account}
                                                onSelectAccount={createMT5Account}
                                                account_settings={account_settings}
                                                landing_companies={landing_companies}
                                                is_pending_authentication={is_pending_authentication}
                                                is_fully_authenticated={is_fully_authenticated}
                                                is_virtual={is_virtual}
                                                openAccountTransfer={this.openAccountTransfer}
                                                openPasswordManager={this.togglePasswordManagerModal}
                                                openPasswordModal={this.openRealPasswordModal}
                                                platform={platform}
                                                isAccountOfTypeDisabled={isAccountOfTypeDisabled}
                                                has_real_account={has_real_account}
                                                standpoint={standpoint}
                                                toggleAccountsDialog={toggleAccountsDialog}
                                                toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
                                                trading_servers={trading_servers}
                                                can_have_more_real_synthetic_mt5={can_have_more_real_synthetic_mt5}
                                            />
                                        </React.Fragment>
                                    </div>
                                    <div label={localize('Demo account')} data-hash='demo'>
                                        <CFDDemoAccountDisplay
                                            is_eu={is_eu}
                                            is_logged_in={is_logged_in}
                                            has_maltainvest_account={has_maltainvest_account}
                                            has_mt5_account_error={mt5_disabled_signup_types.real}
                                            openAccountNeededModal={openAccountNeededModal}
                                            standpoint={standpoint}
                                            is_loading={is_loading}
                                            has_mt5_account={has_mt5_account}
                                            current_list={current_list}
                                            onSelectAccount={createMT5Account}
                                            landing_companies={landing_companies}
                                            openAccountTransfer={this.openAccountTransfer}
                                            openPasswordManager={this.togglePasswordManagerModal}
                                            platform={platform}
                                        />
                                    </div>
                                </LoadTab>
                                {/* TODO: [mt5-redesign] replace tabs with radiogroup once card component is ready */}
                                {/* {!is_loading && ( */}
                                {/*    <RadioGroup */}
                                {/*        className='radio-group__save-type' */}
                                {/*        name='account_type' */}
                                {/*        items={[ */}
                                {/*            { */}
                                {/*                id: 'demo', */}
                                {/*                label: localize('Demo'), */}
                                {/*                value: 'demo', */}
                                {/*            }, */}
                                {/*            { */}
                                {/*                id: 'real', */}
                                {/*                label: localize('Real'), */}
                                {/*                value: 'real', */}
                                {/*            }, */}
                                {/*        ]} */}
                                {/*        selected={this.state.is_demo_tab ? 'demo' : 'real'} */}
                                {/*        onToggle={e => this.updateActiveIndex(e.target.value === 'demo' ? 0 : 1)} */}
                                {/*    /> */}
                                {/* )} */}
                                {/* {this.state.is_demo_tab ? ( */}
                                {/*    <CFDDemoAccountDisplay */}
                                {/*        is_eu={is_eu} */}
                                {/* TODO: remove eslint disable once this is uncommented */}
                                {/* eslint-disable-next-line max-len */}
                                {/*        is_logged_in={is_logged_in} */}
                                {/*        has_maltainvest_account={has_maltainvest_account} */}
                                {/*        openAccountNeededModal={openAccountNeededModal} */}
                                {/*        standpoint={standpoint} */}
                                {/*        is_loading={is_loading} */}
                                {/*        has_mt5_account={has_mt5_account} */}
                                {/*        current_list={current_list} */}
                                {/*        onSelectAccount={createMT5Account} */}
                                {/*        landing_companies={landing_companies} */}
                                {/*        openAccountTransfer={this.openAccountTransfer} */}
                                {/*        openPasswordManager={this.togglePasswordManagerModal} */}
                                {/*    /> */}
                                {/* ) : ( */}
                                {/*    <React.Fragment> */}
                                {/*        {should_show_missing_real_account && ( */}
                                {/*            <MissingRealAccount onClickSignup={beginRealSignupForMt5} /> */}
                                {/*        )} */}
                                {/*        <MT5RealAccountDisplay */}
                                {/*            is_eu={is_eu} */}
                                {/* TODO: remove eslint disable once this is uncommented */}
                                {/* eslint-disable-next-line max-len */}
                                {/*            is_eu_country={is_eu_country} */}
                                {/*            is_logged_in={is_logged_in} */}
                                {/*            has_maltainvest_account={has_maltainvest_account} */}
                                {/*            has_malta_account={has_malta_account} */}
                                {/*            openAccountNeededModal={openAccountNeededModal} */}
                                {/*            current_list={current_list} */}
                                {/*            account_status={account_status} */}
                                {/*            has_mt5_account={has_mt5_account} */}
                                {/*            onSelectAccount={createMT5Account} */}
                                {/*            account_settings={account_settings} */}
                                {/*            landing_companies={landing_companies} */}
                                {/*            is_pending_authentication={is_pending_authentication} */}
                                {/*            is_fully_authenticated={is_fully_authenticated} */}
                                {/*            openAccountTransfer={this.openAccountTransfer} */}
                                {/*            openPasswordManager={this.togglePasswordManagerModal} */}
                                {/*            openPasswordModal={this.openRealPasswordModal} */}
                                {/*            has_real_account={has_real_account} */}
                                {/*            standpoint={standpoint} */}
                                {/*        /> */}
                                {/*    </React.Fragment> */}
                                {/* )} */}
                                {platform === 'mt5' && (
                                    <div className='cfd-dashboard__info'>
                                        <div className='cfd-dashboard__info-description'>
                                            <Localize i18n_default_text='Use these in your apps' />
                                        </div>
                                        <CFDInfoCopy
                                            display_name={getBrokerName()}
                                            text_copy={getBrokerName()}
                                            label={localize('Broker')}
                                            info_msg={localize('Click here to copy broker name.')}
                                            success_msg={localize('Broker name copied!')}
                                        />
                                        <CFDInfoCopy
                                            display_name={getServerName(this.state.is_demo_tab)}
                                            text_copy={getServerName(this.state.is_demo_tab)}
                                            label={localize('Server')}
                                            info_msg={localize('Click here to copy server name.')}
                                            success_msg={localize('Server name copied!')}
                                        />
                                    </div>
                                )}
                                <CompareAccountsModal platform={platform} />
                                {/* TODO: Remove this part once design for dxtrade maintenance mesage is ready */}
                                {platform === 'dxtrade' && (
                                    <React.Fragment>
                                        <br />
                                        <br />
                                    </React.Fragment>
                                )}
                                {platform === 'mt5' && (
                                    <div className='cfd-dashboard__maintenance'>
                                        <Icon
                                            icon='IcAlertWarning'
                                            size={isMobile() ? 28 : 16}
                                            className='cfd-dashboard__maintenance-icon'
                                        />
                                        <div className='cfd-dashboard__maintenance-text'>
                                            <Localize
                                                i18n_default_text='Server maintenance starting 03:00 GMT every Sunday. This process may take up to 2 hours to complete. <0 />Service may be disrupted during this time.'
                                                components={[<br key={0} />]}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DesktopWrapper>
                                <CFDDashboardContainer platform={platform} />
                            </DesktopWrapper>
                            <MobileWrapper>
                                <div className='cfd-dashboard__download-center'>
                                    <h1 className='cfd-dashboard__download-center--heading'>
                                        {platform === 'mt5' && <Localize i18n_default_text='Download the MT5 app' />}
                                        {platform === 'dxtrade' && (
                                            <Localize i18n_default_text='Download the DXTrade app' />
                                        )}
                                    </h1>
                                    <div className='cfd-dashboard__download-center-options--mobile'>
                                        <div className='cfd-dashboard__download-center-options--mobile-devices'>
                                            {platform === 'mt5' && (
                                                <React.Fragment>
                                                    <Icon icon='IcMt5DeviceTablet' width={133} height={106} />
                                                    <Icon icon='IcMt5DevicePhone' width={48} height={74} />
                                                </React.Fragment>
                                            )}
                                            {platform === 'dxtrade' && (
                                                <React.Fragment>
                                                    <Icon icon='IcDxtradeDeviceTablet' width={133} height={106} />
                                                    <Icon icon='IcDxtradeDevicePhone' width={48} height={74} />
                                                </React.Fragment>
                                            )}
                                        </div>
                                        <div className='cfd-dashboard__download-center-options--mobile-links'>
                                            <a
                                                href={getPlatformMt5DownloadLink('android')}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <Icon icon='IcInstallationGoogle' width={135} height={40} />
                                            </a>
                                            <a
                                                href={getPlatformMt5DownloadLink('ios')}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <Icon icon='IcInstallationApple' width={135} height={40} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </MobileWrapper>
                            <CFDTopUpDemoModal />
                            <CFDPasswordModal />
                            <CFDServerErrorDialog />
                            {platform === 'mt5' && (
                                <React.Fragment>
                                    <MT5AccountOpeningRealFinancialStpModal />
                                    <CFDFinancialStpPendingDialog />
                                </React.Fragment>
                            )}
                            <CFDResetPasswordModal />
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
    }
}

export default withRouter(
    connect(({ client, modules, ui }) => ({
        beginRealSignupForMt5: modules.mt5.beginRealSignupForMt5,
        checkShouldOpenAccount: modules.mt5.checkShouldOpenAccount,
        country: client.account_settings.residence,
        createMT5Account: modules.mt5.createMT5Account,
        current_list: modules.mt5.current_list,
        landing_companies: client.landing_companies,
        isAccountOfTypeDisabled: client.isAccountOfTypeDisabled,
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        is_eu: client.is_eu,
        is_eu_country: client.is_eu_country,
        is_virtual: client.is_virtual,
        is_mt5_allowed: client.is_mt5_allowed,
        mt5_disabled_signup_types: client.mt5_disabled_signup_types,
        has_maltainvest_account: client.has_maltainvest_account,
        has_malta_account: client.has_malta_account,
        can_upgrade_to: client.can_upgrade_to,
        account_settings: client.account_settings,
        disableMt5PasswordModal: modules.mt5.disableMt5PasswordModal,
        is_pending_authentication: client.is_pending_authentication,
        is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
        is_fully_authenticated: client.is_fully_authenticated,
        openPasswordModal: modules.mt5.enableMt5PasswordModal,
        openAccountNeededModal: ui.openAccountNeededModal,
        is_loading: client.is_populating_mt5_account_list,
        residence: client.residence,
        has_mt5_account: modules.mt5.has_mt5_account,
        has_mt5_account_error: client.has_account_error_in_mt5_list,
        has_real_account: client.has_active_real_account,
        setAccountType: modules.mt5.setAccountType,
        setMt5PasswordResetModal: modules.mt5.setMt5PasswordResetModal,
        setCurrentAccount: modules.mt5.setCurrentAccount,
        standpoint: client.standpoint,
        toggleCompareAccounts: modules.mt5.toggleCompareAccountsModal,
        is_accounts_switcher_on: ui.is_accounts_switcher_on,
        openTopUpModal: ui.openTopUpModal,
        NotificationMessages: ui.notification_messages_ui,
        onMount: modules.mt5.onMount,
        onUnmount: modules.mt5.onUnmount,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        toggleShouldShowRealAccountsList: ui.toggleShouldShowRealAccountsList,
        trading_servers: client.trading_servers,
        can_have_more_real_synthetic_mt5: client.can_have_more_real_synthetic_mt5,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
    }))(CFDDashboard)
);
