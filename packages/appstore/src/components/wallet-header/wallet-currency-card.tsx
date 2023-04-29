import React from 'react';
import { Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import type { TAccountCategory, TWalletSvgCurrency } from 'Types';
import { getWalletCurrencyIcon } from 'Constants/utils';

type TWalletCurrencyCard = {
    account_type: TAccountCategory;
    currency: TWalletSvgCurrency;
};

const WalletCurrencyCard = observer(({ account_type = 'real', currency = 'USD' }: TWalletCurrencyCard) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();

    const is_demo = account_type === 'demo';
    const theme = is_dark_mode_on ? '--dark' : '';
    const class_currency = is_demo ? 'demo' : currency.toLowerCase();

    const currency_icon_path = getWalletCurrencyIcon(is_demo ? 'demo' : currency, is_dark_mode_on);

    const is_fiat = currency === 'USD' || currency === 'EUR' || currency === 'AUD';
    const currency_icon_name = currency_icon_path;
    const currency_icon_size = is_fiat && !is_demo ? 48 : 100;
    return (
        <div
            className={`wallet-header__currency wallet__${class_currency}-bg${theme}`}
            data-testid={`dt_${class_currency}`}
        >
            <Icon icon={currency_icon_name} size={currency_icon_size} />
        </div>
    );
});
WalletCurrencyCard.displayName = 'WalletCurrencyCard';
export default WalletCurrencyCard;
