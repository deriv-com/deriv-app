// import { localize } from '@deriv/translations';
import React from 'react';

type TWalletHeader = {
    currency: string;
    // landing_company_shortcode: 'svg' | 'malta' | 'virtual';
    jurisdiction: 'svg' | 'malta' | 'virtual';
    balance?: number;
};

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
