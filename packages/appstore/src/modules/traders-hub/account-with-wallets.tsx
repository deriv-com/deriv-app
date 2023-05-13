import { observer, useStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import Wallet from 'Components/wallet';
import React from 'react';

type TAccountWithWallets = {
    accounts: TCoreStores['client']['accounts'][0][];
};

const AccountWithWallets = observer(() => {
    // const wallet_test_accounts: TCoreStores['client']['accounts'][0][] = [
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'demo',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'EUR',
    //         shortcode: 'malta',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'ETH',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'AUD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'BTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'LTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'eUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'tUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'demo',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'EUR',
    //         shortcode: 'malta',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'ETH',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'AUD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'BTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'LTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'eUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'tUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'demo',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'EUR',
    //         shortcode: 'malta',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'ETH',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'AUD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'BTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'LTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'eUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'tUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'demo',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'EUR',
    //         shortcode: 'malta',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'ETH',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'AUD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'BTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'LTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'eUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'tUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'demo',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'EUR',
    //         shortcode: 'malta',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'ETH',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'AUD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'BTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'LTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'eUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'tUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'demo',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'EUR',
    //         shortcode: 'malta',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'ETH',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'AUD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'BTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'LTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'eUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'tUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'demo',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'EUR',
    //         shortcode: 'malta',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'ETH',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'AUD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'BTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'LTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'eUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'tUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'demo',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'EUR',
    //         shortcode: 'malta',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'ETH',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'AUD',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'BTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'LTC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDC',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'USDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'eUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    //     {
    //         account_status: '',
    //         balance: '0.00',
    //         currency: 'tUSDT',
    //         shortcode: 'svg',
    //         account_type: 'real',
    //     },
    // ];

    // const wallet_accounts = accounts?.length ? accounts : wallet_test_accounts;
    // const wallet_accounts = wallet_test_accounts;

    const {
        client: { accounts },
    } = useStore();

    const wallet_accounts = Object.keys(accounts)
        .filter(key => accounts[key]?.account_category === 'wallet')
        .reduce((acc, cur) => {
            acc.push(accounts[cur]);
            return acc;
        }, [] as typeof accounts[]);

    // console.log(
    //     'accounts = ',
    //     accounts,
    //     // ', active_accounts = ',
    //     // active_accounts,
    //     // ', account_list = ',
    //     // account_list,
    //     // ', wallet accounts = ',
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
