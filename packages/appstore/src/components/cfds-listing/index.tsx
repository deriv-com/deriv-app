import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import './cfds-listing.scss';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import AddOptionsAccount from 'Components/add-options-account';
import { isMobile, formatMoney } from '@deriv/shared';
import TradingAppCard from 'Components/containers/trading-app-card';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import PlatformLoader from 'Components/pre-loader/platform-loader';

const CFDsListing = () => {
    const {
        client,
        modules: { cfd },
        traders_hub,
    } = useStores();
    const {
        available_dxtrade_accounts,
        available_mt5_accounts,
        selected_region,
        has_any_real_account,
        startTrade,
        is_eu_user,
        is_demo,
        getExistingAccounts,
        getAccount,
    } = traders_hub;

    const { toggleCompareAccountsModal } = cfd;
    const { is_eu, is_landing_company_loaded } = client;
    const has_no_real_account = !has_any_real_account;

    const accounts_sub_text = is_eu ? localize('Account Information') : localize('Compare accounts');

    const getShortCode = (account: TDetailsOfEachMT5Loginid) => {
        return account.landing_company_short &&
            account.landing_company_short !== 'svg' &&
            account.landing_company_short !== 'bvi'
            ? account.landing_company_short?.charAt(0).toUpperCase() + account.landing_company_short?.slice(1)
            : account.landing_company_short?.toUpperCase();
    };

    return (
        <ListingContainer
            title={
                !isMobile() && (
                    <div className='cfd-accounts__title'>
                        <Text size='sm' line_height='m' weight='bold'>
                            {localize('CFDs')}
                        </Text>
                        <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                            <Text key={0} color='red' size='xxs' weight='bold' styles={{ marginLeft: '1rem' }}>
                                <Localize i18n_default_text={accounts_sub_text} />
                            </Text>
                        </div>
                    </div>
                )
            }
            description={
                <Text size='xs' line_height='s'>
                    <Localize
                        i18n_default_text={
                            'Trade with leverage and tight spreads for better returns on successful trades. <0>Learn more</0>'
                        }
                        components={[<StaticUrl key={0} className='options' href='/dmt5' />]}
                    />
                </Text>
            }
        >
            {isMobile() && (
                <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                    <Text size='xs' color='red' weight='bold' line_height='s'>
                        <Localize i18n_default_text={accounts_sub_text} />
                    </Text>
                </div>
            )}

            {!is_demo && has_no_real_account && (
                <div className='cfd-full-row'>
                    <AddOptionsAccount />
                </div>
            )}

            <div className='cfd-full-row' style={{ paddingTop: '2rem' }}>
                <Text size='xs' line_height='m' weight='bold'>
                    {localize('Deriv MT5')}
                </Text>
            </div>
            {is_landing_company_loaded ? (
                available_mt5_accounts?.map((account: AvailableAccount) => {
                    const existing_accounts = getExistingAccounts(account.platform, account.market_type);
                    const has_existing_accounts = existing_accounts.length > 0;
                    return has_existing_accounts ? (
                        existing_accounts.map((existing_account: TDetailsOfEachMT5Loginid) => (
                            <TradingAppCard
                                icon={account.icon}
                                sub_title={account.name}
                                name={`${formatMoney(
                                    existing_account.currency,
                                    existing_account.display_balance,
                                    true
                                )} ${existing_account.currency}`}
                                platform={account.platform}
                                description={existing_account.display_login}
                                key={`trading_app_card_${account.name}`}
                                type='transfer_trade'
                                availability={selected_region}
                                onAction={() => {
                                    startTrade(account.platform, existing_account);
                                }}
                            />
                        ))
                    ) : (
                        <TradingAppCard
                            icon={account.icon}
                            name={account.name}
                            platform={account.platform}
                            description={account.description}
                            key={`trading_app_card_${account.name}`}
                            type='get'
                            availability={selected_region}
                            onAction={() => {
                                getAccount(account.market_type, account.platform);
                            }}
                        />
                    );
                })
            ) : (
                <PlatformLoader />
            )}
            {!is_eu_user && !is_eu && (
                <div className='cfd-full-row'>
                    <hr className='divider' />
                </div>
            )}
            {available_dxtrade_accounts?.length > 0 && (
                <div className='cfd-full-row'>
                    <Text size='xs' line_height='m' weight='bold'>
                        {localize('Other CFDs')}
                    </Text>
                </div>
            )}
            {is_landing_company_loaded ? (
                available_dxtrade_accounts?.map((account: AvailableAccount) => {
                    const existing_accounts = getExistingAccounts(account.platform, account.market_type);
                    const has_existing_accounts = existing_accounts.length > 0;
                    return has_existing_accounts ? (
                        existing_accounts.map((existing_account: TDetailsOfEachMT5Loginid) => (
                            <TradingAppCard
                                icon={account.icon}
                                sub_title={account.name}
                                name={`${formatMoney(
                                    existing_account.currency,
                                    existing_account.display_balance,
                                    true
                                )} ${existing_account.currency}`}
                                description={existing_account.display_login}
                                platform={account.platform}
                                key={`trading_app_card_${account.name}`}
                                type='transfer_trade'
                                availability={selected_region}
                                is_disabled={!is_demo ? !has_no_real_account : account.is_disabled}
                            />
                        ))
                    ) : (
                        <TradingAppCard
                            icon={account.icon}
                            name={account.name}
                            platform={account.platform}
                            description={account.description}
                            is_disabled={account.is_disabled}
                            onAction={() => {
                                getAccount(account.market_type, account.platform);
                            }}
                            key={`trading_app_card_${account.name}`}
                            type='get'
                            availability={selected_region}
                        />
                    );
                })
            ) : (
                <PlatformLoader />
            )}
        </ListingContainer>
    );
};

export default observer(CFDsListing);
