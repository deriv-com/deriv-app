import React from 'react';
import { WalletIcon } from '@deriv/components';
import type { TWalletAccount } from 'Types';

type TWalletCurrencyCard = Pick<TWalletAccount, 'is_virtual' | 'currency' | 'icon' | 'icon_type'>;

const WalletCurrencyCard = ({ is_virtual, currency, icon, icon_type }: TWalletCurrencyCard) => {
    const converted_currency = is_virtual ? 'demo' : currency.toLowerCase();

    return (
        <div className='wallet-header__currency' data-testid={`dt_${converted_currency}`}>
            <WalletIcon currency={converted_currency} icon={icon} size='xlarge' type={icon_type} has_bg={true} />
        </div>
    );
};
export default WalletCurrencyCard;
