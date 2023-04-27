import React from 'react';
import { Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';

type TWalletCurrencyCard = {
    account_type: 'demo' | 'real';
    currency: 'USD' | 'EUR' | 'AUD' | 'BTC' | 'ETH' | 'USDT' | 'eUSDT' | 'tUSDT' | 'LTC' | 'USDC';
};

const WalletCurrencyCard = observer(({ account_type = 'real', currency = 'USD' }: TWalletCurrencyCard) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();

    const is_demo = account_type === 'demo';
    const theme = is_dark_mode_on ? '--dark' : '';
    const demo_icon_path = is_dark_mode_on ? 'IcWalletDerivDemoDark' : 'IcWalletDerivDemoLight';
    const class_currency = is_demo ? 'demo' : currency.toLowerCase();

    const currency_icon_path = React.useMemo(
        () => ({
            USD: is_demo ? demo_icon_path : 'IcCurrencyUsd',
            EUR: 'IcCurrencyEur',
            AUD: 'IcCurrencyAud',
            BTC: is_dark_mode_on ? 'IcCashierBitcoinDark' : 'IcCashierBitcoinLight',
            ETH: is_dark_mode_on ? 'IcWalletEtheriumDark' : 'IcWalletEtheriumLight',
            USDT: is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight',
            eUSDT: is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight',
            tUSDT: is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight',
            LTC: is_dark_mode_on ? 'IcWalletLitecoinDark' : 'IcWalletLitecoinLight',
            USDC: is_dark_mode_on ? 'IcWalletUsdcDark' : 'IcWalletUsdcLight',
        }),
        [demo_icon_path, is_dark_mode_on, is_demo]
    );

    const is_fiat = currency === 'USD' || currency === 'EUR' || currency === 'AUD';
    const currency_icon_name = currency_icon_path[currency] || 'Unknown';
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
WalletCurrencyCard.displayName = 'WalletHeader';
export default WalletCurrencyCard;
