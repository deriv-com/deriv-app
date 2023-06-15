import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import WalletCardsCarousel from 'Components/wallet-cards-carousel';
import { useWalletList } from '@deriv/hooks';
import { Loading } from '@deriv/components';
import { getWalletCurrencyIcon, convertWallets } from 'Constants/utils';

const AccountWithWallets = observer(() => {
    const {
        ui: { is_mobile, is_dark_mode_on },
    } = useStore();

    const { data, isLoading } = useWalletList();

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

    // TODO: We have to create ONE type for desktop and responsive wallet!!!
    const wallet_accounts = React.useMemo(() => convertWallets(data, is_dark_mode_on), [data, is_dark_mode_on]);

    const [selected_wallet, setSelectedWallet] = React.useState<NonNullable<typeof data>[number]['loginid']>(
        wallet_accounts.length ? wallet_accounts[0].loginid : undefined
    );

    const desktop_wallets_component = fake_wallet_accounts.map(wallet => {
        const setIsOpenWallet = () =>
            setSelectedWallet(selected_id => (selected_id === wallet.loginid ? undefined : wallet.loginid));

        return (
            <Wallet
                key={wallet.loginid}
                wallet_account={wallet}
                active={selected_wallet === wallet.loginid}
                setActive={setIsOpenWallet}
            />
        );
    });

    if (isLoading) return <Loading is_fullscreen={false} />;

    return (
        <React.Fragment>
            {is_mobile ? <WalletCardsCarousel items={wallet_accounts} /> : desktop_wallets_component}
        </React.Fragment>
    );
});

export default AccountWithWallets;
