import React from 'react';
import { WalletIcon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import type { TAccountCategory, TWalletCurrency } from 'Types';
import { isCryptocurrency } from '@deriv/shared';
import { getWalletCurrencyIcon } from '@deriv/utils';

type TWalletCurrencyCard = {
    gradient_class: string;
    account_type: TAccountCategory;
    currency: TWalletCurrency;
};

const WalletCurrencyCard = observer(({ account_type, currency, gradient_class }: TWalletCurrencyCard) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();

    const is_demo = account_type === 'demo';

    // add check (currency !== 'USDT') because response from BE doesn't have USDT currency, just UST
    const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';
    const currency_icon_name = getWalletCurrencyIcon(is_demo ? 'demo' : currency, is_dark_mode_on);

    return (
        <div className='wallet-header__currency' data-testid={`dt_${is_demo ? 'demo' : currency.toLowerCase()}`}>
            <WalletIcon
                gradient_class={gradient_class}
                icon={currency_icon_name}
                size={'xlarge'}
                type={is_fiat && !is_demo ? 'fiat' : 'crypto'}
                has_bg={true}
                hide_watermark
            />
        </div>
    );
});
export default WalletCurrencyCard;
