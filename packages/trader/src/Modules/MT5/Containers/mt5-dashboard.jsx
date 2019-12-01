import {
    Tabs }                       from 'deriv-components';
import React                     from 'react';
import { withRouter }            from 'react-router';
import { localize, Localize }    from 'deriv-translations';
import IconDeviceLaptop          from 'Assets/SvgComponents/mt5/download-center/icon-device-laptop.svg';
import IconDeviceDesktop         from 'Assets/SvgComponents/mt5/download-center/icon-device-desktop.svg';
import IconDevicePhone           from 'Assets/SvgComponents/mt5/download-center/icon-device-phone.svg';
import IconDeviceTablet          from 'Assets/SvgComponents/mt5/download-center/icon-device-tablet.svg';
import IconInstallationApple     from 'Assets/SvgComponents/mt5/download-center/icon-installation-apple.svg';
import IconInstallationGoogle    from 'Assets/SvgComponents/mt5/download-center/icon-installation-google.svg';
import IconInstallationLinux     from 'Assets/SvgComponents/mt5/download-center/icon-installation-linux.svg';
import IconInstallationMac       from 'Assets/SvgComponents/mt5/download-center/icon-installation-mac.svg';
import IconInstallationWeb       from 'Assets/SvgComponents/mt5/download-center/icon-installation-web.svg';
import IconInstallationWindows   from 'Assets/SvgComponents/mt5/download-center/icon-installation-windows.svg';
import MT5PasswordModal          from 'Modules/MT5/Containers/mt5-password-modal.jsx';
import MT5ServerErrorDialog      from 'Modules/MT5/Containers/mt5-server-error-dialog.jsx';
import Mt5TopUpDemoModal         from 'Modules/MT5/Containers/mt5-top-up-demo-modal.jsx';
import { connect }               from 'Stores/connect';
import CompareAccountsModal      from './mt5-compare-accounts-modal.jsx';
import MT5PasswordManagerModal   from './mt5-password-manager-modal.jsx';
import { MT5DemoAccountDisplay } from '../Components/mt5-demo-account-display.jsx';
import { MT5RealAccountDisplay } from '../Components/mt5-real-account-display.jsx';
import 'Sass/app/modules/mt5/mt5-dashboard.scss';

