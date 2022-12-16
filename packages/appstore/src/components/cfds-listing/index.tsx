import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import './cfds-listing.scss';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import AddOptionsAccount from 'Components/add-options-account';
import { isMobile } from '@deriv/shared';
import TradingAppCard from 'Components/containers/trading-app-card';
import { AvailableAccount } from 'Types';

const CFDsListing = () => {
    const { tradinghub } = useStores();
    const {
        available_dxtrade_accounts,
        available_mt5_accounts,
        selected_region,
        has_any_real_account,
        checkForExistingAccounts,
        startTrade,
        is_eu_user,
        is_demo,
    } = tradinghub;
    const has_no_real_account = !has_any_real_account;

    const accounts_sub_text = is_eu_user ? localize('Account Information') : localize('Compare accounts');
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
                return (
                    <TradingAppCard
                        {...account}
                        key={`trading_app_card_${account.name}`}
                        type={
                            checkForExistingAccounts(account.platform, account.market_type) ? 'transfer_trade' : 'get'
                        }
                        availability={selected_region}
                        onAction={() => {
                            startTrade(account.platform, account);
                        }}
                    />
                );
            })}
            <div className='cfd-full-row'>
                <hr className='divider' />
            </div>
            {available_dxtrade_accounts?.length > 0 && (
                <div className='cfd-full-row'>
                    <Text size='xs' line_height='m' weight='bold'>
                        {localize('Other CFDs')}
                    </Text>
                </div>
            )}
            {available_dxtrade_accounts?.map((account: AvailableAccount) => {
                return (
                    <TradingAppCard
                        {...account}
                        key={`trading_app_card_${account.name}`}
                        type={
                            checkForExistingAccounts(account.platform, account.market_type) ? 'transfer_trade' : 'get'
                        }
                        availability={selected_region}
                        is_disabled={!is_demo ? !has_no_real_account : account.is_disabled}
                    />
                );
            })}
        </ListingContainer>
    );
};

export default observer(CFDsListing);
