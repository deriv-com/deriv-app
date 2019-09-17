import { Button }              from 'deriv-components';
import React                   from 'react';
import Localize                from 'App/Components/Elements/localize.jsx';
import { Tabs }                from 'App/Components/Elements/Tabs';
import { localize }            from 'App/i18n';
import IconDeviceLaptop        from 'Assets/SvgComponents/mt5/icon-device-laptop.svg';
import IconDeviceMac           from 'Assets/SvgComponents/mt5/icon-device-mac.svg';
import IconDeviceMobile        from 'Assets/SvgComponents/mt5/icon-device-mobile.svg';
import IconInstallationApple   from 'Assets/SvgComponents/mt5/icon-installation-apple.svg';
import IconInstallationGoogle  from 'Assets/SvgComponents/mt5/icon-installation-google.svg';
import IconInstallationLinux   from 'Assets/SvgComponents/mt5/icon-installation-linux.svg';
import IconInstallationMac     from 'Assets/SvgComponents/mt5/icon-installation-mac.svg';
import IconInstallationWindows from 'Assets/SvgComponents/mt5/icon-installation-windows.svg';
import { connect }             from 'Stores/connect';
import 'Sass/app/modules/mt5-dashboard.scss';

const RealDisplay = () => (
    <p>Hi I am in REAL</p>
);

const VirtualDisplay = () => (
    <p>Hi I am in Virtual</p>
);

class MT5Dashboard extends React.Component {
    static get dashboard_tabs() {
        return {
            1: { header: localize('Real account'), content: RealDisplay },
            2: { header: localize('Virtual account'), content: VirtualDisplay },
        };
    }

    render() {
        const { is_first_time } = this.props;

        return (
            <div className='mt5-dashboard'>

                { is_first_time &&
                    <div className='mt5-dashboard__welcome-message'>
                        <h1 className='mt5-dashboard__welcome-message--heading'>
                            <Localize i18n_default_text='Welcome to Deriv MetaTrader 5 (MT5)' />
                        </h1>
                        <div className='mt5-dashboard__welcome-message--content'>
                            <p className='mt5-dashboard__welcome-message--paragraph'>
                                <Localize i18n_default_text='MetaTrader 5 (MT5) is a popular online trading platform for forex and stock markets. Get prices and currency quotes, perform analysis using charts and technical indicators, and easily view your trading history.' />
                            </p>
                            <Button className='mt5-dashboard__welcome-message--button' type='button'>
                                <p className='mt5-dashboard__welcome-message--paragraph'>
                                    <Localize i18n_default_text='Learn more' />
                                </p>
                            </Button>
                        </div>
                    </div>
                }

                <div className='mt5-dashboard__accounts-display'>
                    {/* TODO: Add MT5 accounts display component */}
                    <Tabs alignment='center' list={ MT5Dashboard.dashboard_tabs } />
                </div>

                <div className='mt5-dashboard__download-center'>
                    <h1 className='mt5-dashboard__download-center--heading'>
                        <Localize i18n_default_text='After creating your account, download MT5 for your desktop or mobile' />
                    </h1>

                    <div className='mt5-dashboard__download-center-options'>
                        <div className='mt5-dashboard__download-center-options--desktop'>
                            <div className='mt5-dashboard__download-center-options--desktop-devices'>
                                <IconDeviceMac />
                                <IconDeviceLaptop />
                            </div>
                            <div className='mt5-dashboard__download-center-options--desktop-links'>
                                <IconInstallationWindows />
                                <IconInstallationMac />
                                <IconInstallationLinux />
                            </div>
                        </div>
                        <div className='mt5-dashboard__download-center-options--mobile'>
                            <div className='mt5-dashboard__download-center-options--mobile-devices'>
                                <IconDeviceMobile />
                            </div>
                            <div className='mt5-dashboard__download-center-options--mobile-links'>
                                <IconInstallationApple />
                                <IconInstallationGoogle />
                            </div>
                        </div>
                    </div>
                    <p className='mt5-dashboard__download-center--hint'>
                        <Localize i18n_default_text='The MT5 platform does not support Windows XP, Windows 2003 and Windows Vista.' />
                    </p>
                </div>
            </div>
        );
    }
}

export default connect(({ client }) => ({
    is_first_time: client.is_logged_in, // TODO: this is a dummy observable, to be changed when MT5 related data available
}))(MT5Dashboard);