class MT5Dashboard extends React.Component {
    state = {
        active_index    : 0,
        password_manager: {
            is_visible      : false,
            selected_login  : '',
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

    componentDidUpdate() {
        this.updateActiveIndex();
    }

    updateActiveIndex = () => {
        const index_to_set = /demo/.test(this.props.location.hash) ? 1 : 0;
        if (this.state.active_index !== index_to_set) {
            this.setState({ active_index: index_to_set });
        }
    };

    openAccountTransfer = (data, meta) => {
        if (meta.category === 'real') {
            this.props.closeMt5AndOpenCashier('account_transfer');
        } else {
            this.props.setCurrentAccount(data, meta);
            this.props.openTopUpModal();
        }
    };

    togglePasswordManagerModal = (login, title) => {
        this.setState((prev_state) => ({
            active_index    : prev_state.active_index,
            password_manager: {
                is_visible      : !prev_state.password_manager.is_visible,
                selected_login  : typeof login === 'string' ? login : '',
                selected_account: typeof title === 'string' ? title : '',
            },
        }));
    };

    render() {
        const {
            beginRealSignupForMt5,
            createMT5Account,
            is_loading,
            has_mt5_account,
            has_real_account,
            NotificationMessages,
        } = this.props;

        return (
            <div className='mt5-dashboard__container'>
                <NotificationMessages />
                <div className='mt5-dashboard'>
                    { !has_mt5_account &&
                        <div className='mt5-dashboard__welcome-message'>
                            <h1 className='mt5-dashboard__welcome-message--heading'>
                                <Localize i18n_default_text='Welcome to your DMT5 account dashboard and manager' />
                            </h1>
                            <div className='mt5-dashboard__welcome-message--content'>
                                <p className='mt5-dashboard__welcome-message--paragraph'>
                                    <Localize
                                        i18n_default_text='MetaTrader 5 (MT5) is a popular online trading platform for forex and stock markets. Get prices and currency quotes, perform analysis using charts and technical indicators, and easily view your trading history.'
                                    />
                                </p>
                            </div>
                        </div>
                    }

                    <div className='mt5-dashboard__accounts-display'>
                        <MT5PasswordManagerModal
                            is_visible={ this.state.password_manager.is_visible }
                            selected_login={ this.state.password_manager.selected_login }
                            selected_account={ this.state.password_manager.selected_account }
                            toggleModal={ this.togglePasswordManagerModal }
                        />
                        <Tabs active_index={this.state.active_index}>
                            <div label={localize('Real account')}>
                                <MT5RealAccountDisplay
                                    is_loading={ is_loading }
                                    current_list={this.props.current_list}
                                    has_mt5_account={has_mt5_account}
                                    onSelectAccount={createMT5Account}
                                    openAccountTransfer={this.openAccountTransfer}
                                    openPasswordManager={ this.togglePasswordManagerModal }
                                    beginRealSignupForMt5={ beginRealSignupForMt5 }
                                    has_real_account={ has_real_account }
                                />
                            </div>
                            <div label={localize('Demo account')}>
                                <MT5DemoAccountDisplay
                                    is_loading={ is_loading }
                                    has_mt5_account={has_mt5_account}
                                    current_list={this.props.current_list}
                                    onSelectAccount={createMT5Account}
                                    openAccountTransfer={this.openAccountTransfer}
                                    openPasswordManager={ this.togglePasswordManagerModal }
                                />
                            </div>
                        </Tabs>
                        <CompareAccountsModal />
                    </div>

                    <div className='mt5-dashboard__download-center'>
                        <h1 className='mt5-dashboard__download-center--heading'>
                            <Localize
                                i18n_default_text='Download MT5 for your desktop or mobile'
                            />
                        </h1>

                        <div className='mt5-dashboard__download-center-options'>
                            <div className='mt5-dashboard__download-center-options--desktop'>
                                <div className='mt5-dashboard__download-center-options--desktop-devices'>
                                    <IconDeviceDesktop />
                                    <IconDeviceLaptop />
                                    <a href='https://trade.mql5.com/trade?servers=Binary.com-Server&trade_server=Binary.com-Server' target='_blank' rel='noopener noreferrer'><IconInstallationWeb /></a>
                                </div>
                                <div className='mt5-dashboard__download-center-options--desktop-links'>
                                    <a href='https://s3.amazonaws.com/binary-mt5/binarycom_mt5.exe' target='_blank' rel='noopener noreferrer'><IconInstallationWindows /></a>
                                    <a href='https://deriv.s3-ap-southeast-1.amazonaws.com/deriv-mt5.dmg' target='_blank' rel='noopener noreferrer'><IconInstallationMac /></a>
                                    <a href='https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux' target='_blank' rel='noopener noreferrer'><IconInstallationLinux /></a>
                                </div>
                            </div>
                            <div className='mt5-dashboard__download-center-options--mobile'>
                                <div className='mt5-dashboard__download-center-options--mobile-devices'>
                                    <IconDeviceTablet />
                                    <IconDevicePhone />
                                </div>
                                <div className='mt5-dashboard__download-center-options--mobile-links'>
                                    <a href='https://download.mql5.com/cdn/mobile/mt5/ios?server=Binary.com-Server' target='_blank' rel='noopener noreferrer'><IconInstallationApple /></a>
                                    <a href='https://download.mql5.com/cdn/mobile/mt5/android?server=Binary.com-Server' target='_blank' rel='noopener noreferrer'><IconInstallationGoogle /></a>
                                </div>
                            </div>
                        </div>
                        <p className='mt5-dashboard__download-center--hint'>
                            <Localize
                                i18n_default_text='The DMT5 platform is not supported by macOS Catalina, Windows XP, Windows 2003, and Windows Vista.'
                            />
                        </p>
                    </div>
                    <Mt5TopUpDemoModal />
                    <MT5PasswordModal />
                    <MT5ServerErrorDialog />
                </div>
            </div>
        );
    }
}

export default withRouter(connect(({ client, modules, ui }) => ({
    beginRealSignupForMt5      : modules.mt5.beginRealSignupForMt5,
    createMT5Account           : modules.mt5.createMT5Account,
    current_list               : modules.mt5.current_list,
    is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
    is_loading                 : client.is_populating_mt5_account_list,
    has_mt5_account            : modules.mt5.has_mt5_account,
    has_real_account           : client.has_active_real_account,
    setCurrentAccount          : modules.mt5.setCurrentAccount,
    toggleCompareAccounts      : modules.mt5.toggleCompareAccountsModal,
    closeMt5AndOpenCashier     : modules.mt5.closeMt5AndOpenCashier,
    openTopUpModal             : ui.openTopUpModal,
    NotificationMessages       : ui.notification_messages_ui,
    onMount                    : modules.mt5.onMount,
    onUnmount                  : modules.mt5.onUnmount,
}))(MT5Dashboard));
