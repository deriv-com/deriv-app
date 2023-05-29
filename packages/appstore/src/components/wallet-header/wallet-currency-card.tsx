import React from 'react';
import { WalletIcon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import type { TAccountCategory, TWalletCurrency } from 'Types';
import { getWalletCurrencyIcon } from 'Constants/utils';
import { isCryptocurrency } from '@deriv/shared';
import { getWalletModalBackgrounds } from 'Constants/wallet-background';

type TWalletCurrencyCard = {
    account_type: TAccountCategory;
    currency: TWalletCurrency;
};

const WalletCurrencyCard = observer(({ account_type, currency }: TWalletCurrencyCard) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();

    const is_demo = account_type === 'demo';
    const converted_currency = is_demo ? 'demo' : currency.toLowerCase();

    // add check (currency !== 'USDT') because response from BE doesn't have USDT currency, just UST
    const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';
    const currency_icon_name = getWalletCurrencyIcon(is_demo ? 'demo' : currency, is_dark_mode_on);
    const currency_icon_size = is_fiat && !is_demo ? 48 : 100;

    const bg = getWalletModalBackgrounds(converted_currency);

    return (
        <div className='wallet-header__currency' data-testid={`dt_${converted_currency}`}>
            <WalletIcon
                icon={currency_icon_name}
                iconSize={currency_icon_size}
                color={bg.color}
                primaryColor={bg.primary}
                secondaryColor={bg.secondary}
                size='large'
            />
        </div>
    );
});
export default WalletCurrencyCard;
