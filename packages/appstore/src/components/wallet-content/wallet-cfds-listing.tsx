import React from 'react';
import { Text, StaticUrl, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { formatMoney, isCryptocurrency, routes } from '@deriv/shared';
import TradingAppCard from 'Components/containers/trading-app-card';
import { AvailableAccount, TDetailsOfEachMT5Loginid, TWalletAccount } from 'Types';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import { getHasDivider } from 'Constants/utils';
import { useStore, observer } from '@deriv/stores';
import { useHistory } from 'react-router';

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
    const { selected_region, getExistingAccounts, selected_account_type } = traders_hub;

    const { currency } = wallet_account;

    // TODO: delete when wallets API will work and get related accounts
    const getFakeAccounts = () => {
        const available_dxtrade_accounts =
            wallet_account.landing_company_name === 'svg'
                ? [
                      {
                          availability: 'Non-EU',
                          description: 'Trade CFDs on Deriv X with financial markets and our Derived indices.',
                          icon: 'DerivX',
                          market_type: 'all',
                          name: 'Deriv X',
                          platform: 'dxtrade',
                      },
                  ]
                : [];

        const combined_cfd_mt5_accounts =
            wallet_account.landing_company_name === 'svg'
                ? [
                      {
                          action_type: 'get',
                          availability: 'Non-EU',
                          description: 'Trade CFDs on MT5 with synthetics, baskets, and derived FX.',
                          icon: 'Derived',
                          key: 'trading_app_card_Derived',
                          market_type: 'synthetic',
                          name: 'Derived',
                          platform: 'mt5',
                      },
                      {
                          action_type: 'get',
                          availability: 'Non-EU',
                          description:
                              'Trade CFDs on MT5 with forex, stock indices, commodities, and cryptocurrencies.',
                          icon: 'Financial',
                          key: 'trading_app_card_Financial',
                          market_type: 'financial',
                          name: 'Financial',
                          platform: 'mt5',
                      },
                  ]
                : [
                      {
                          action_type: 'get',
                          availability: 'EU',
                          description:
                              'Trade CFDs on MT5 with forex, stocks, stock indices, synthetics, cryptocurrencies, and commodities.',
                          icon: 'CFDs',
                          key: 'trading_app_card_CFDs',
                          market_type: 'financial',
                          name: 'CFDs',
                          platform: 'mt5',
                      },
                  ];

        return { available_dxtrade_accounts, combined_cfd_mt5_accounts };
    };

    const { available_dxtrade_accounts, combined_cfd_mt5_accounts } = getFakeAccounts();

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
                    {combined_cfd_mt5_accounts.map((existing_account, index) => {
                        const list_size = combined_cfd_mt5_accounts.length;
                        const has_mt5_account_status = existing_account.status
                            ? getMT5AccountAuthStatus(existing_account.status)
                            : null;
                        return (
                            <TradingAppCard
                                action_type={existing_account.action_type}
                                availability={selected_region}
                                clickable_icon
                                icon={existing_account.icon}
                                sub_title={existing_account?.sub_title}
                                name={!has_mt5_account_status ? existing_account?.name : ''}
                                short_code_and_region={wallet_account.landing_company_name}
                                platform={existing_account.platform}
                                description={existing_account.description}
                                key={existing_account.key}
                                has_divider={getHasDivider(index, list_size, 3)}
                                mt5_acc_auth_status={has_mt5_account_status}
                                selected_mt5_jurisdiction={{
                                    platform: existing_account.platform,
                                    category: selected_account_type,
                                    type: existing_account.market_type,
                                    jurisdiction: existing_account.landing_company_short,
                                }}
                                is_wallet={true}
                                is_wallet_demo={!!wallet_account.is_virtual}
                            />
                        );
                    })}
                </React.Fragment>
            ) : (
                <PlatformLoader />
            )}
            {available_dxtrade_accounts?.length > 0 && (
                <div className='cfd-full-row'>
                    <Text line_height='m' weight='bold' color='prominent'>
                        {localize('Other CFDs')}
                    </Text>
                </div>
            )}
            {is_landing_company_loaded ? (
                available_dxtrade_accounts?.map((account: AvailableAccount) => {
                    const existing_accounts = getExistingAccounts(account.platform || '', account.market_type || '');
                    const has_existing_accounts = existing_accounts.length > 0;
                    return has_existing_accounts ? (
                        existing_accounts.map((existing_account: TDetailsOfEachMT5Loginid) => (
                            <TradingAppCard
                                action_type='multi-action'
                                availability={selected_region}
                                clickable_icon
                                icon={account.icon}
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
