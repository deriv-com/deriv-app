import React from 'react';
import { useStores } from 'Stores';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
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

const StaticDashboard = ({
    currency,
    mf_currency,
    financial_amount,
    derived_amount,
    has_account,
    has_applauncher_account,
    is_blurry,
    is_derivx_last_step,
    is_financial_last_step,
    is_grey,
    is_last_step,
    is_onboarding_animated,
    loginid,
}: TStaticDashboard) => {
    const Divider = () => <div className='divider' />;

    const { client } = useStores();
    const { is_eu, is_eu_country, is_logged_in } = client;

    const is_eu_user = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);
    const toggle_options = [
        { text: 'CFDs', value: 0 },
        { text: `${is_eu_user ? 'Multipliers' : 'Options and...'}`, value: 1 },
    ];

    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const change_index_interval_id = setInterval(() => {
            if (index === 0) {
                setIndex(1);
            } else {
                setIndex(0);
            }
        }, 5000);

        return () => clearInterval(change_index_interval_id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    const is_eu_title = is_eu_user ? localize('Multipliers') : localize('Options and Multipliers');
    const is_eu_account_title = is_eu_user ? 'Multipliers account' : 'Options and Multipliers account';
    const compare_accounts_title = is_eu_user ? localize('Account Information') : localize('Compare accounts');

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
                                    onChange={(item: { target: { text: string; value: number } }) => {
                                        setIndex(item.target.value);
                                    }}
                                    name='CFDs'
                                    value={index}
                                />
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
                                                color={'red'}
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
                                color={is_blurry.cfd_text || is_blurry.cfd_description ? 'less-prominent' : 'prominent'}
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
                                                    is_blurry.cfd_description || is_blurry.cfd_text,
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
                                            is_blurry.cfd_description || is_blurry.cfd_text,
                                    })}
                                >
                                    {compare_accounts_title}
                                </Text>
                            )}
                        </div>
                        <div className='static-dashboard-wrapper__body'>
                            {!is_eu_user && (
                                <div>
                                    <StaticCFDAccountManager
                                        type='synthetic'
                                        platform='mt5'
                                        appname={has_account ? 'Derived SVG' : 'Derived'}
                                        description='Trade CFDs on Deriv MT5 with Derived indices that simulate real-world market movements.'
                                        loginid={loginid}
                                        currency={currency}
                                        has_account={has_account}
                                        derived_amount={derived_amount}
                                        financial_amount={financial_amount}
                                        is_blurry={is_blurry}
                                        is_onboarding_animated={is_onboarding_animated}
                                        is_eu_user={is_eu_user}
                                    />
                                    {has_account && (
                                        <div className='static-dashboard-wrapper__body--add-button'>
                                            <Icon
                                                icon='icAppstoreAddRounded'
                                                width='24'
                                                height='24'
                                                className='Add-Rounded'
                                            />
                                            <Text
                                                size='xs'
                                                color='less-prominent'
                                                className='static-dashboard-wrapper__body--add-button-text'
                                            >
                                                {localize('More derived accounts')}
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            )}
                            {is_eu_user && (
                                <div>
                                    <StaticCFDAccountManager
                                        type='financial'
                                        platform='mt5'
                                        appname={'CFDs'}
                                        description='Trade CFDs on forex, stocks, stock indices, synthetics, cryptocurrencies, and commodities with leverage.'
                                        loginid={loginid}
                                        currency={is_eu_user ? mf_currency : currency}
                                        has_account={has_account}
                                        derived_amount={derived_amount}
                                        financial_amount={is_eu_user ? '0.00' : financial_amount}
                                        is_blurry={is_blurry}
                                        is_onboarding_animated={is_onboarding_animated}
                                        is_eu_user={is_eu_user}
                                    />
                                </div>
                            )}
                            {!is_eu_user && (
                                <div>
                                    <StaticCFDAccountManager
                                        type='financial'
                                        platform='mt5'
                                        appname={has_account ? 'Financial BVI' : 'Financial'}
                                        description='Trade CFDs on Deriv MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'
                                        financial_amount={financial_amount}
                                        derived_amount={derived_amount}
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
                                    {has_account && (
                                        <div className='static-dashboard-wrapper__body--add-button'>
                                            <Icon
                                                icon='icAppstoreAddRounded'
                                                width='24'
                                                height='24'
                                                className='Add-Rounded'
                                            />
                                            <Text
                                                size='xs'
                                                color='less-prominent'
                                                className='static-dashboard-wrapper__body--add-button-text'
                                            >
                                                {localize('More [account name] accounts')}
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!is_eu_user && (
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
                                        is_blurry={is_blurry}
                                        is_onboarding_animated={is_onboarding_animated}
                                        is_derivx_last_step={is_derivx_last_step}
                                        is_financial_last_step={is_financial_last_step}
                                        is_eu_user={is_eu_user}
                                    />
                                </div>
                            )}
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
                                    onChange={(item: { target: { text: string; value: number } }) => {
                                        setIndex(item.target.value);
                                    }}
                                    name='Options'
                                    value={index}
                                />
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
                        </div>
                        <div className='static-dashboard-wrapper__description'>
                            <Text
                                as='p'
                                size='xxs'
                                color={
                                    is_blurry.options_text || is_blurry.options_description
                                        ? 'less-prominent'
                                        : 'prominent'
                                }
                            >
                                {is_eu_user ? (
                                    <Localize
                                        i18n_default_text='Get the upside of CFDs without risking more than your initial stake with <0>Multipliers</0>.'
                                        components={[
                                            <Text
                                                key={0}
                                                size='xs'
                                                color='red'
                                                className={classNames('static-dashboard-wrapper__header--underlined', {
                                                    'static-dashboard-wrapper__header--underlined--blurry':
                                                        is_blurry.options_description,
                                                })}
                                            />,
                                        ]}
                                    />
                                ) : (
                                    <Localize
                                        i18n_default_text='Earn fixed payouts by predicting price movements with <0>Options</0>, or combine the upside of CFDs with the simplicity of Options with <1>Multipliers</1>.'
                                        components={[
                                            <Text
                                                key={0}
                                                size='xs'
                                                color='red'
                                                className={classNames('static-dashboard-wrapper__header--underlined', {
                                                    'static-dashboard-wrapper__header--underlined--blurry':
                                                        is_blurry.options_description,
                                                })}
                                            />,
                                            <Text
                                                key={1}
                                                size='xs'
                                                color='red'
                                                className={classNames('static-dashboard-wrapper__header--underlined', {
                                                    'static-dashboard-wrapper__header--underlined--blurry':
                                                        is_blurry.options_description,
                                                })}
                                            />,
                                        ]}
                                    />
                                )}
                            </Text>
                        </div>
                        <div className='static-dashboard-wrapper__body'>
                            {!has_applauncher_account ? (
                                <StaticCFDAccountManager
                                    type='all'
                                    platform='options'
                                    appname={is_eu_account_title}
                                    description={`Get a real ${is_eu_title} account, start trading and manage your funds.`}
                                    currency={currency}
                                    has_account={has_account}
                                    is_blurry={is_blurry}
                                    is_onboarding_animated={is_onboarding_animated}
                                    is_eu_user={is_eu_user}
                                />
                            ) : (
                                <div
                                    className={classNames('static-dashboard-wrapper__body', {
                                        'static-dashboard-wrapper__body--grey': is_grey,
                                    })}
                                >
                                    {!isMobile() ? (
                                        <React.Fragment>
                                            {is_eu_user ? (
                                                <StaticAppLauncher icon_type={'EUR'} is_grey is_eu_user={is_eu_user} />
                                            ) : (
                                                <>
                                                    <StaticAppLauncher
                                                        icon_type={'USD'}
                                                        is_grey
                                                        is_eu_user={is_eu_user}
                                                    />
                                                    <StaticAppLauncher icon_type={'Bitcoin'} is_eu_user={is_eu_user} />
                                                    <StaticAppLauncher icon_type={'Ethereum'} is_eu_user={is_eu_user} />
                                                    <StaticAppLauncher icon_type={'Litecoin'} is_eu_user={is_eu_user} />
                                                    <div className='Add-Square'>
                                                        <Icon icon='icAppstoreAddSquare' width='36' height='36' />
                                                    </div>
                                                </>
                                            )}
                                        </React.Fragment>
                                    ) : (
                                        <div className={classNames('static-dashboard-wrapper__body--with-add')}>
                                            {is_eu_user ? (
                                                <StaticAppLauncher icon_type={'EUR'} is_grey is_eu_user={is_eu_user} />
                                            ) : (
                                                <StaticAppLauncher icon_type={'USD'} is_grey is_eu_user={is_eu_user} />
                                            )}
                                            <div className='Add-Square'>
                                                <Icon icon='icAppstoreAddSquare' width='36' height='36' />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {!has_applauncher_account && <Divider />}

                        <div
                            className={classNames('static-dashboard-wrapper__body--apps', {
                                'static-dashboard-wrapper__body--apps--eu': is_eu_user,
                            })}
                        >
                            <StaticPlatformLauncher
                                is_grey={is_grey}
                                app_icon={`DTrader`}
                                app_title={'DTrader'}
                                app_desc={
                                    is_eu_user
                                        ? 'Multipliers trading platform.'
                                        : 'Options & multipliers trading platform.'
                                }
                                is_item_blurry={is_blurry.platformlauncher}
                                has_applauncher_account={has_applauncher_account}
                            />
                            {!is_eu_user && (
                                <StaticPlatformLauncher
                                    is_grey={is_grey}
                                    app_icon={`DBot`}
                                    app_title={'DBot'}
                                    app_desc={'Automate your trading, no coding needed.'}
                                    is_item_blurry={is_blurry.platformlauncher}
                                    has_applauncher_account={has_applauncher_account}
                                />
                            )}
                            {!is_eu_user && (
                                <StaticPlatformLauncher
                                    is_grey={is_grey}
                                    app_icon={`SmartTraderBlue`}
                                    app_title={'SmartTrader'}
                                    app_desc={'Our legacy options trading platform.'}
                                    is_item_blurry={is_blurry.platformlauncher}
                                    has_applauncher_account={has_applauncher_account}
                                />
                            )}
                            {!is_eu_user && (
                                <StaticPlatformLauncher
                                    is_grey={is_grey}
                                    app_icon={`BinaryBotBlue`}
                                    app_title={'Binary Bot'}
                                    app_desc={'Our legacy automated trading platform.'}
                                    is_item_blurry={is_blurry.platformlauncher}
                                    has_applauncher_account={has_applauncher_account}
                                />
                            )}
                            {!is_eu_user && (
                                <StaticPlatformLauncher
                                    is_grey={is_grey}
                                    app_icon={`DerivGoBlack`}
                                    app_title={'Deriv Go'}
                                    app_desc={'Trade on the go with our mobile app.'}
                                    is_item_blurry={is_blurry.platformlauncher}
                                    has_applauncher_account={has_applauncher_account}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default observer(StaticDashboard);
