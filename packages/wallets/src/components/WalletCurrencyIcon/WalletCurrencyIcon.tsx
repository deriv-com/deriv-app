import React from 'react';
import currencies from './currencies';

type TWalletCurrencyIconProps = {
    currency: string;
};

const WalletCurrencyIcon = ({ currency }: TWalletCurrencyIconProps) => {
    const LazyCurrencyIcon = currencies[currency as keyof typeof currencies];
    if (LazyCurrencyIcon) {
        return (
            <div className='wallets-currency-icon'>
                <React.Suspense>
                    <LazyCurrencyIcon />
                </React.Suspense>
            </div>
        );
    }

    return <span>LOGO</span>;
};

export default WalletCurrencyIcon;
