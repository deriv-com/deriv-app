import React from 'react';
import { TransferAccountSelector } from '@deriv/components';
import './account-transfer-for-test.scss';

const AccountTranferForTest = () => {
    const [showAccountTransfer, setShowAccountTransfer] = React.useState(false);

    const transfer_accounts = {
        accounts: [
            {
                loginid: 'CR12345678',
                label: 'MT5 Derived',
                currency: 'usd',
                balance: '100000',
                icon: 'IcAppstoreMt5Test',
                wallet_icon: 'IcCurrencyUsd',
                jurisdiction: 'SVG',
            },
        ],
        Wallets: [
            {
                loginid: 'CR00000000',
                label: 'USD Wallet',
                currency: 'usd',
                balance: '100000',
                wallet_icon: 'IcCurrencyUsd',
                jurisdiction: 'SVG',
            },
            {
                loginid: 'CR11111111',
                label: 'BTC Wallet',
                currency: 'btc',
                balance: '10.00000000',
                wallet_icon: 'IcCurrencyBtc',
                jurisdiction: 'SVG',
            },
            {
                loginid: 'CR22222222',
                label: 'ETH Wallet',
                currency: 'eth',
                balance: '10.00000000',
                wallet_icon: 'IcCurrencyEth',
                jurisdiction: 'SVG',
            },
        ],
    };

    return (
        <>
            <button onClick={() => setShowAccountTransfer(!showAccountTransfer)}>Toggle Account Transfer</button>
            {showAccountTransfer && (
                <div className='account-transfer-wrapper'>
                    <TransferAccountSelector
                        label='Transfer from'
                        placeholder='Select an account or wallet'
                        transfer_accounts={transfer_accounts}
                        wallet_name='USD Wallet (SVG)'
                    />
                </div>
            )}
        </>
    );
};

export default AccountTranferForTest;
