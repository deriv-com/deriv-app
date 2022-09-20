import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import StaticCFDAccountManager from './static-cfd-account-manager';
import StaticPlatformLauncher from './static-platform-launcher';

import './static-dashboard.scss';

type TStaticDashboard = {
    amount?: string;
    loginid?: string;
    currency?: string;
    has_account?: boolean;
    is_text_animated?: boolean;
    is_button_animated?: boolean;
    is_cfd_item_blurry?: boolean;
    is_cfd_text_blurry?: boolean;
    is_options_item_blurry?: boolean;
    is_options_text_blurry?: boolean;
    has_applauncher_account?: boolean;
    is_platformlauncher_blurry?: boolean;
};

const StaticDashboard = ({
    amount,
    loginid,
    currency,
    has_account,
    is_text_animated,
    is_button_animated,
    is_cfd_item_blurry,
    is_cfd_text_blurry,
    is_options_item_blurry,
    is_options_text_blurry,
    has_applauncher_account,
    is_platformlauncher_blurry,
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
                            {localize('CFDs')}
                        </Text>
                        <Text as='p' size='xxs' color={is_cfd_text_blurry ? 'less-prominent' : 'prominent'}>
                            {localize(
                                'Trade with leverage and tight spreads for better returns on successful trades. Learn more'
                            )}
                        </Text>
                    </div>
                    <div className='static-dashboard-wrapper__body'>
                        <StaticCFDAccountManager
                            type='financial'
                            platform='mt5'
                            appname='Derived'
                            description='Trade CFDs on MT5 with forex, stocks & indices, commodities and cryptocurrencies.'
                            amount={amount}
                            loginid={loginid}
                            currency={currency}
                            has_account={has_account}
                            is_item_blurry={is_cfd_item_blurry}
                            is_button_animated={is_button_animated}
                        />
                        <StaticCFDAccountManager
                            type='synthetic'
                            platform='mt5'
                            appname='Financial'
                            description='Trade CFDs on MT5 with Derived indices that simulate areal-world market movement'
                            amount={amount}
                            loginid={loginid}
                            currency={currency}
                            has_account={has_account}
                            is_item_blurry={is_cfd_item_blurry}
                            is_button_animated={is_button_animated}
                        />
                        <StaticCFDAccountManager
                            type='all'
                            platform='dxtrade'
                            appname='Deriv X'
                            description='Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
                            amount={amount}
                            loginid={loginid}
                            currency={currency}
                            has_account={has_account}
                            is_item_blurry={is_cfd_item_blurry}
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
                        <Text as='p' size='xxs' color={is_options_text_blurry ? 'less-prominent' : 'prominent'}>
                            {localize(
                                'Earn fixed payouts by predicting price movements with Options, or combine the upside of CFDs with the simplicity of Options with Multipliers '
                            )}
                        </Text>
                    </div>
                    <div className='static-dashboard-wrapper__body'>
                        <StaticCFDAccountManager
                            type='all'
                            platform='options'
                            appname='Options account'
                            description='Get a real Options account, start trading and manage your funds.'
                            currency={currency}
                            has_account={has_account}
                            is_item_blurry={is_options_item_blurry}
                            is_button_animated={is_button_animated}
                        />
                    </div>
                    <Divider />

                    <div className='static-dashboard-wrapper__body--apps'>
                        <div>
                            <StaticPlatformLauncher
                                app_icon={`DTrader`}
                                app_title={'DTrader'}
                                app_desc={'Options & multipliers trading platform.'}
                                is_item_blurry={is_platformlauncher_blurry}
                                has_applauncher_account={has_applauncher_account}
                            />
                        </div>
                        <StaticPlatformLauncher
                            app_icon={`DBot`}
                            app_title={'DBot'}
                            app_desc={'Automate your trading, no coding needed.'}
                            is_item_blurry={is_platformlauncher_blurry}
                            has_applauncher_account={has_applauncher_account}
                        />
                        <StaticPlatformLauncher
                            app_icon={`SmartTrader`}
                            app_title={'SmartTrader'}
                            app_desc={'Our legacy options trading platform.'}
                            is_item_blurry={is_platformlauncher_blurry}
                            has_applauncher_account={has_applauncher_account}
                        />
                        <StaticPlatformLauncher
                            app_icon={`BinaryBot`}
                            app_title={'Binary Bot'}
                            app_desc={'Our legacy automated trading platform.'}
                            is_item_blurry={is_platformlauncher_blurry}
                            has_applauncher_account={has_applauncher_account}
                        />
                        <StaticPlatformLauncher
                            app_icon={`DerivGo`}
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
