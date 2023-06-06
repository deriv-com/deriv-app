import React from 'react';
import { WalletIcon } from '@deriv/components';
import type { TAccountCategory, TWalletCurrency } from 'Types';

type TWalletCurrencyCard = {
    account_type: TAccountCategory;
    currency: TWalletCurrency;
    icon_type?: string;
    icon?: string;
};

const WalletCurrencyCard = ({ account_type, currency, icon_type = 'fiat', icon = '' }: TWalletCurrencyCard) => {
    const is_demo = account_type === 'demo';
    const converted_currency = is_demo ? 'demo' : currency.toLowerCase();

    return (
        <div className='wallet-header__currency' data-testid={`dt_${converted_currency}`}>
            <WalletIcon currency={converted_currency} icon={icon} size={'xlarge'} type={icon_type} has_bg={true} />
        </div>
    );
};
export default WalletCurrencyCard;
