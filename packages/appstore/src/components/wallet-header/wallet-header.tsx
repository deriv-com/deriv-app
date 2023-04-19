// import { localize } from '@deriv/translations';
import React from 'react';

type TWalletHeaderCommon = {
    balance?: number;
};

type TWalletHeaderDemo = TWalletHeaderCommon & {
    jurisdiction: 'virtual';
    currency?: never;
};

type TWalletHeaderNotDemo = TWalletHeaderCommon & {
    jurisdiction: 'svg' | 'malta';
    currency: 'USD' | 'EUR' | 'AUD';
};

type TWalletHeader = TWalletHeaderDemo | TWalletHeaderNotDemo;

const WalletHeader = React.memo(({ balance = 0, currency = 'USD', jurisdiction = 'svg' }: TWalletHeader) => {
    return (
        <div>
            <h1>I am a wallet header. Balance = {balance}</h1>
            <p>
                Currency: {currency}, jurisdiction: {jurisdiction}
            </p>
        </div>
    );
});

WalletHeader.displayName = 'WalletHeader';
export default WalletHeader;
