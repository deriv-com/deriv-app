import React from 'react';
import { WalletIcon } from '@deriv/components';
// import { observer, useStore } from '@deriv/stores';
import type { TAccountCategory, TWalletCurrency } from 'Types';
// import { getWalletCurrencyIcon } from 'Constants/utils';
// import { isCryptocurrency } from '@deriv/shared';

type TWalletCurrencyCard = {
    account_type: TAccountCategory;
    currency: TWalletCurrency;
    icon_type?: string;
    icon?: string;
};

const WalletCurrencyCard = ({ account_type, currency, icon_type = 'fiat', icon = '' }: TWalletCurrencyCard) => {
    // const {
    //     ui: { is_dark_mode_on },
    // } = useStore();

    const is_demo = account_type === 'demo';
    const converted_currency = is_demo ? 'demo' : currency.toLowerCase();

    // add check (currency !== 'USDT') because response from BE doesn't have USDT currency, just UST
    // const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';
    // const currency_icon_name = getWalletCurrencyIcon(is_demo ? 'demo' : currency, is_dark_mode_on);
    // const currency_icon_name = '';

    return (
        <div className='wallet-header__currency' data-testid={`dt_${converted_currency}`}>
            <WalletIcon
                currency={converted_currency}
                // icon={currency_icon_name}
                icon={icon}
                size={'xlarge'}
                // type={is_fiat && !is_demo ? 'fiat' : 'crypto'}
                type={icon_type}
                has_bg={true}
            />
        </div>
    );
};
export default WalletCurrencyCard;
