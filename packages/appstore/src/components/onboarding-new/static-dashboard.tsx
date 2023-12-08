import React from 'react';
import classNames from 'classnames';

import { Button, ButtonToggle, Text, ThemedScrollbars } from '@deriv/components';
import { ContentFlag, isDesktop, isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

import BalanceText from 'Components/elements/text/balance-text';

import StaticCFDAccountManager from './static-cfd-account-manager';
import StaticCurrencySwitcherContainer from './static-currency-switcher-container';
import StaticGetMoreAccounts from './static-get-more-accounts';
import StaticTradingAppCard from './static-trading-app-card';

import './static-dashboard.scss';

export type TStaticDashboard = {
    loginid?: string;
    is_grey?: boolean;
    currency?: string;
    mf_currency?: string;
    has_account?: boolean;
    is_last_step?: boolean;
    derived_amount?: string;
    financial_amount?: string;
    is_blurry: {
        icon: boolean;
        item: boolean;
        text: boolean;
        get: boolean;
        topup: boolean;
        trade: boolean;
        cfd_item: boolean;
        cfd_text: boolean;
        options_item: boolean;
        options_text: boolean;
        cfd_description: boolean;
        options_description: boolean;
        platformlauncher: boolean;
    };
    is_onboarding_animated: {
        text: boolean;
        trade: boolean;
        topup: boolean;
        button: boolean;
        get: boolean;
    };
    is_derivx_last_step?: boolean;
    is_financial_last_step?: boolean;
    has_applauncher_account?: boolean;
};

const StaticDashboard = observer(
    ({
        currency,
        mf_currency,
        financial_amount,
        derived_amount,
        has_account,
        has_applauncher_account,
        is_blurry,
        is_derivx_last_step,
        is_financial_last_step,
        is_last_step,
        is_onboarding_animated,
        loginid,
    }: TStaticDashboard) => {
        const { client, traders_hub } = useStore();
        const { content_flag, CFDs_restricted_countries, financial_restricted_countries } = traders_hub;
        const { is_eu_country, is_logged_in } = client;
        const eu_user =
            content_flag === ContentFlag.LOW_RISK_CR_EU ||
            content_flag === ContentFlag.EU_REAL ||
            content_flag === ContentFlag.EU_DEMO;
        const is_eu_user = (is_logged_in && eu_user) || (!is_logged_in && is_eu_country);

        const [index, setIndex] = React.useState<number>(is_eu_user ? 1 : 0);

        const Divider = () => <div className='divider' />;

        const getToggleOptions = () => [
            { text: is_eu_user ? localize('Multipliers') : localize('Options & Multipliers'), value: 0 },
            { text: localize('CFDs'), value: 1 },
        ];
        const toggle_options = getToggleOptions();
        const toggle_options_eu = getToggleOptions().reverse();

        React.useEffect(() => {
            const change_index_interval_id = setInterval(() => {
                if (isMobile()) {
                    if (index === 0) {
                        setIndex(1);
                    } else {
                        setIndex(0);
                    }
                }
            }, 5000);
            return () => clearInterval(change_index_interval_id);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [index]);

        const is_eu_title = eu_user ? localize('Multipliers') : localize('Options & Multipliers');
        const is_eu_account_title = eu_user ? localize('Multipliers account') : localize('Deriv account');
        const compare_accounts_title = eu_user ? localize('Account Information') : localize('Compare accounts');

        return (
            <ThemedScrollbars height={'calc(100% - 25rem)'} is_bypassed={isMobile()}>
                <div
                    data-testid='dt_onboarding_dashboard'
                    className={classNames('static-dashboard', {
                        'static-dashboard--eu': eu_user,
                    })}
                >
                    {(isDesktop() || (isMobile() && index === 0)) && (
                        <div className='static-dashboard-wrapper__bordered--with-margin'>
                            <div className='static-dashboard-wrapper__header-and-description'>
                                <div
                                    className={classNames('static-dashboard-wrapper__header', {
                                        'static-dashboard-wrapper__header--limited-width': has_account,
                                    })}
                                >
                                    {isMobile() ? (
                                        <React.Fragment>
                                            <ButtonToggle
                                                buttons_arr={is_eu_user ? toggle_options_eu : toggle_options}
                                                className='static-dashboard-wrapper__header--toggle-account'
                                                has_rounded_button
                                                is_animated
                                                onChange={(item: React.ChangeEvent<HTMLInputElement>) => {
                                                    setIndex(Number(item.target.value));
                                                }}
                                                name='Options'
                                                value={index}
                                            />
                                        </React.Fragment>
                                    ) : (
                                        <Text
                                            as='h2'
                                            weight='bold'
                                            color={is_blurry.options_text ? 'less-prominent' : 'prominent'}
                                            className={
                                                is_onboarding_animated.text
                                                    ? 'static-dashboard-wrapper__header--animated'
                                                    : 'static-dashboard-wrapper__header--normal'
                                            }
                                        >
                                            {is_eu_title}
                                        </Text>
                                    )}
                                    <div className='static-dashboard-wrapper__description'>
                                        <Text
                                            as='p'
                                            size='xxs'
                                            color={
                                                is_blurry.options_text || is_blurry.options_description
                                                    ? 'less-prominent'
                                                    : 'general'
                                            }
                                        >
                                            {eu_user ? (
                                                <Localize
                                                    i18n_default_text='Get the upside of CFDs without risking more than your initial stake with <0>Multipliers</0>.'
                                                    components={[
                                                        <Text
                                                            key={0}
                                                            size='xs'
                                                            color='red'
                                                            className={classNames(
                                                                'static-dashboard-wrapper__header--underlined',
                                                                {
                                                                    'static-dashboard-wrapper__header--underlined--blurry':
                                                                        is_blurry.options_description,
                                                                }
                                                            )}
                                                        />,
                                                    ]}
                                                />
                                            ) : (
                                                <Localize
                                                    i18n_default_text='Earn a range of payouts by correctly predicting market movements with <0>options</0>, or get the upside of CFDs without risking more than your initial stake with <1>multipliers</1>.'
                                                    components={[
                                                        <Text
                                                            key={0}
                                                            size='xs'
                                                            line_height='xl'
                                                            color='red'
                                                            className={classNames(
                                                                'static-dashboard-wrapper__header--underlined',
                                                                {
                                                                    'static-dashboard-wrapper__header--underlined--blurry':
                                                                        is_blurry.options_description,
                                                                }
                                                            )}
                                                        />,
                                                        <Text
                                                            key={1}
                                                            size='xs'
                                                            color='red'
                                                            className={classNames(
                                                                'static-dashboard-wrapper__header--underlined',
                                                                {
                                                                    'static-dashboard-wrapper__header--underlined--blurry':
                                                                        is_blurry.options_description,
                                                                }
                                                            )}
                                                        />,
                                                    ]}
                                                />
                                            )}
                                        </Text>
                                    </div>
                                </div>
                                {has_account && (
                                    <StaticCurrencySwitcherContainer
                                        title={
                                            <Text size='xs' line_height='s'>
                                                {eu_user ? localize(`EUR`) : localize(`US Dollar`)}
                                            </Text>
                                        }
                                        icon={eu_user ? 'EUR' : 'USD'}
                                        actions={
                                            <Button
                                                secondary
                                                className={classNames('', {
                                                    'static-dashboard--deposit-button-animated':
                                                        is_onboarding_animated.topup,
                                                    'static-dashboard--deposit-button-blurry': is_blurry.topup,
                                                })}
                                            >
                                                {localize('Deposit')}
                                            </Button>
                                        }
                                    >
                                        <BalanceText currency={eu_user ? 'EUR' : 'USD'} balance={0} size='xs' />
                                    </StaticCurrencySwitcherContainer>
                                )}
                            </div>
                            <div className='static-dashboard-wrapper__body'>
                                {!has_applauncher_account && (
                                    <StaticCFDAccountManager
                                        type='all'
                                        platform='options'
                                        appname={is_eu_account_title}
                                        description={localize(
                                            'Get a real Deriv account, start trading and manage your funds.'
                                        )}
                                        currency={currency}
                                        has_account={has_account}
                                        is_blurry={is_blurry}
                                        is_onboarding_animated={is_onboarding_animated}
                                        is_eu_user={is_eu_user}
                                    />
                                )}
                                {isMobile() && <Divider />}
                            </div>

                            <div
                                className={classNames('static-dashboard-wrapper__body--apps', {
                                    'static-dashboard-wrapper__body--apps--eu': is_eu_user,
                                    'static-dashboard-wrapper__body--apps--with-gap': has_account,
                                })}
                            >
                                <div className='static-dashboard-wrapper__body--apps-item'>
                                    <StaticTradingAppCard
                                        icon='DTrader'
                                        name='Deriv Trader'
                                        description={
                                            eu_user
                                                ? localize('Multipliers trading platform.')
                                                : localize('Options and multipliers trading platform.')
                                        }
                                        availability='All'
                                        has_applauncher_account={has_applauncher_account}
                                        is_item_blurry={is_blurry.platformlauncher}
                                        has_divider={!eu_user && !financial_restricted_countries}
                                        is_animated={is_onboarding_animated.button}
                                    />
                                </div>

                                {!eu_user && !financial_restricted_countries && (
                                    <React.Fragment>
                                        <div className='static-dashboard-wrapper__body--apps-item'>
                                            <StaticTradingAppCard
                                                icon='DBot'
                                                name='Deriv Bot'
                                                description={localize('Automate your trading, no coding needed.')}
                                                availability='Non-EU'
                                                has_applauncher_account={has_applauncher_account}
                                                is_item_blurry={is_blurry.platformlauncher}
                                                is_animated={is_onboarding_animated.button}
                                                has_divider
                                            />
                                        </div>
                                        <div className='static-dashboard-wrapper__body--apps-item'>
                                            <StaticTradingAppCard
                                                icon='SmartTrader'
                                                name='SmartTrader'
                                                description={localize('Automate your trading, no coding needed.')}
                                                availability='Non-EU'
                                                has_applauncher_account={has_applauncher_account}
                                                is_item_blurry={is_blurry.platformlauncher}
                                                is_animated={is_onboarding_animated.button}
                                                has_divider
                                            />
                                        </div>
                                        <div className='static-dashboard-wrapper__body--apps-item'>
                                            <StaticTradingAppCard
                                                icon='BinaryBot'
                                                name='BinaryBot'
                                                description={localize('Our legacy automated trading platform.')}
                                                availability='Non-EU'
                                                has_applauncher_account={has_applauncher_account}
                                                is_item_blurry={is_blurry.platformlauncher}
                                                is_animated={is_onboarding_animated.button}
                                            />
                                        </div>
                                        <div className='static-dashboard-wrapper__body--apps-item'>
                                            <StaticTradingAppCard
                                                icon='DerivGo'
                                                name='Deriv GO'
                                                description={localize('Trade on the go with our mobile app.')}
                                                availability='Non-EU'
                                                has_applauncher_account={has_applauncher_account}
                                                is_item_blurry={is_blurry.platformlauncher}
                                                is_animated={is_onboarding_animated.button}
                                            />
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    )}

                    {(isDesktop() || (isMobile() && index === 1)) && (
                        <div className='static-dashboard-wrapper__bordered'>
                            <div className='static-dashboard-wrapper__header'>
                                {isMobile() ? (
                                    <React.Fragment>
                                        <ButtonToggle
                                            buttons_arr={is_eu_user ? toggle_options_eu : toggle_options}
                                            className='static-dashboard-wrapper__header--toggle-account'
                                            has_rounded_button
                                            is_animated
                                            onChange={(item: React.ChangeEvent<HTMLInputElement>) => {
                                                setIndex(Number(item.target.value));
                                            }}
                                            name='CFDs'
                                            value={index}
                                        />
                                    </React.Fragment>
                                ) : (
                                    <Text
                                        as='h2'
                                        weight='bold'
                                        color={is_blurry.cfd_text ? 'less-prominent' : 'prominent'}
                                        className={
                                            is_onboarding_animated.text
                                                ? 'static-dashboard-wrapper__header--animated'
                                                : 'static-dashboard-wrapper__header--normal'
                                        }
                                    >
                                        <Localize
                                            i18n_default_text='CFDs <0>{{compare_accounts_title}}</0>'
                                            values={{ compare_accounts_title }}
                                            components={[
                                                <Text
                                                    key={0}
                                                    color='red'
                                                    size='xxxs'
                                                    weight='bold'
                                                    className={classNames(
                                                        'static-dashboard-wrapper__header-compare-accounts',
                                                        {
                                                            'static-dashboard-wrapper__header-compare-accounts--blurry':
                                                                is_blurry.cfd_description || is_blurry.cfd_text,
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
                                    color={
                                        is_blurry.cfd_text || is_blurry.cfd_description ? 'less-prominent' : 'general'
                                    }
                                >
                                    <Localize
                                        i18n_default_text='Trade with leverage and tight spreads for better returns on successful trades. <0>Learn more</0>'
                                        components={[
                                            <Text
                                                key={0}
                                                color='red'
                                                size='xxs'
                                                line_height='xl'
                                                weight='bold'
                                                className={classNames('static-dashboard-wrapper__header--underlined', {
                                                    'static-dashboard-wrapper__header-compare-accounts--blurry':
                                                        is_blurry.cfd_description || is_blurry.cfd_text,
                                                })}
                                            />,
                                        ]}
                                    />
                                </Text>
                            </div>

                            {isMobile() && (
                                <Text
                                    color={'red'}
                                    size='xxs'
                                    weight='bold'
                                    className={classNames('static-dashboard-wrapper__header', {
                                        'static-dashboard-wrapper__header-compare-accounts--blurry':
                                            is_blurry.cfd_description || is_blurry.cfd_text,
                                    })}
                                >
                                    {compare_accounts_title}
                                </Text>
                            )}

                            <div className='static-dashboard-wrapper__body--header'>
                                <Text
                                    as='h2'
                                    weight='bold'
                                    size='xs'
                                    color={
                                        is_blurry.cfd_text || is_blurry.cfd_description ? 'less-prominent' : 'prominent'
                                    }
                                >
                                    {localize('Deriv MT5')}
                                </Text>
                            </div>

                            <div className='static-dashboard-wrapper__body'>
                                {!is_eu_user && !financial_restricted_countries && (
                                    <StaticCFDAccountManager
                                        type='synthetic'
                                        platform='mt5'
                                        appname={localize('Derived')}
                                        description={localize('This account offers CFDs on derived instruments.')}
                                        loginid={loginid}
                                        currency={currency}
                                        has_account={has_account}
                                        derived_amount={derived_amount}
                                        financial_amount={financial_amount}
                                        is_blurry={is_blurry}
                                        is_onboarding_animated={is_onboarding_animated}
                                        is_eu_user={is_eu_user}
                                    />
                                )}
                                {isMobile() && !has_account && <Divider />}
                                {is_eu_user && !financial_restricted_countries && (
                                    <StaticCFDAccountManager
                                        type='financial'
                                        platform='mt5'
                                        appname={localize('CFDs')}
                                        description={localize(
                                            'This MFSA-regulated account offers CFDs on derived and financial instruments.'
                                        )}
                                        loginid={loginid}
                                        currency={is_eu_user ? mf_currency : currency}
                                        has_account={has_account}
                                        derived_amount={derived_amount}
                                        financial_amount={is_eu_user ? '0.00' : financial_amount}
                                        is_blurry={is_blurry}
                                        is_onboarding_animated={is_onboarding_animated}
                                        is_eu_user={is_eu_user}
                                    />
                                )}

                                {!is_eu_user && !CFDs_restricted_countries && (
                                    <React.Fragment>
                                        <StaticCFDAccountManager
                                            type='financial'
                                            platform='mt5'
                                            appname={localize('Financial')}
                                            description={localize('This account offers CFDs on financial instruments.')}
                                            financial_amount={financial_amount}
                                            derived_amount={derived_amount}
                                            loginid={loginid}
                                            currency={currency}
                                            has_account={has_account}
                                            is_last_step={is_last_step}
                                            is_blurry={is_blurry}
                                            is_onboarding_animated={is_onboarding_animated}
                                            is_financial_last_step={is_financial_last_step}
                                            is_eu_user={is_eu_user}
                                        />
                                        {isMobile() && !has_account && <Divider />}
                                        {!financial_restricted_countries && (
                                            <StaticCFDAccountManager
                                                type='swap_free'
                                                platform='mt5'
                                                appname={localize('Swap-Free')}
                                                description={localize(
                                                    'Trade swap-free CFDs on MT5 with forex, stocks, stock indices, commodities cryptocurrencies, ETFs and synthetic indices.'
                                                )}
                                                financial_amount={financial_amount}
                                                derived_amount={derived_amount}
                                                loginid={loginid}
                                                currency={currency}
                                                has_account={has_account}
                                                is_last_step={is_last_step}
                                                is_blurry={is_blurry}
                                                is_onboarding_animated={is_onboarding_animated}
                                                is_financial_last_step={is_financial_last_step}
                                                is_eu_user={is_eu_user}
                                            />
                                        )}
                                    </React.Fragment>
                                )}
                                {isDesktop() && has_account && !eu_user && (
                                    <StaticGetMoreAccounts
                                        icon='IcAppstoreGetMoreAccounts'
                                        title={localize('Get more')}
                                        description={localize(
                                            'Get more Deriv MT5 account with different type and jurisdiction.'
                                        )}
                                    />
                                )}
                            </div>

                            {!is_eu_user && !CFDs_restricted_countries && !financial_restricted_countries && (
                                <React.Fragment>
                                    <Divider />
                                    <div className='static-dashboard-wrapper__body--header'>
                                        <Text
                                            as='h2'
                                            weight='bold'
                                            size='xs'
                                            color={
                                                is_blurry.cfd_text || is_blurry.cfd_description
                                                    ? 'less-prominent'
                                                    : 'prominent'
                                            }
                                        >
                                            {localize('Deriv cTrader')}
                                        </Text>
                                    </div>
                                </React.Fragment>
                            )}

                            {!is_eu_user && !CFDs_restricted_countries && !financial_restricted_countries && (
                                <div className='static-dashboard-wrapper__body'>
                                    <StaticCFDAccountManager
                                        type='all'
                                        platform='ctrader'
                                        appname={localize('Deriv cTrader')}
                                        description={localize(
                                            'This account offers CFDs on a feature-rich trading platform.'
                                        )}
                                        loginid={loginid}
                                        currency={currency}
                                        has_account={has_account}
                                        is_last_step={is_last_step}
                                        is_blurry={is_blurry}
                                        is_onboarding_animated={is_onboarding_animated}
                                        is_derivx_last_step={is_derivx_last_step}
                                        is_financial_last_step={is_financial_last_step}
                                        is_eu_user={is_eu_user}
                                    />
                                </div>
                            )}

                            {!is_eu_user && !CFDs_restricted_countries && !financial_restricted_countries && (
                                <React.Fragment>
                                    <Divider />
                                    <div className='static-dashboard-wrapper__body--header'>
                                        <Text
                                            as='h2'
                                            weight='bold'
                                            size='xs'
                                            color={
                                                is_blurry.cfd_text || is_blurry.cfd_description
                                                    ? 'less-prominent'
                                                    : 'prominent'
                                            }
                                        >
                                            {localize('Other CFD Platforms')}
                                        </Text>
                                    </div>
                                </React.Fragment>
                            )}
                            {!is_eu_user && !CFDs_restricted_countries && !financial_restricted_countries && (
                                <div className='static-dashboard-wrapper__body'>
                                    <StaticCFDAccountManager
                                        type='all'
                                        platform='dxtrade'
                                        appname={localize('Deriv X')}
                                        description={localize(
                                            'This account offers CFDs on a highly customisable CFD trading platform.'
                                        )}
                                        loginid={loginid}
                                        currency={currency}
                                        has_account={has_account}
                                        is_last_step={is_last_step}
                                        is_blurry={is_blurry}
                                        is_onboarding_animated={is_onboarding_animated}
                                        is_derivx_last_step={is_derivx_last_step}
                                        is_financial_last_step={is_financial_last_step}
                                        is_eu_user={is_eu_user}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </ThemedScrollbars>
        );
    }
);

export default StaticDashboard;
