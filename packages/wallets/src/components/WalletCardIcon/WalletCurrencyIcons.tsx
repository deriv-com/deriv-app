/* eslint-disable sort-keys */
import React from 'react';
import {
    CurrencyAudIcon,
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyEurIcon,
    CurrencyGbpIcon,
    CurrencyLtcIcon,
    CurrencyUsdcIcon,
    CurrencyUsdIcon,
    CurrencyUsdtIcon,
    PaymentMethodBitcoinBrandIcon,
    PaymentMethodDerivDemoBrandDarkIcon,
    PaymentMethodEthereumBrandIcon,
    PaymentMethodLitecoinBrandIcon,
    PaymentMethodTetherUsdtBrandIcon,
    PaymentMethodUsdCoinBrandIcon,
} from '@deriv/quill-icons';
import CurrencyDemoRoundedIcon from '../../public/images/demo-logo.svg';

// TODO: Replace DEMO currency icon with @deriv/quill-icons once available
export const roundedIcons = {
    // Fiat Icons:
    AUD: CurrencyAudIcon,
    EUR: CurrencyEurIcon,
    GBP: CurrencyGbpIcon,
    USD: CurrencyUsdIcon,
    // Crypto Icons:
    BTC: CurrencyBtcIcon,
    ETH: CurrencyEthIcon,
    LTC: CurrencyLtcIcon,
    USDC: CurrencyUsdcIcon,
    USDT: CurrencyUsdtIcon,
    eUSDT: CurrencyUsdtIcon,
    tUSDT: CurrencyUsdtIcon,
    // Other Icons:
    DEMO: CurrencyDemoRoundedIcon,
} as const;

export const defaultIcons = {
    BTC: PaymentMethodBitcoinBrandIcon,
    DEMO: PaymentMethodDerivDemoBrandDarkIcon,
    ETH: PaymentMethodEthereumBrandIcon,
    LTC: PaymentMethodLitecoinBrandIcon,
    USDC: PaymentMethodUsdCoinBrandIcon,
    USDT: PaymentMethodTetherUsdtBrandIcon,
    eUSDT: PaymentMethodTetherUsdtBrandIcon,
    tUSDT: PaymentMethodTetherUsdtBrandIcon,
} as const;

export const roundedIconWidth = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
} as const;

export const defaultIconWidth = {
    xs: 48,
    sm: 64,
    md: 72,
    lg: 90,
    xl: 120,
} as const;

export const fiatIcons = ['AUD', 'EUR', 'GBP', 'USD'] as const;

type TWalletCurrencyIconsProps = {
    currency: keyof typeof defaultIcons | keyof typeof roundedIcons;
    rounded?: boolean;
    size?: keyof typeof defaultIconWidth | keyof typeof roundedIconWidth;
};

const WalletCurrencyIcons: React.FC<TWalletCurrencyIconsProps> = ({ currency, rounded = false, size = 'md' }) => {
    const isFiat = fiatIcons.includes(currency);
    const width = rounded || isFiat ? roundedIconWidth[size] : defaultIconWidth[size];
    const Icon = rounded || isFiat ? roundedIcons[currency] : defaultIcons[currency];

    return <Icon height='auto' width={width} />;
};

export default WalletCurrencyIcons;
