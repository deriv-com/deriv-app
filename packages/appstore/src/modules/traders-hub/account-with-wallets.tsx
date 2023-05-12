import Wallet from 'Components/wallet';
import { TWalletTestAccount } from 'Components/wallet/wallet';
import React from 'react';

type TAccountWithWallets = {
    accounts: any;
};

const AccountWithWallets = ({ accounts }: TAccountWithWallets) => {
    const wallet_test_accounts: TWalletTestAccount[] = [
        {
            account_status: '',
            balance: '0.00',
            currency: 'USD',
            shortcode: 'svg',
            account_type: 'demo',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'EUR',
            shortcode: 'malta',
            account_type: 'real',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'USD',
            shortcode: 'svg',
            account_type: 'real',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'ETH',
            shortcode: 'svg',
            account_type: 'real',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'AUD',
            shortcode: 'svg',
            account_type: 'real',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'BTC',
            shortcode: 'svg',
            account_type: 'real',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'LTC',
            shortcode: 'svg',
            account_type: 'real',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'USDC',
            shortcode: 'svg',
            account_type: 'real',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'USDT',
            shortcode: 'svg',
            account_type: 'real',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'eUSDT',
            shortcode: 'svg',
            account_type: 'real',
        },
        {
            account_status: '',
            balance: '0.00',
            currency: 'tUSDT',
            shortcode: 'svg',
            account_type: 'real',
        },
    ];

    const wallet_accounts = accounts?.length ? accounts : wallet_test_accounts;
    // const wallet_accounts = wallet_test_accounts;

    return (
        <React.Fragment>
            {wallet_accounts.map((account: any) => (
                <Wallet key={`${account.account_type} ${account.shortcode} ${account.currency} `} account={account} />
            ))}
        </React.Fragment>
    );
};

export default AccountWithWallets;
