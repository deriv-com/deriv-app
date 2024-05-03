import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Text, StaticUrl } from '@deriv/components';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage, localize, Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import { getHasDivider } from 'Constants/utils';
import './cfds-listing-logged-out.scss';

const CFDsListingLoggedOut = observer(() => {
    const { client, traders_hub, ui } = useStore();
    const {
        available_dxtrade_accounts,
        available_ctrader_accounts,
        combined_cfd_mt5_accounts,
        selected_region,
        is_eu_user,
        CFDs_restricted_countries,
        financial_restricted_countries,
    } = traders_hub;

    const { is_landing_company_loaded, is_populating_mt5_account_list } = client;
    const { is_mobile } = ui;

    return (
        <ListingContainer
            title={
                !is_mobile && (
                    <div className='cfds-listing-logged-out__cfd-accounts-title'>
                        <Text size='sm' weight='bold' color='prominent'>
                            {localize('CFDs')}
                        </Text>
                    </div>
                )
            }
            description={
                <Text size='xs' line_height='s'>
                    <Localize
                        i18n_default_text={'Trade CFDs with high leverage and tight spreads. <0>Learn more</0>'}
                        components={[<StaticUrl key={0} className='options' href='/trade-types/cfds' />]}
                    />
                </Text>
            }
        >
            <div className='cfds-listing-logged-out__cfd-full-row'>
                <Text line_height='m' weight='bold' color='prominent'>
                    {localize('Deriv MT5')}
                </Text>
            </div>
            {is_landing_company_loaded && !is_populating_mt5_account_list ? (
                <React.Fragment>
                    {combined_cfd_mt5_accounts.map((existing_account, index: number) => {
                        const list_size = combined_cfd_mt5_accounts.length;
                        return (
                            <TradingAppCard
                                action_type={existing_account.action_type}
                                availability={selected_region}
                                clickable_icon
                                icon={existing_account.icon}
                                sub_title={existing_account?.sub_title}
                                name={existing_account?.name ?? ''}
                                short_code_and_region={existing_account?.short_code_and_region}
                                platform={existing_account.platform}
                                description={existing_account.description}
                                key={existing_account.key}
                                has_divider={!is_eu_user && getHasDivider(index, list_size, 3)}
                                onAction={() => redirectToLogin(false, getLanguage())}
                                market_type='all'
                            />
                        );
                    })}
                </React.Fragment>
            ) : (
                <PlatformLoader />
            )}
            {!is_eu_user && !CFDs_restricted_countries && !financial_restricted_countries && (
                <div className='cfds-listing-logged-out__cfd-full-row'>
                    <hr className='cfds-listing-logged-out__divider' />
                </div>
            )}
            {!is_eu_user && !CFDs_restricted_countries && !financial_restricted_countries && (
                <div className='cfds-listing-logged-out__cfd-full-row'>
                    <Text weight='bold'>{localize('Deriv cTrader')}</Text>
                </div>
            )}
            {is_landing_company_loaded ? (
                available_ctrader_accounts.map(account => (
                    <TradingAppCard
                        action_type='get'
                        availability={selected_region}
                        clickable_icon
                        icon={account.icon}
                        name={account.name}
                        platform={account.platform}
                        description={account.description}
                        onAction={() => redirectToLogin(false, getLanguage())}
                        key={`trading_app_card_${account.name}`}
                        market_type='all'
                    />
                ))
            ) : (
                <PlatformLoader />
            )}
            {!is_eu_user && !CFDs_restricted_countries && !financial_restricted_countries && (
                <React.Fragment>
                    <div className='cfds-listing-logged-out__cfd-full-row'>
                        <hr className='cfds-listing-logged-out__divider' />
                    </div>

                    <div className='cfds-listing-logged-out__cfd-full-row'>
                        <Text line_height='m' weight='bold' color='prominent'>
                            {localize('Deriv X')}
                        </Text>
                    </div>
                </React.Fragment>
            )}
            {is_landing_company_loaded ? (
                available_dxtrade_accounts?.map(account => (
                    <TradingAppCard
                        action_type='get'
                        availability={selected_region}
                        clickable_icon
                        icon={account.icon}
                        name={account.name}
                        platform={account.platform}
                        description={account.description}
                        onAction={() => redirectToLogin(false, getLanguage())}
                        key={`trading_app_card_${account.name}`}
                        market_type='all'
                    />
                ))
            ) : (
                <PlatformLoader />
            )}
        </ListingContainer>
    );
});

export default CFDsListingLoggedOut;
