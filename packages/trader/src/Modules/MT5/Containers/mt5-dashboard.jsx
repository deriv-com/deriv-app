import { DesktopWrapper, Icon, MobileWrapper, Tabs } from '@deriv/components';
import React from 'react';
import { withRouter } from 'react-router';
import { Localize, localize } from '@deriv/translations';
import routes from 'Constants/routes';
import { connect } from 'Stores/connect';
import LoadingMT5RealAccountDisplay from './loading-mt5-real-account-display.jsx';
import MissingRealAccount from './missing-real-account.jsx';
import MT5AccountOpeningRealAdvancedModal from './mt5-account-opening-real-advanced-modal.jsx';
import CompareAccountsModal from './mt5-compare-accounts-modal.jsx';
import MT5DashboardContainer from './mt5-dashboard-container.jsx';
import MT5PasswordManagerModal from './mt5-password-manager-modal.jsx';
import MT5PasswordModal from './mt5-password-modal.jsx';
import MT5ServerErrorDialog from './mt5-server-error-dialog.jsx';
import Mt5TopUpDemoModal from './mt5-top-up-demo-modal.jsx';
import MT5WelcomeMessage from './mt5-welcome-message.jsx';
import Mt5AdvancedPendingDialog from '../Components/mt5-advanced-pending-dialog.jsx';
import { MT5DemoAccountDisplay } from '../Components/mt5-demo-account-display.jsx';
import { MT5RealAccountDisplay } from '../Components/mt5-real-account-display.jsx';
import 'Sass/app/modules/mt5/mt5-dashboard.scss';

class MT5Dashboard extends React.Component {
    state = {
        active_index: 0,
        password_manager: {
            is_visible: false,
            selected_login: '',
            selected_account: '',
        },
    };

