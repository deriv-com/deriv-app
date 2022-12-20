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

const CFDsListing = () => {
    const { traders_hub } = useStores();
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
    const has_no_real_account = !has_any_real_account;

    const accounts_sub_text = is_eu_user ? localize('Account Information') : localize('Compare accounts');

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
                    <Text size='sm' line_height='m' weight='bold'>
                        <Localize
                            i18n_default_text='CFDs<0>{{accounts_sub_text}}</0>'
                            values={{ accounts_sub_text }}
                            components={[
                                <Text key={0} color='red' size='xxxs' weight='bold' styles={{ marginLeft: '1rem' }} />,
                            ]}
                        />
                    </Text>
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
            {available_mt5_accounts?.map((account: AvailableAccount) => {
                const existing_accounts = getExistingAccounts(account.platform, account.market_type);
                const has_existing_accounts = existing_accounts.length > 0;
                return has_existing_accounts ? (
                    existing_accounts.map((existing_account: TDetailsOfEachMT5Loginid) => (
                        <TradingAppCard
                            icon={account.icon}
                            sub_title={account.name}
                            name={`${formatMoney(existing_account.currency, existing_account.display_balance, true)} ${
                                existing_account.currency
                            }`}
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
            })}
            {!is_eu_user && (
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
            {available_dxtrade_accounts?.map((account: AvailableAccount) => {
                const existing_accounts = getExistingAccounts(account.platform, account.market_type);
                const has_existing_accounts = existing_accounts.length > 0;
                return has_existing_accounts ? (
                    existing_accounts.map((existing_account: TDetailsOfEachMT5Loginid) => (
                        <TradingAppCard
                            icon={account.icon}
                            sub_title={account.name}
                            name={`${formatMoney(existing_account.currency, existing_account.display_balance, true)} ${
                                existing_account.currency
                            }`}
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
            })}
        </ListingContainer>
    );
};

export default observer(CFDsListing);
