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
    PaymentMethodEthereumBrandIcon,
    PaymentMethodLitecoinBrandIcon,
    PaymentMethodTetherUsdtBrandIcon,
    PaymentMethodUsdCoinBrandIcon,
} from '@deriv/quill-icons';
import CurrencyDemoIcon from '../../public/images/demo.svg';
import CurrencyDemoRoundedIcon from '../../public/images/demo-logo.svg';

export const currencyIcons = {
    AUD: {
        default: CurrencyAudIcon,
        rounded: CurrencyAudIcon,
    },
    BTC: {
        default: PaymentMethodBitcoinBrandIcon,
        rounded: CurrencyBtcIcon,
    },
    DEMO: {
        default: CurrencyDemoIcon,
        rounded: CurrencyDemoRoundedIcon,
    },
    ETH: {
        default: PaymentMethodEthereumBrandIcon,
        rounded: CurrencyEthIcon,
    },
    EUR: {
        default: CurrencyEurIcon,
        rounded: CurrencyEurIcon,
    },
    eUSDT: {
        default: PaymentMethodTetherUsdtBrandIcon,
        rounded: CurrencyUsdtIcon,
    },
    GBP: {
        default: CurrencyGbpIcon,
        rounded: CurrencyGbpIcon,
    },
    LTC: {
        default: PaymentMethodLitecoinBrandIcon,
        rounded: CurrencyLtcIcon,
    },
    tUSDT: {
        default: PaymentMethodTetherUsdtBrandIcon,
        rounded: CurrencyUsdtIcon,
    },
    USD: {
        default: CurrencyUsdIcon,
        rounded: CurrencyUsdIcon,
    },
    USDC: {
        default: PaymentMethodUsdCoinBrandIcon,
        rounded: CurrencyUsdcIcon,
    },
    UST: {
        default: PaymentMethodTetherUsdtBrandIcon,
        rounded: CurrencyUsdtIcon,
    },
} as const;

export const iconWidth = {
    xs: 16,
    // eslint-disable-next-line sort-keys
    sm: 24,
    // eslint-disable-next-line sort-keys
    md: 32,
    // eslint-disable-next-line sort-keys
    lg: 48,
    xl: 64,
    // eslint-disable-next-line sort-keys
    '2xl': 84,
} as const;

type TWalletCurrencyIconsProps = {
    currency: keyof typeof currencyIcons;
    rounded?: boolean;
    size?: keyof typeof iconWidth;
};

const WalletCurrencyIcons: React.FC<TWalletCurrencyIconsProps> = ({ currency, rounded = false, size = 'md' }) => {
    const width = iconWidth[size];
    const Icon = currencyIcons[currency][rounded ? 'rounded' : 'default'];
    return <Icon height='auto' width={width} />;
};

export default WalletCurrencyIcons;
