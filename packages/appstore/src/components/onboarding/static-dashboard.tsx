import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import StaticCFDAccountManager from './static-cfd-account-manager';
import StaticPlatformLauncher from './static-platform-launcher';
import StaticAppLauncher from './static-applauncher';

import './static-dashboard.scss';
import classNames from 'classnames';

type TStaticDashboard = {
    loginid?: string;
    is_grey?: boolean;
    currency?: string;
    has_account?: boolean;
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
    is_options_item_blurry,
    is_options_text_blurry,
    has_applauncher_account,
    is_cfd_description_blurry,
    is_platformlauncher_blurry,
    is_options_description_blurry,
}: TStaticDashboard) => {
    const Divider = () => <div className='divider' />;
    return (
        <DesktopWrapper>
            <div className='static-dashboard'>
                <div className='static-dashboard-wrapper'>
                    <div className='static-dashboard-wrapper__header'>
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
                                        className={classNames('static-dashboard-wrapper__header-compare-accounts', {
                                            'static-dashboard-wrapper__header-compare-accounts--blurry':
                                                is_cfd_description_blurry,
                                        })}
                                    />,
                                ]}
                            />
                        </Text>
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
                    </div>
                    <div className='static-dashboard-wrapper__body'>
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
                        <StaticCFDAccountManager
                            type='financial'
                            platform='mt5'
                            appname='Financial'
                            description='Trade CFDs on MT5 with Derived indices that simulate areal-world market movement'
                            financial_amount={financial_amount}
                            loginid={loginid}
                            currency={currency}
                            has_account={has_account}
                            is_get_blurry={is_get_blurry}
                            is_icon_blurry={is_icon_blurry}
                            is_trade_blurry={is_trade_blurry}
                            is_topup_blurry={is_topup_blurry}
                            is_item_blurry={is_cfd_item_blurry}
                            is_trade_animated={is_trade_animated}
                            is_topup_animated={is_topup_animated}
                            is_button_animated={is_button_animated}
                        />
                        <StaticCFDAccountManager
                            type='all'
                            platform='dxtrade'
                            appname='Deriv X'
                            description='Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
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
                    </div>
                    <Divider />

                    <div className='static-dashboard-wrapper__header'>
                        <Text
                            as='h2'
                            weight='bold'
                            color={is_options_text_blurry ? 'less-prominent' : 'prominent'}
                            className={is_text_animated ? 'static-dashboard-wrapper__header--animated' : ''}
                        >
                            {localize('Options')}
                        </Text>
                    </div>
                    <div className='static-dashboard-wrapper__description'>
                        <Text
                            as='p'
                            size='xxs'
                            color={
                                is_options_text_blurry || is_options_description_blurry ? 'less-prominent' : 'prominent'
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
                            <>
                                <StaticAppLauncher icon_type={'USD'} is_grey />
                                <StaticAppLauncher icon_type={'Bitcoin'} />
                                <StaticAppLauncher icon_type={'Ethereum'} />
                                <StaticAppLauncher icon_type={'Litecoin'} />
                            </>
                        )}
                    </div>
                    {!has_applauncher_account && <Divider />}

                    <div className='static-dashboard-wrapper__body--apps'>
                        <div>
                            <StaticPlatformLauncher
                                is_grey={is_grey}
                                app_icon={`DTrader`}
                                app_title={'DTrader'}
                                app_desc={'Options & multipliers trading platform.'}
                                is_item_blurry={is_platformlauncher_blurry}
                                has_applauncher_account={has_applauncher_account}
                            />
                        </div>
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
                </div>
            </div>
        </DesktopWrapper>
    );
};

export default StaticDashboard;
