import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer } from '@deriv/stores';
import { useWalletList } from '@deriv/hooks';
import { Loading } from '@deriv/components';
import { getWalletCurrencyIcon } from 'Constants/utils';

const AccountWithWallets = observer(() => {
    const { data, isLoading } = useWalletList();
    const [selected_wallet, setSelectedWallet] = React.useState<NonNullable<typeof data>[number]['loginid']>();

    if (isLoading) return <Loading is_fullscreen={false} />;

    // TODO: delete it when wallets API starts to work
    const fake_wallet_accounts: any[] = [
        {
            name: 'USD',
            currency: 'USD',
            icon: getWalletCurrencyIcon('USD', false),
            balance: '10,784',
            icon_type: 'fiat',
            landing_company_shortcode: 'svg',
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10001',
        },
        {
            name: 'Demo USD',
            currency: 'USD',
            icon: getWalletCurrencyIcon('demo', false),
            balance: '10,0000',
            icon_type: 'fiat',
            landing_company_shortcode: 'svg',
            is_disabled: false,
            is_virtual: true,
            loginid: 'CRW10002',
        },
        {
            name: 'AUD',
            currency: 'AUD',
            icon: getWalletCurrencyIcon('AUD', false),
            balance: '5,374',
            icon_type: 'fiat',
            landing_company_shortcode: 'svg',
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10001',
        },
        {
            name: 'Bitcoin',
            currency: 'BTC',
            icon: getWalletCurrencyIcon('BTC', false),
            balance: '2.34',
            icon_type: 'crypto',
            landing_company_shortcode: 'svg',
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10001',
        },
        {
            name: 'EUR',
            currency: 'EUR',
            balance: '10,784.73',
            icon_type: 'fiat',
            landing_company_shortcode: 'malta',
            icon: getWalletCurrencyIcon('EUR', false),
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10001',
        },
        {
            name: 'USD',
            currency: 'USD',
            balance: '3,231.05',
            icon_type: 'fiat',
            landing_company_shortcode: 'malta',
            icon: getWalletCurrencyIcon('USD', false),
            is_disabled: false,
            is_virtual: false,
            loginid: 'MFW10005',
        },
        {
            name: 'ETH',
            currency: 'ETH',
            balance: '0.012342',
            icon_type: 'crypto',
            landing_company_shortcode: 'svg',
            icon: getWalletCurrencyIcon('ETH', false),
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10007',
        },
        {
            name: 'LTC',
            currency: 'LTC',
            balance: '1.2342',
            icon_type: 'crypto',
            landing_company_shortcode: 'svg',
            icon: getWalletCurrencyIcon('LTC', false),
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10007',
        },
        {
            name: 'USDC',
            currency: 'USDC',
            balance: '3.064',
            icon_type: 'crypto',
            landing_company_shortcode: 'svg',
            icon: getWalletCurrencyIcon('USDC', false),
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10008',
        },
        {
            name: 'USDT',
            currency: 'USDT',
            balance: '1.064',
            icon_type: 'crypto',
            landing_company_shortcode: 'svg',
            icon: getWalletCurrencyIcon('USDT', false),
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10009',
        },
        {
            name: 'eUSDT',
            currency: 'eUSDT',
            balance: '5.034',
            icon_type: 'crypto',
            landing_company_shortcode: 'svg',
            icon: getWalletCurrencyIcon('eUSDT', false),
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10010',
        },
        {
            name: 'tUSDT',
            currency: 'tUSDT',
            balance: '0.111',
            icon_type: 'crypto',
            landing_company_shortcode: 'svg',
            icon: getWalletCurrencyIcon('tUSDT', false),
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10011',
        },
    ];

    return (
        <React.Fragment>
            {fake_wallet_accounts?.map(wallet => {
                return (
                    <Wallet
                        key={wallet.loginid}
                        wallet_account={wallet}
                        active={selected_wallet === wallet.loginid}
                        setActive={() =>
                            setSelectedWallet(previous => (previous === wallet.loginid ? undefined : wallet.loginid))
                        }
                    />
                );
            })}
        </React.Fragment>
    );
});

export default AccountWithWallets;
