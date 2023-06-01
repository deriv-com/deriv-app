import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import WalletCardsCarousel from 'Components/wallet-cards-carousel';
import fake_wallets from '../../constants/wallet-mocked-response';
import { WalletCard } from '@deriv/components';

// TODO: delete it after testing
type TProps = {
    show_test_wallets?: boolean;
};

const AccountWithWallets = observer(({ show_test_wallets = false }: TProps) => {
    const {
        client: { accounts },
        ui: { is_mobile },
    } = useStore();

    const wallet_test_accounts: typeof accounts[0][] = [
        // {
        //     balance: '10,0000',
        //     currency: 'usd',
        //     icon: 'IcCurrencyUsd',
        //     icon_type: 'fiat',
        //     jurisdiction_title: 'svg',
        //     name: 'USD Wallet',
        //     state: 'default',
        // },
        // wallet: {
        //     balance: string;
        //     currency: string;
        //     icon: string;
        //     icon_type: 'fiat' | 'crypto' | 'app';
        //     jurisdiction_title: string;
        //     name: string;
        // };
        {
            balance: '10415.24',
            currency: 'USD',
            landing_company_shortcode: 'svg',
            is_virtual: 1,
            loginid: 'CRW12345',
        },
        {
            balance: '0.00',
            currency: 'EUR',
            landing_company_shortcode: 'malta',
            is_virtual: 0,
            loginid: 'MFW12345',
        },
        {
            balance: '0',
            currency: 'AUD',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
            loginid: 'CRW12345',
        },
        {
            balance: '3476.21',
            currency: 'USD',
            landing_company_shortcode: 'malta',
            is_virtual: 0,
            loginid: 'MFW12345',
        },
        {
            balance: '0',
            currency: 'ETH',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
            loginid: 'CRW12345',
        },
        {
            balance: '2.45',
            currency: 'BTC',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
            loginid: 'CRW12345',
        },
        {
            balance: '0',
            currency: 'LTC',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
            loginid: 'CRW12345',
        },
        {
            balance: '0',
            currency: 'USDC',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
            loginid: 'CRW12345',
        },
        {
            balance: '0',
            currency: 'USDT',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
            loginid: 'CRW12345',
        },
        {
            balance: '0',
            currency: 'eUSDT',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
            loginid: 'CRW12345',
        },
        {
            balance: '0',
            currency: 'tUSDT',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
            loginid: 'CRW12345',
        },
    ];

    // TODO: delete 'wallet_test_accounts' after testing
    const wallet_accounts = show_test_wallets
        ? wallet_test_accounts
        : Object.keys(accounts)
              .filter(key => accounts[key]?.account_category === 'wallet')
              .reduce((acc, cur) => {
                  acc.push({ ...accounts[cur], loginid: cur });
                  return acc;
              }, [] as typeof accounts[0][]);

    // TODO: delete 'wallet_accounts_responsive' after testing
    // const wallet_accounts_responsive = wallets.map(wallet => (
    //     <WalletCard
    //         key={`${wallet.name} ${wallet.currency} ${wallet.jurisdiction_title}`}
    //         wallet={wallet}
    //         size='medium'
    //     />
    // ));

    // TODO: We have to create ONE type for desktop and responsive wallet!!!

    return (
        <React.Fragment>
            {is_mobile ? (
                <WalletCardsCarousel items={fake_wallets} />
            ) : (
                wallet_accounts.map((account, index) => (
                    <Wallet
                        key={`${account.account_type} ${account.landing_company_shortcode} ${account.currency} ${index}`}
                        wallet_account={account}
                    />
                ))
            )}
        </React.Fragment>
    );
});

export default AccountWithWallets;
