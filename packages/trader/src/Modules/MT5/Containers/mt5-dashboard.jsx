import { Button, Tabs, Modal, Popover } from 'deriv-components';
import React                   from 'react';
import DataTable               from 'App/Components/Elements/DataTable';
import Localize                from 'App/Components/Elements/localize.jsx';
import UILoader                from 'App/Components/Elements/ui-loader.jsx';
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
    type,
    onSelectAccount,
}) => {
    const IconComponent = icon || (() => null);

    return (
        <div className='mt5-account-card'>
            <div className='mt5-account-card__type'>
                { icon &&
                    <IconComponent />
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
                    onClick={ () => { onSelectAccount(type); } }
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
            title={ localize('Standard') }
            type={{
                category: 'real',
                type    : 'standard',
            }}
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
            title={ localize('Advanced') }
            type={{
                category: 'real',
                type    : 'advanced',
            }}
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
            title={ localize('Synthetic Indices') }
            type={{
                category: 'real',
                type    : 'synthetic_indices',
            }}
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
            title={ localize('Standard') }
            type={{
                category: 'demo',
                type    : 'standard',
            }}
            commission_message={
                <Localize
                    i18n_default_text='No commission <0>(excluding cryptocurrencies)</0>'
                    components={ [<span key={ 0 } className='mt5-dashboard--hint' />] }
                />
            }
            onSelectAccount={ onSelectAccount }
            descriptor={ localize('Suitable for both new and experienced traders.') }
            specs={ {
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            } }
        />
        <MT5AccountCard
            icon={() => (<IconMT5Advanced />) }
            title={ localize('Advanced') }
            type={{
                category: 'demo',
                type    : 'advanced',
            }}
            commission_message={ <Localize i18n_default_text='No commission' /> }
            onSelectAccount={ onSelectAccount }
            descriptor={ localize('Give you more products, tight spreads, and higher ticket size.') }
            specs={ {
                [localize('Leverage')]        : localize('Up to 1:100'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            } }
        />
        <MT5AccountCard
            icon={() => (<IconMT5Synthetic />) }
            title={ localize('Synthetic Indices') }
            type={{
                category: 'demo',
                type    : 'synthetic_indices',
            }}
            commission_message={ <Localize i18n_default_text='No commission' /> }
            onSelectAccount={ onSelectAccount }
            descriptor={ localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.') }
            specs={ {
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('100%'),
                [localize('Stop out level')]  : localize('50%'),
                [localize('Number of assets')]: localize('10+'),
            } }
        />
    </div>
);

/* eslint-disable react/display-name, react/prop-types */
const compareAccountsColumns = [
    {
        title    : '',
        col_index: 'attribute',
    },
    {
        title    : localize('Standard'),
        col_index: 'standard',
    }, {
        title    : localize('Advanced'),
        col_index: 'advanced',
    }, {
        title    : localize('Synthetic Indices'),
        col_index: 'synthetic',
    },
];
/* eslint-enable react/display-name, react/prop-types */

const MT5AttributeDescriber = ({ name, tooltip, counter }) => {
    return tooltip ? (
        <React.Fragment>
            <p className='mt5-attribute-describer'>{ name }</p>
            <Popover
                alignment='right'
                icon='counter'
                counter={ counter }
                message={ tooltip }
            />
        </React.Fragment>
    ) : (
        <p className='mt5-attribute-describer'>{ name }</p>
    );
};

const compareAccountsData = [
    {
        attribute: <MT5AttributeDescriber name={ localize('Account currency') }/>,
        standard : localize('USD'),
        advanced : localize('USD'),
        synthetic: localize('USD'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={ localize('Maximum leverage') }
                counter={ 1 }
                tooltip={ localize('Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols.') }
            />
        ),
        standard : localize('Up To 1:1000'),
        advanced : localize('Up To 1:100'),
        synthetic: localize('Up To 1:1000'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={ localize('Order execution') }
                counter={ 2 }
                tooltip={ localize('All 3 account types use market execution. This means you agree with the broker\'s price in advance and will place orders at the broker\'s price.') }
            />
        ),
        standard : localize('Market'),
        advanced : localize('Market'),
        synthetic: localize('Market'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={ localize('Spread') }
                counter={ 3 }
                tooltip={ localize('The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker\'s absolute discretion.') }
            />
        ),
        standard : localize('Variable'),
        advanced : localize('Variable'),
        synthetic: localize('Fixed/Variable'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={ localize('Commission') }
                counter={ 4 }
                tooltip={ localize('Deriv charges no commission across all account types, except cryptocurrency accounts.') }
            />
        ),
        standard : localize('No'),
        advanced : localize('No'),
        synthetic: localize('No'),
    },
    {
        attribute: <MT5AttributeDescriber name={ localize('Minimum deposit') }/>,
        standard : localize('No'),
        advanced : localize('No'),
        synthetic: localize('No'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={ localize('Margin call') }
                counter={ 5 }
                tooltip={ localize('When the remaining funds in your account is deemed insufficient to cover the leverage or margin requirements, your account will be placed under margin call. To prevent a margin call escalating to a stop out level, you can deposit  additional funds into your account or close any open positions.') }
            />
        ),
        standard : localize('150%'),
        advanced : localize('150%'),
        synthetic: localize('100%'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={ localize('Stop out level') }
                counter={ 6 }
                tooltip={ localize('If your account reaches the stop out level, then your account will be in stop out state. Trading positions and orders on your account are forcibly closed until there are no more open positions or until your margin level increases above the stop out level.') }
            />
        ),
        standard : localize('75%'),
        advanced : localize('75%'),
        synthetic: localize('50%'),
    },
    {
        attribute: <MT5AttributeDescriber name={ localize('Number of assets') }/>,
        standard : localize('50+'),
        advanced : localize('50+'),
        synthetic: localize('10+'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={ localize('Cryptocurrency trading') }
                counter={ 7 }
                tooltip={ localize('Indicates the availability of cryptocurrency trading on a particular account.') }
            />
        ),
        standard : localize('24/7'),
        advanced : localize('N/A'),
        synthetic: localize('N/A'),
    },
];

const ModalContent = () => (
    <div className='mt5-compare-accounts'>
        <DataTable
            className='mt5-compare-accounts__data'
            data_source={ compareAccountsData }
            columns={ compareAccountsColumns }
            item_size={40}
        />
        <p className='mt5-compare-account--hint'>
            <Localize i18n_default_text='Note: At bank rollover, liquidity in the forex markets is reduced and may increase the spread and processing time for client orders. This happens around 21:00 GMT during daylight saving time, and 22:00 GMT non-daylight saving time.' />
        </p>
    </div>
);

class MT5Dashboard extends React.Component {
    render() {
        const {
            createMT5Account,
            disableApp,
            enableApp,
            is_compare_accounts_visible,
            is_first_time,
            toggleCompareAccounts,
        } = this.props;

        const CompareAccountsModal = () => (
            <div className='mt5-compare-accounts-modal__wrapper'>
                <Button
                    className='btn--tertiary--default mt5-dashboard__welcome-message--button'
                    has_effect
                    text={ localize('Compare accounts') }
                    onClick={ toggleCompareAccounts }
                />
                <React.Suspense fallback={<UILoader />}>
                    <Modal
                        className='mt5-dashboard__compare-accounts'
                        disableApp={ disableApp }
                        enableApp={ enableApp }
                        is_open={ is_compare_accounts_visible }
                        title={ localize('Compare accounts') }
                        toggleModal={ toggleCompareAccounts }
                        type='button'
                    >
                        <ModalContent />
                    </Modal>
                </React.Suspense>
            </div>
        );

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
                            <CompareAccountsModal />
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

export default connect(({ client, modules, ui }) => ({
    createMT5Account           : modules.mt5.createMT5Account,
    disableApp                 : ui.disableApp,
    enableApp                  : ui.enableApp,
    is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
    is_first_time              : client.is_logged_in, // TODO: this is a dummy observable, to be changed when MT5 related data available
    toggleCompareAccounts      : modules.mt5.toggleCompareAccountsModal,
}))(MT5Dashboard);
