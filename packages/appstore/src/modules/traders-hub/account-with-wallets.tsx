import { observer, useStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import Wallet from 'Components/wallet';
import React from 'react';

// TODO: delete it after testing
type TProps = {
    show_test_wallets?: boolean;
};

const AccountWithWallets = observer(({ show_test_wallets = false }: TProps) => {
    // const wallet_accounts = accounts?.length ? accounts : wallet_test_accounts;
    // const wallet_accounts = wallet_test_accounts;

    const {
        client: { accounts },
    } = useStore();

    const wallet_test_accounts: TCoreStores['client']['accounts'][0][] = [
        {
            balance: '10415.24',
            currency: 'USD',
            landing_company_shortcode: 'svg',
            is_virtual: 1,
        },
        {
            balance: '0.00',
            currency: 'EUR',
            landing_company_shortcode: 'malta',
            is_virtual: 0,
        },
        {
            balance: '0',
            currency: 'AUD',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
        },
        {
            balance: '3476.21',
            currency: 'USD',
            landing_company_shortcode: 'malta',
            is_virtual: 0,
        },
        {
            balance: '0',
            currency: 'ETH',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
        },
        {
            balance: '2.45',
            currency: 'BTC',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
        },
        {
            balance: '0',
            currency: 'LTC',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
        },
        {
            balance: '0',
            currency: 'USDC',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
        },
        {
            balance: '0',
            currency: 'USDT',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
        },
        {
            balance: '0',
            currency: 'eUSDT',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
        },
        {
            balance: '0',
            currency: 'tUSDT',
            landing_company_shortcode: 'svg',
            is_virtual: 0,
        },
    ];

    const wallet_accounts = show_test_wallets
        ? wallet_test_accounts
        : Object.keys(accounts)
              .filter(key => accounts[key]?.account_category === 'wallet')
              .reduce((acc, cur) => {
                  acc.push(accounts[cur]);
                  return acc;
              }, [] as typeof accounts[]);

    // console.log(
    //     'accounts = ',
    //     accounts,
    //     ', wallet accounts = ',
    //     wallet_accounts
    // );

    // console.log('wallet_accounts = ', wallet_accounts);

    // multipliers_account_status from client-store

    return (
        <React.Fragment>
            {wallet_accounts.map((account, index) => (
                <Wallet
                    key={`${account.account_type} ${account.landing_company_shortcode} ${account.currency} ${index}`}
                    account={account}
                />
            ))}
        </React.Fragment>
    );
});

export default AccountWithWallets;
