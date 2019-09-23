import { Button, Tabs }        from 'deriv-components';
import React                   from 'react';
import Localize                from 'App/Components/Elements/localize.jsx';
import { localize }            from 'App/i18n';
import IconMT5Advanced         from 'Assets/SvgComponents/mt5/accounts-display/icon-mt5-advanced.svg';
import IconMT5Standard         from 'Assets/SvgComponents/mt5/accounts-display/icon-mt5-standard.svg';
import IconMT5Synthetic        from 'Assets/SvgComponents/mt5/accounts-display/icon-mt5-synthetic.svg';
import IconDeviceLaptop        from 'Assets/SvgComponents/mt5/download-center/icon-device-laptop.svg';
import IconDeviceMac           from 'Assets/SvgComponents/mt5/download-center/icon-device-mac.svg';
import IconDeviceMobile        from 'Assets/SvgComponents/mt5/download-center/icon-device-mobile.svg';
import IconInstallationApple   from 'Assets/SvgComponents/mt5/download-center/icon-installation-apple.svg';
import IconInstallationGoogle  from 'Assets/SvgComponents/mt5/download-center/icon-installation-google.svg';
import IconInstallationLinux   from 'Assets/SvgComponents/mt5/download-center/icon-installation-linux.svg';
import IconInstallationMac     from 'Assets/SvgComponents/mt5/download-center/icon-installation-mac.svg';
import IconInstallationWindows from 'Assets/SvgComponents/mt5/download-center/icon-installation-windows.svg';
import { connect }             from 'Stores/connect';
import 'Sass/app/modules/mt5-dashboard.scss';

/*
*  [Work In Progress]
*  This file is a WIP and will be broken down into different files for different components before the module is enabled
*  Class names might change, component structures might change, and content and icons will definitely change
* */

const MT5AccountCard = ({
    commission_message,
    descriptor,
    icon,
    specs,
    title,
    onSelectAccount,
}) => {
    const IconComponent = icon || (() => null);

    return (
        <div className='mt5-account-card'>
            <div className='mt5-account-card__type'>
                { icon &&
                    <IconComponent className='mt5-account-card__type--icon' />
                }
                <div className='mt5-account-card__type--description'>
                    <h1 className='mt5-account-card--heading'>
                        { title }
                    </h1>
                    <p className='mt5-account-card--paragraph'>
                        { descriptor }
                    </p>
                </div>
            </div>

            <div className='mt5-account-card__cta'>
                <div className='mt5-account-card__specs'>
                    <table className='mt5-account-card__specs-table'>
                        <tbody>
                            {
                                Object.keys(specs).map((spec_attribute, idx) => (
                                    <tr key={ idx } className='mt5-account-card__specs-table-row'>
                                        <td className='mt5-account-card__specs-table-attribute'>
                                            <p className='mt5-account-card--paragraph'>
                                                { spec_attribute }
                                            </p>
                                        </td>
                                        <td className='mt5-account-card__specs-table-data'>
                                            <p className='mt5-account-card--paragraph'>
                                                { specs[spec_attribute] }
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                { commission_message &&
                <p className='mt5-account-card__commission mt5-account-card--paragraph'>
                    { commission_message }
                </p>
                }

                <Button
                    className='mt5-account-card__account-selection'
                    onClick={ () => { onSelectAccount(title); } }
                    type='button'
                >
                    <Localize i18n_default_text='Select' />
                </Button>
            </div>
        </div>
    );
};

const RealAccountsDisplay = ({ onSelectAccount }) => (
    <div className='mt5-real-accounts-display'>
        <MT5AccountCard
            icon={() => (<IconMT5Standard />) }
            title={ localize('Real Standard') }
            commission_message={
                <Localize
                    i18n_default_text='No commission <0>(excluding cryptocurrencies)</0>'
                    components={[ <span key={0} className='mt5-dashboard--hint' /> ]}
                />
            }
            onSelectAccount={ onSelectAccount }
            descriptor={ localize('Suitable for both new and experienced traders.') }
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        />
        <MT5AccountCard
            icon={() => (<IconMT5Advanced />) }
            title={ localize('Real Advanced') }
            commission_message={ <Localize i18n_default_text='No commission' /> }
            onSelectAccount={ onSelectAccount }
            descriptor={ localize('Give you more products, tight spreads, and higher ticket size.') }
            specs={{
                [localize('Leverage')]        : localize('Up to 1:100'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        />
        <MT5AccountCard
            icon={() => (<IconMT5Synthetic />) }
            title={ localize('Real Synthetic Indices') }
            commission_message={ <Localize i18n_default_text='No commission' /> }
            onSelectAccount={ onSelectAccount }
            descriptor={ localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.') }
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('100%'),
                [localize('Stop out level')]  : localize('50%'),
                [localize('Number of assets')]: localize('10+'),
            }}
        />
    </div>
);

const DemoAccountsDisplay = ({ onSelectAccount }) => (
    <div className='mt5-demo-accounts-display'>
        <MT5AccountCard
            icon={() => (<IconMT5Standard />) }
            title={ localize('Demo Standard') }
            commission_message={
                <Localize
                    i18n_default_text='No commission <0>(excluding cryptocurrencies)</0>'
                    components={[ <span key={0} className='mt5-dashboard--hint' /> ]}
                />
            }
            onSelectAccount={ onSelectAccount }
            descriptor={ localize('Suitable for both new and experienced traders.') }
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        />
        <MT5AccountCard
            icon={() => (<IconMT5Advanced />) }
            title={ localize('Demo Advanced') }
            commission_message={ <Localize i18n_default_text='No commission' /> }
            onSelectAccount={ onSelectAccount }
            descriptor={ localize('Give you more products, tight spreads, and higher ticket size.') }
            specs={{
                [localize('Leverage')]        : localize('Up to 1:100'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        />
        <MT5AccountCard
            icon={() => (<IconMT5Synthetic />) }
            title={ localize('Demo Synthetic Indices') }
            commission_message={ <Localize i18n_default_text='No commission' /> }
            onSelectAccount={ onSelectAccount }
            descriptor={ localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.') }
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('100%'),
                [localize('Stop out level')]  : localize('50%'),
                [localize('Number of assets')]: localize('10+'),
            }}
        />
    </div>
);

class MT5Dashboard extends React.Component {
    render() {
        const {
            createMT5Account,
            is_first_time,
        } = this.props;

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
                    {/* <Tabs alignment='center' list={ MT5Dashboard.dashboard_tabs } /> */}
                    <Tabs>
                        <div label={ localize('Real account') }>
                            <RealAccountsDisplay onSelectAccount={ createMT5Account } />
                        </div>
                        <div label={ localize('Demo account') }>
                            <DemoAccountsDisplay onSelectAccount={ createMT5Account } />
                        </div>
                    </Tabs>
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

export default connect(({ client, modules }) => ({
    createMT5Account: modules.mt5.createMT5Account,
    is_first_time   : client.is_logged_in, // TODO: this is a dummy observable, to be changed when MT5 related data available
}))(MT5Dashboard);
