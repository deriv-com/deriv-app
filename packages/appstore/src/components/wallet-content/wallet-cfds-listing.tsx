import React from 'react';
import { Text, StaticUrl, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { formatMoney, isCryptocurrency } from '@deriv/shared';
import TradingAppCard from 'Components/containers/trading-app-card';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import { getHasDivider } from 'Constants/utils';
import { useStore, observer } from '@deriv/stores';
import GetMoreAccounts from 'Components/get-more-accounts';
import { useActiveWallet } from '@deriv/hooks';
import './wallet-content.scss';

type TProps = {
    fiat_wallet_currency?: string;
};

const CryptoCFDs = observer(({ fiat_wallet_currency }: TProps) => {
    const { traders_hub, ui } = useStore();
    const { setWalletModalActiveWalletID, setWalletModalActiveTab } = traders_hub;

    const { is_mobile, setIsWalletModalVisible } = ui;

    const wallet_account = useActiveWallet();
    if (!wallet_account) return null;

    return (
        <div className='wallet-content__cfd-crypto'>
            <Text
                size={is_mobile ? 'xs' : 's'}
                weight='bold'
                line_height={is_mobile ? 'xl' : 'xxl'}
                as='p'
                className='wallet-content__cfd-crypto-title'
            >
                <Localize
                    i18n_default_text='To trade CFDs, you’ll need to use your {{fiat_wallet_currency}} Wallet. Click Transfer to move your {{currency}} to your {{fiat_wallet_currency}} Wallet.'
                    values={{ fiat_wallet_currency, currency: wallet_account.currency }}
                />
            </Text>
            <Button
                onClick={() => {
                    setWalletModalActiveTab('Transfer');
                    setIsWalletModalVisible(true);
                    setWalletModalActiveWalletID(wallet_account.loginid);
                }}
                className='wallet-content__cfd-crypto-button'
                primary_light
            >
                {localize('Transfer')}
            </Button>
        </div>
    );
});

const FiatCFDs = observer(() => {
    const { traders_hub } = useStore();
    const {
        selected_region,
        getExistingAccounts,
        selected_account_type,
        available_dxtrade_accounts,
        combined_cfd_mt5_accounts,
        can_get_more_cfd_mt5_accounts,
        toggleAccountTypeModalVisibility,
    } = traders_hub;

    const wallet_account = useActiveWallet();
    if (!wallet_account) return null;

    const getMT5AccountAuthStatus = (current_acc_status: string) => {
        if (current_acc_status === 'proof_failed') {
            return 'failed';
        } else if (current_acc_status === 'verification_pending') {
            return 'pending';
        }
        return null;
    };

    return (
        <React.Fragment>
            <div className='cfd-full-row'>
                <Text weight='bold' color='prominent'>
                    {localize('Deriv MT5')}
                </Text>
            </div>
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
                        wallet_account={wallet_account}
                    />
                );
            })}
            {can_get_more_cfd_mt5_accounts && (
                <GetMoreAccounts
                    onClick={toggleAccountTypeModalVisibility}
                    icon='IcAppstoreGetMoreAccounts'
                    title={localize('Get more')}
                    description={localize('Get more Deriv MT5 account with different type and jurisdiction.')}
                />
            )}
            {available_dxtrade_accounts?.length > 0 && (
                <div className='cfd-full-row'>
                    <Text weight='bold' color='prominent'>
                        {localize('Other CFDs')}
                    </Text>
                </div>
            )}
            {available_dxtrade_accounts?.map((account: AvailableAccount) => {
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
                            name={`${formatMoney(existing_account.currency, existing_account.display_balance, true)} ${
                                existing_account.currency
                            }`}
                            description={existing_account.login}
                            platform={account.platform}
                            key={`trading_app_card_${existing_account.login}`}
                            wallet_account={wallet_account}
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
                        wallet_account={wallet_account}
                    />
                );
            })}
        </React.Fragment>
    );
});

const WalletCFDsListing = observer(({ fiat_wallet_currency = 'USD' }: TProps) => {
    const {
        client,
        modules: { cfd },
        ui,
    } = useStore();

    const { toggleCompareAccountsModal } = cfd;
    const { is_landing_company_loaded, is_logging_in, is_switching } = client;
    const { is_mobile } = ui;

    const wallet_account = useActiveWallet();

    if (!wallet_account || !is_landing_company_loaded || is_switching || is_logging_in)
        return (
            <div className='wallet-content__loader'>
                <PlatformLoader />
            </div>
        );

    const { currency } = wallet_account;
    const accounts_sub_text =
        wallet_account.landing_company_name === 'svg' || wallet_account.is_virtual
            ? localize('Compare accounts')
            : localize('Account information');

    const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';

    return (
        <ListingContainer
            className='wallet-content__border-reset wallet-content__cfd'
            title={
                !is_mobile && (
                    <div className='cfd-accounts__title'>
                        <Text size='sm' weight='bold' color='prominent'>
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
            {is_mobile && (
                <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                    <Text size='xs' color='red' weight='bold' line_height='s'>
                        {accounts_sub_text}
                    </Text>
                </div>
            )}
            {is_fiat ? <FiatCFDs /> : <CryptoCFDs fiat_wallet_currency={fiat_wallet_currency} />}
        </ListingContainer>
    );
});

export default WalletCFDsListing;
