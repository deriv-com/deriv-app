import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import StaticCFDAccountManager from './static-cfd-account-manager';
import AppLauncher from 'Components/app-launcher/app-launcher';
import PlatformLauncher from 'Components/platform-launcher';

import './static-dashboard.scss';

const StaticDashboard = () => {
    const Divider = () => <div className='divider' />;
    return (
        <DesktopWrapper>
            <div className='static-dashboard'>
                <div className='static-dashboard-wrapper'>
                    <div className='static-dashboard-wrapper__header'>
                        <Text as='h2' weight='bold'>
                            {localize('CFDs')}
                        </Text>
                        <Text as='p' size='xxs'>
                            {localize(
                                'Trade with leverage and tight spreads for better returns on successful trades. Learn more'
                            )}
                        </Text>
                    </div>
                    <div className='static-dashboard-wrapper__body'>
                        <StaticCFDAccountManager
                            is_blurry
                            type='financial'
                            platform='mt5'
                            appname='Derived'
                            description='Trade CFDs on MT5 with forex, stocks & indices, commodities and cryptocurrencies.'
                        />
                        <StaticCFDAccountManager
                            type='synthetic'
                            platform='mt5'
                            appname='Financial'
                            description='Trade CFDs on MT5 with Derived indices that simulate areal-world market movement'
                        />
                        <StaticCFDAccountManager
                            type='all'
                            platform='dxtrade'
                            appname='Deriv X'
                            description='Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
                        />
                    </div>
                    <Divider />

                    <div className='static-dashboard-wrapper__header'>
                        <Text as='h2' weight='bold'>
                            {localize('Options')}
                        </Text>
                        <Text as='p' size='xxs'>
                            {localize(
                                'Earn fixed payouts by predicting price movements with Options, or combine the upside of CFDs with the simplicity of Options with Multipliers '
                            )}
                        </Text>
                    </div>
                    <div className='static-dashboard-wrapper__body'>
                        <AppLauncher
                            icon_name={'IcAppstoreOptions'}
                            app_name={'Dxtrader'}
                            jurisdiction={'SVG'}
                            is_app_installed={false}
                        />
                    </div>
                    <Divider />

                    <div className='static-dashboard-wrapper__body--apps'>
                        <PlatformLauncher
                            app_icon={`DTrader`}
                            app_title={'DTrader'}
                            app_desc={'Options & multipliers trading platform.'}
                        />
                        <PlatformLauncher
                            app_icon={`DBot`}
                            app_title={'DBot'}
                            app_desc={'Automate your trading, no coding needed.'}
                        />
                        <PlatformLauncher
                            app_icon={`SmartTrader`}
                            app_title={'SmartTrader'}
                            app_desc={'Our legacy options trading platform.'}
                        />
                        <PlatformLauncher
                            app_icon={`BinaryBot`}
                            app_title={'Binary Bot'}
                            app_desc={'Our legacy automated trading platform.'}
                        />
                        <PlatformLauncher
                            app_icon={`DerivGo`}
                            app_title={'Deriv Go'}
                            app_desc={'Trade on the go with our mobile app.'}
                        />
                    </div>
                </div>
            </div>
        </DesktopWrapper>
    );
};

export default StaticDashboard;
