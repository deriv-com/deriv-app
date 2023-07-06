import React from 'react';
import { Text, StaticUrl, Button, Loading } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { formatMoney, isCryptocurrency, routes } from '@deriv/shared';
import TradingAppCard from 'Components/containers/trading-app-card';
import { TDetailsOfEachMT5Loginid, TWalletAccount } from 'Types';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import { getHasDivider } from 'Constants/utils';
import { useStore, observer } from '@deriv/stores';
import { useHistory } from 'react-router';
import { useActiveWalletCFDAccounts } from '@deriv/hooks';
import GetMoreAccounts from 'Components/get-more-accounts';

type TProps = {
    wallet_account: TWalletAccount;
    fiat_wallet_currency?: string;
};

const WalletCFDsListing = observer(({ wallet_account, fiat_wallet_currency = 'USD' }: TProps) => {
    const history = useHistory();
    const {
        client,
        modules: { cfd },
        traders_hub,
        ui,
    } = useStore();
    const { selected_region, getExistingAccounts, selected_account_type, toggleAccountTypeModalVisibility } =
        traders_hub;

    const { currency } = wallet_account;

    const { data, isLoading } = useActiveWalletCFDAccounts();

    const { toggleCompareAccountsModal } = cfd;
    const { is_landing_company_loaded } = client;
    const { is_mobile } = ui;
    const accounts_sub_text =
        wallet_account.landing_company_name === 'svg' ? localize('Compare accounts') : localize('Account information');

    const getMT5AccountAuthStatus = (current_acc_status: string) => {
        if (current_acc_status === 'proof_failed') {
            return 'failed';
        } else if (current_acc_status === 'verification_pending') {
            return 'pending';
        }
        return null;
    };

    const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';

    const CryptoCFDs = () => (
        <div className='wallet-content__cfd-crypto'>
            <Text size='s' weight='bold' line_height='xxl' as='p' className='wallet-content__cfd-crypto-title'>
                <Localize
                    i18n_default_text='To trade CFDs, you’ll need to use your {{fiat_wallet_currency}} Wallet. Click Transfer to move your {{currency}} to your {{fiat_wallet_currency}} Wallet.'
                    values={{ fiat_wallet_currency, currency }}
                />
            </Text>
            <Button
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    history.push(routes.cashier_acc_transfer);
                }}
                className='wallet-content__cfd-crypto-button'
                primary_light
            >
                {localize('Transfer')}
            </Button>
        </div>
    );

    const FiatCFDs = () => (
        <React.Fragment>
            {is_mobile && (
                <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                    <Text size='xs' color='red' weight='bold' line_height='s'>
                        {accounts_sub_text}
                    </Text>
                </div>
            )}

            <div className='cfd-full-row' style={{ paddingTop: '2rem' }}>
                <Text line_height='m' weight='bold' color='prominent'>
                    {localize('Deriv MT5')}
                </Text>
            </div>
            {is_landing_company_loaded ? (
                <React.Fragment>
                    {isLoading && <Loading is_fullscreen={false} />}
                    {data.mt5_accounts?.map((existing_account, index) => {
                        const list_size = data.mt5_accounts?.length || 0;
                        const has_mt5_account_status = existing_account.status
                            ? getMT5AccountAuthStatus(existing_account.status)
                            : null;
                        return (
                            <TradingAppCard
                                action_type='multi-action'
                                availability={selected_region}
                                clickable_icon
                                icon={existing_account.icon}
                                // icon={'CFDs'}
                                // sub_title={existing_account?.sub_title}
                                sub_title={existing_account.sub_title}
                                name={!has_mt5_account_status ? existing_account?.name : undefined}
                                // name={existing_account.name || ''}
                                short_code_and_region={wallet_account.landing_company_name}
                                // platform={existing_account.platform}
                                platform={existing_account.platform}
                                // description={existing_account.description}
                                description={existing_account.description}
                                key={existing_account.login}
                                has_divider={getHasDivider(index, list_size, 3)}
                                mt5_acc_auth_status={has_mt5_account_status}
                                selected_mt5_jurisdiction={{
                                    // platform: existing_account.platform,
                                    platform: 'mt5',
                                    category: selected_account_type,
                                    type: existing_account.market_type,
                                    jurisdiction: existing_account.landing_company_short,
                                }}
                            />
                        );
                    })}
                    {data?.mt5_accounts && data?.mt5_accounts?.length > 1 && (
                        <GetMoreAccounts
                            onClick={toggleAccountTypeModalVisibility}
                            icon='IcAppstoreGetMoreAccounts'
                            title={localize('Get more')}
                            description={localize('Get more Deriv MT5 account with different type and jurisdiction.')}
                        />
                    )}
                </React.Fragment>
            ) : (
                <PlatformLoader />
            )}
            {(data.dxtrade_accounts?.length || 0) > 0 && (
                <div className='cfd-full-row'>
                    <Text line_height='m' weight='bold' color='prominent'>
                        {localize('Other CFDs')}
                    </Text>
                </div>
            )}
            {is_landing_company_loaded ? (
                data.dxtrade_accounts?.map(account => {
                    const existing_accounts = getExistingAccounts(account.platform || '', account.market_type || '');
                    const has_existing_accounts = existing_accounts.length > 0;
                    return has_existing_accounts ? (
                        existing_accounts.map((existing_account: TDetailsOfEachMT5Loginid) => (
                            <TradingAppCard
                                action_type='multi-action'
                                availability={selected_region}
                                clickable_icon
                                icon={'DerivX'}
                                sub_title={account.name}
                                name={`${formatMoney(
                                    existing_account.currency,
                                    existing_account.display_balance,
                                    true
                                )} ${existing_account.currency}`}
                                description={existing_account.login}
                                platform={account.platform}
                                key={`trading_app_card_${existing_account.login}`}
                                is_wallet={true}
                                is_wallet_demo={!!wallet_account.is_virtual}
                            />
                        ))
                    ) : (
                        <TradingAppCard
                            action_type='get'
                            availability={selected_region}
                            clickable_icon
                            icon={account.icon}
                            name={account.name}
                            platform={account.platform}
                            description={account.description}
                            key={`trading_app_card_${account.name}`}
                            is_wallet={true}
                            is_wallet_demo={!!wallet_account.is_virtual}
                        />
                    );
                })
            ) : (
                <PlatformLoader />
            )}
        </React.Fragment>
    );

    return (
        <ListingContainer
            className='wallet-content__border-reset'
            title={
                !is_mobile && (
                    <div className='cfd-accounts__title'>
                        <Text size='sm' line_height='m' weight='bold' color='prominent'>
                            {localize('CFDs')}
                        </Text>
                        <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                            <Text key={0} color='red' size='xxs' weight='bold' styles={{ marginLeft: '1rem' }}>
                                {accounts_sub_text}
                            </Text>
                        </div>
                    </div>
                )
            }
            description={
                <Text size='xs' line_height='s'>
                    <Localize
                        i18n_default_text={
                            'Trade with leverage and tight spreads for better returns on trades. <0>Learn more</0>'
                        }
                        components={[<StaticUrl key={0} className='options' href='/trade-types/cfds' />]}
                    />
                </Text>
            }
            is_outside_grid_container={!is_fiat}
        >
            {is_fiat ? <FiatCFDs /> : <CryptoCFDs />}
        </ListingContainer>
    );
});

export default WalletCFDsListing;
