import React from 'react';
import classNames from 'classnames';
import { Text, ButtonToggle, Icon } from '@deriv/components';
import { isMobile, isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import StaticCFDAccountManager from './static-cfd-account-manager';
import StaticPlatformLauncher from './static-platform-launcher';
import StaticAppLauncher from './static-applauncher';

import './static-dashboard.scss';

type TStaticDashboard = {
    loginid?: string;
    is_grey?: boolean;
    currency?: string;
    has_account?: boolean;
    is_last_step?: boolean;
    derived_amount?: string;
    is_get_blurry?: boolean;
    financial_amount?: string;
    is_icon_blurry?: boolean;
    is_trade_blurry?: boolean;
    is_topup_blurry?: boolean;
    is_text_animated?: boolean;
    is_trade_animated?: boolean;
    is_topup_animated?: boolean;
    is_button_animated?: boolean;
    is_cfd_item_blurry?: boolean;
    is_cfd_text_blurry?: boolean;
    is_options_item_blurry?: boolean;
    is_options_text_blurry?: boolean;
    is_derivx_last_step?: boolean;
    is_financial_last_step?: boolean;
    has_applauncher_account?: boolean;
    is_cfd_description_blurry?: boolean;
    is_platformlauncher_blurry?: boolean;
    is_options_description_blurry?: boolean;
};

const StaticDashboard = ({
    loginid,
    is_grey,
    currency,
    has_account,
    is_last_step,
    is_get_blurry,
    is_icon_blurry,
    is_topup_blurry,
    is_trade_blurry,
    financial_amount,
    is_text_animated,
    is_trade_animated,
    is_topup_animated,
    is_button_animated,
    is_cfd_item_blurry,
    is_cfd_text_blurry,
    is_derivx_last_step,
    is_financial_last_step,
    is_options_item_blurry,
    is_options_text_blurry,
    has_applauncher_account,
    is_cfd_description_blurry,
    is_platformlauncher_blurry,
    is_options_description_blurry,
}: TStaticDashboard) => {
    const Divider = () => <div className='divider' />;

    const toggle_options = [
        { text: 'CFDs', value: 'CFDs' },
        { text: 'Options', value: 'Options' },
    ];

    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const changeIndex = setInterval(() => {
            if (index === 0) {
                setIndex(1);
            } else {
                setIndex(0);
            }
        }, 5000);

        return () => clearInterval(changeIndex);
    }, [index]);
    return (
        <div className='static-dashboard'>
            <div className='static-dashboard-wrapper'>
                {(isDesktop() || (isMobile() && index === 0)) && (
                    <>
                        <div className='static-dashboard-wrapper__header'>
                            {isMobile() ? (
                                <ButtonToggle
                                    buttons_arr={toggle_options}
                                    className='static-dashboard-wrapper__header--toggle-account'
                                    has_rounded_button
                                    is_animated
                                    name='CFDs'
                                    value={'CFDs'}
                                />
                            ) : (
                                <Text
                                    as='h2'
                                    weight='bold'
                                    color={is_cfd_text_blurry ? 'less-prominent' : 'prominent'}
                                    className={is_text_animated ? 'static-dashboard-wrapper__header--animated' : ''}
                                >
                                    <Localize
                                        i18n_default_text='CFD <0>Compare accounts</0>'
                                        components={[
                                            <Text
                                                key={0}
                                                color={'red'}
                                                size='xxxs'
                                                weight='bold'
                                                className={classNames(
                                                    'static-dashboard-wrapper__header-compare-accounts',
                                                    {
                                                        'static-dashboard-wrapper__header-compare-accounts--blurry':
                                                            is_cfd_description_blurry,
                                                    }
                                                )}
                                            />,
                                        ]}
                                    />
                                </Text>
                            )}
                        </div>
                        <div className='static-dashboard-wrapper__description'>
                            <Text
                                as='p'
                                size='xxs'
                                color={is_cfd_text_blurry || is_cfd_description_blurry ? 'less-prominent' : 'prominent'}
                            >
                                <Localize
                                    i18n_default_text='Trade with leverage and tight spreads for better returns on successful trades. <0>Learn more</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            color={'red'}
                                            size='xxs'
                                            weight='bold'
                                            className={classNames('static-dashboard-wrapper__header--underlined', {
                                                'static-dashboard-wrapper__header-compare-accounts--blurry':
                                                    is_cfd_description_blurry,
                                            })}
                                        />,
                                    ]}
                                />
                            </Text>
                            {isMobile() && (
                                <Text
                                    color={'red'}
                                    size='xxs'
                                    weight='bold'
                                    className={classNames('static-dashboard-wrapper__header', {
                                        'static-dashboard-wrapper__header-compare-accounts--blurry':
                                            is_cfd_description_blurry,
                                    })}
                                >
                                    {localize('Compare accounts')}
                                </Text>
                            )}
                        </div>
                        <div className='static-dashboard-wrapper__body'>
                            <div>
                                <StaticCFDAccountManager
                                    type='synthetic'
                                    platform='mt5'
                                    appname='Derived'
                                    description='Trade CFDs on MT5 with forex, stocks & indices, commodities and cryptocurrencies.'
                                    loginid={loginid}
                                    currency={currency}
                                    has_account={has_account}
                                    is_get_blurry={is_get_blurry}
                                    is_icon_blurry={is_icon_blurry}
                                    is_topup_blurry={is_topup_blurry}
                                    is_trade_blurry={is_trade_blurry}
                                    is_item_blurry={is_cfd_item_blurry}
                                    is_trade_animated={is_trade_animated}
                                    is_topup_animated={is_topup_animated}
                                    is_button_animated={is_button_animated}
                                />
                                {has_account && (
                                    <div className='static-dashboard-wrapper__body--add-button'>
                                        <Icon
                                            icon='icAppstoreAddRounded'
                                            width='24'
                                            height='24'
                                            className='Add-Rounded'
                                        />
                                        <Text size='xs' className='static-dashboard-wrapper__body--add-button-text'>
                                            {localize('More derived accounts')}
                                        </Text>
                                    </div>
                                )}
                            </div>
                            <div>
                                <StaticCFDAccountManager
                                    type='financial'
                                    platform='mt5'
                                    appname='Financial'
                                    description='Trade CFDs on MT5 with Derived indices that simulate areal-world market movement'
                                    financial_amount={financial_amount}
                                    loginid={loginid}
                                    currency={currency}
                                    has_account={has_account}
                                    is_last_step={is_last_step}
                                    is_get_blurry={is_get_blurry}
                                    is_icon_blurry={is_icon_blurry}
                                    is_trade_blurry={is_trade_blurry}
                                    is_topup_blurry={is_topup_blurry}
                                    is_item_blurry={is_cfd_item_blurry}
                                    is_trade_animated={is_trade_animated}
                                    is_topup_animated={is_topup_animated}
                                    is_button_animated={is_button_animated}
                                    is_derivx_last_step={is_derivx_last_step}
                                    is_financial_last_step={is_financial_last_step}
                                />
                                {has_account && (
                                    <div className='static-dashboard-wrapper__body--add-button'>
                                        <Icon
                                            icon='icAppstoreAddRounded'
                                            width='24'
                                            height='24'
                                            className='Add-Rounded'
                                        />
                                        <Text size='xs' className='static-dashboard-wrapper__body--add-button-text'>
                                            {localize('More [account name] accounts')}
                                        </Text>
                                    </div>
                                )}
                            </div>
                            <div>
                                <StaticCFDAccountManager
                                    type='all'
                                    platform='dxtrade'
                                    appname='Deriv X'
                                    description='Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
                                    loginid={loginid}
                                    currency={currency}
                                    has_account={has_account}
                                    is_last_step={is_last_step}
                                    is_get_blurry={is_get_blurry}
                                    is_icon_blurry={is_icon_blurry}
                                    is_topup_blurry={is_topup_blurry}
                                    is_trade_blurry={is_trade_blurry}
                                    is_item_blurry={is_cfd_item_blurry}
                                    is_trade_animated={is_trade_animated}
                                    is_topup_animated={is_topup_animated}
                                    is_button_animated={is_button_animated}
                                    is_derivx_last_step={is_derivx_last_step}
                                    is_financial_last_step={is_financial_last_step}
                                />
                            </div>
                        </div>
                    </>
                )}
                {!isMobile() && <Divider />}

                {(isDesktop() || (isMobile() && index === 1)) && (
                    <>
                        <div className='static-dashboard-wrapper__header'>
                            {isMobile() ? (
                                <ButtonToggle
                                    buttons_arr={toggle_options}
                                    className='static-dashboard-wrapper__header--toggle-account'
                                    has_rounded_button
                                    is_animated
                                    name='Options'
                                    value={'Options'}
                                />
                            ) : (
                                <Text
                                    as='h2'
                                    weight='bold'
                                    color={is_options_text_blurry ? 'less-prominent' : 'prominent'}
                                    className={is_text_animated ? 'static-dashboard-wrapper__header--animated' : ''}
                                >
                                    {localize('Options')}
                                </Text>
                            )}
                        </div>
                        <div className='static-dashboard-wrapper__description'>
                            <Text
                                as='p'
                                size='xxs'
                                color={
                                    is_options_text_blurry || is_options_description_blurry
                                        ? 'less-prominent'
                                        : 'prominent'
                                }
                            >
                                <Localize
                                    i18n_default_text='Earn fixed payouts by predicting price movements with <0>Options</0>, or combine the upside of CFDs with the simplicity of Options with <1>Multipliers</1> '
                                    components={[
                                        <Text
                                            key={0}
                                            size='xs'
                                            color='red'
                                            className='static-dashboard-wrapper__header--underlined'
                                        />,
                                        <Text
                                            key={1}
                                            size='xs'
                                            color='red'
                                            className='static-dashboard-wrapper__header--underlined'
                                        />,
                                    ]}
                                />
                            </Text>
                        </div>
                        <div className='static-dashboard-wrapper__body'>
                            {!has_applauncher_account ? (
                                <StaticCFDAccountManager
                                    type='all'
                                    platform='options'
                                    appname='Options account'
                                    description='Get a real Options account, start trading and manage your funds.'
                                    currency={currency}
                                    has_account={has_account}
                                    is_get_blurry={is_get_blurry}
                                    is_icon_blurry={is_icon_blurry}
                                    is_topup_blurry={is_topup_blurry}
                                    is_trade_blurry={is_trade_blurry}
                                    is_trade_animated={is_trade_animated}
                                    is_topup_animated={is_topup_animated}
                                    is_item_blurry={is_options_item_blurry}
                                    is_button_animated={is_button_animated}
                                />
                            ) : (
                                <div
                                    className={classNames('static-dashboard-wrapper__body', {
                                        'static-dashboard-wrapper__body--grey': is_grey,
                                    })}
                                >
                                    {!isMobile() ? (
                                        <React.Fragment>
                                            <StaticAppLauncher icon_type={'USD'} is_grey />
                                            <StaticAppLauncher icon_type={'Bitcoin'} />
                                            <StaticAppLauncher icon_type={'Ethereum'} />
                                            <StaticAppLauncher icon_type={'Litecoin'} />
                                            <div className='Add-Square'>
                                                <Icon icon='icAppstoreAddSquare' width='36' height='36' />
                                            </div>
                                        </React.Fragment>
                                    ) : (
                                        <div className={classNames('static-dashboard-wrapper__body--with-add')}>
                                            <StaticAppLauncher icon_type={'USD'} is_grey />
                                            <div className='Add-Square'>
                                                <Icon icon='icAppstoreAddSquare' width='36' height='36' />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {!has_applauncher_account && <Divider />}

                        <div className='static-dashboard-wrapper__body--apps'>
                            <StaticPlatformLauncher
                                is_grey={is_grey}
                                app_icon={`DTrader`}
                                app_title={'DTrader'}
                                app_desc={'Options & multipliers trading platform.'}
                                is_item_blurry={is_platformlauncher_blurry}
                                has_applauncher_account={has_applauncher_account}
                            />
                            <StaticPlatformLauncher
                                is_grey={is_grey}
                                app_icon={`DBot`}
                                app_title={'DBot'}
                                app_desc={'Automate your trading, no coding needed.'}
                                is_item_blurry={is_platformlauncher_blurry}
                                has_applauncher_account={has_applauncher_account}
                            />
                            <StaticPlatformLauncher
                                is_grey={is_grey}
                                app_icon={`SmartTraderBlue`}
                                app_title={'SmartTrader'}
                                app_desc={'Our legacy options trading platform.'}
                                is_item_blurry={is_platformlauncher_blurry}
                                has_applauncher_account={has_applauncher_account}
                            />
                            <StaticPlatformLauncher
                                is_grey={is_grey}
                                app_icon={`BinaryBotBlue`}
                                app_title={'Binary Bot'}
                                app_desc={'Our legacy automated trading platform.'}
                                is_item_blurry={is_platformlauncher_blurry}
                                has_applauncher_account={has_applauncher_account}
                            />
                            <StaticPlatformLauncher
                                is_grey={is_grey}
                                app_icon={`DerivGoBlack`}
                                app_title={'Deriv Go'}
                                app_desc={'Trade on the go with our mobile app.'}
                                is_item_blurry={is_platformlauncher_blurry}
                                has_applauncher_account={has_applauncher_account}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StaticDashboard;