    componentDidMount() {
        this.updateActiveIndex();
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    componentDidUpdate(prev_props) {
        this.updateActiveIndex();
        if (prev_props.is_mt5_allowed !== this.props.is_mt5_allowed && !this.props.is_mt5_allowed) {
            this.history.push(routes.trade);
        }
    }

    updateActiveIndex = () => {
        const index_to_set = /demo/.test(this.props.location.hash) ? 1 : 0;
        if (this.state.active_index !== index_to_set) {
            this.setState({ active_index: index_to_set });
        }
    };

    openAccountTransfer = (data, meta) => {
        if (meta.category === 'real') {
            this.props.disableMt5PasswordModal();
            this.props.history.push(routes.cashier_acc_transfer);
        } else {
            this.props.setCurrentAccount(data, meta);
            this.props.openTopUpModal();
        }
    };

    togglePasswordManagerModal = (login, title) => {
        this.setState(prev_state => ({
            active_index: prev_state.active_index,
            password_manager: {
                is_visible: !prev_state.password_manager.is_visible,
                selected_login: typeof login === 'string' ? login : '',
                selected_account: typeof title === 'string' ? title : '',
            },
        }));
    };

    openRealPasswordModal = account_type => {
        this.props.setAccountType(account_type);
        this.props.openPasswordModal();
    };

    render() {
        const {
            beginRealSignupForMt5,
            createMT5Account,
            is_loading,
            has_mt5_account,
            has_real_account,
            NotificationMessages,
            account_settings,
        } = this.props;

        return (
            <div className='mt5-dashboard__container'>
                <NotificationMessages />
                <div className='mt5-dashboard'>
                    <MT5WelcomeMessage hasMt5Account={has_mt5_account} />
                    <div className='mt5-dashboard__accounts-display'>
                        <MT5PasswordManagerModal
                            is_visible={this.state.password_manager.is_visible}
                            selected_login={this.state.password_manager.selected_login}
                            selected_account={this.state.password_manager.selected_account}
                            toggleModal={this.togglePasswordManagerModal}
                        />
                        <Tabs active_index={this.state.active_index} top>
                            <div label={localize('Real account')}>
                                {is_loading && <LoadingMT5RealAccountDisplay />}
                                {!is_loading && (
                                    <>
                                        {!has_real_account && (
                                            <MissingRealAccount onClickSignup={beginRealSignupForMt5} />
                                        )}
                                        <MT5RealAccountDisplay
                                            current_list={this.props.current_list}
                                            account_status={this.props.account_status}
                                            has_mt5_account={has_mt5_account}
                                            onSelectAccount={createMT5Account}
                                            account_settings={account_settings}
                                            is_pending_authentication={this.props.is_pending_authentication}
                                            is_fully_authenticated={this.props.is_fully_authenticated}
                                            openAccountTransfer={this.openAccountTransfer}
                                            openPasswordManager={this.togglePasswordManagerModal}
                                            openPasswordModal={this.openRealPasswordModal}
                                            has_real_account={has_real_account}
                                        />
                                    </>
                                )}
                            </div>
                            <div label={localize('Demo account')}>
                                <MT5DemoAccountDisplay
                                    is_loading={is_loading}
                                    has_mt5_account={has_mt5_account}
                                    current_list={this.props.current_list}
                                    onSelectAccount={createMT5Account}
                                    openAccountTransfer={this.openAccountTransfer}
                                    openPasswordManager={this.togglePasswordManagerModal}
                                />
                            </div>
                        </Tabs>
                        <CompareAccountsModal />
                    </div>

                    <DesktopWrapper>
                        <MT5DashboardContainer />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <div className='mt5-dashboard__download-center'>
                            <h1 className='mt5-dashboard__download-center--heading'>
                                <Localize i18n_default_text='Run MT5 from your browser or download the DMT5 app for your devices' />
                            </h1>
                            <div className='mt5-dashboard__download-center-options--mobile'>
                                <div className='mt5-dashboard__download-center-options--mobile-devices'>
                                    <Icon icon='IcMt5DeviceTablet' width={133} height={106} />
                                    <Icon icon='IcMt5DevicePhone' width={48} height={74} />
                                </div>
                                <div className='mt5-dashboard__download-center-options--mobile-links'>
                                    <a
                                        href='https://download.mql5.com/cdn/mobile/mt5/android?server=Binary.com-Server'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <Icon icon='IcInstallationGoogle' width={135} height={40} />
                                    </a>
                                    <a
                                        href='https://download.mql5.com/cdn/mobile/mt5/ios?server=Binary.com-Server'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <Icon icon='IcInstallationApple' width={135} height={40} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </MobileWrapper>
                    <Mt5TopUpDemoModal />
                    <MT5PasswordModal />
                    <MT5ServerErrorDialog />
                    <MT5AccountOpeningRealAdvancedModal />
                    <Mt5AdvancedPendingDialog />
                </div>
            </div>
        );
    }
}

export default withRouter(
    connect(({ client, modules, ui }) => ({
        beginRealSignupForMt5: modules.mt5.beginRealSignupForMt5,
        createMT5Account: modules.mt5.createMT5Account,
        current_list: modules.mt5.current_list,
        is_logged_in: client.is_logged_in,
        can_upgrade_to: client.can_upgrade_to,
        account_settings: client.account_settings,
        disableMt5PasswordModal: modules.mt5.disableMt5PasswordModal,
        is_pending_authentication: client.is_pending_authentication,
        is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
        is_fully_authenticated: client.is_fully_authenticated,
        openPasswordModal: modules.mt5.enableMt5PasswordModal,
        is_loading: client.is_populating_mt5_account_list,
        is_mt5_allowed: client.is_mt5_allowed,
        has_mt5_account: modules.mt5.has_mt5_account,
        has_real_account: client.has_active_real_account,
        setAccountType: modules.mt5.setAccountType,
        setCurrentAccount: modules.mt5.setCurrentAccount,
        toggleCompareAccounts: modules.mt5.toggleCompareAccountsModal,
        openTopUpModal: ui.openTopUpModal,
        NotificationMessages: ui.notification_messages_ui,
        onMount: modules.mt5.onMount,
        onUnmount: modules.mt5.onUnmount,
    }))(MT5Dashboard)
);
