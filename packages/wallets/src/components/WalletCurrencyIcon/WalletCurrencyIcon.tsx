/* eslint-disable sort-keys */
import React, { ComponentType, CSSProperties } from 'react';
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
    IconTypes,
    PaymentMethodBitcoinBrandIcon,
    PaymentMethodDerivDemoBrandDarkIcon,
    PaymentMethodEthereumBrandIcon,
    PaymentMethodLitecoinBrandIcon,
    PaymentMethodTetherUsdtBrandIcon,
    PaymentMethodUsdCoinBrandIcon,
} from '@deriv/quill-icons';
import CurrencyDemoRoundedIcon from '../../public/images/demo-logo.svg';
import { THooks } from '../../types';

type TIconTypes = Record<
    THooks.WalletAccountsList['wallet_currency_type'],
    ComponentType<React.SVGAttributes<SVGElement>> | IconTypes
>;

// TODO: Replace DEMO currency icon with @deriv/quill-icons once available
export const roundedIcons: TIconTypes = {
    AUD: CurrencyAudIcon,
    EUR: CurrencyEurIcon,
    GBP: CurrencyGbpIcon,
    USD: CurrencyUsdIcon,
    BTC: CurrencyBtcIcon,
    ETH: CurrencyEthIcon,
    LTC: CurrencyLtcIcon,
    USDC: CurrencyUsdcIcon,
    USDT: CurrencyUsdtIcon,
    eUSDT: CurrencyUsdtIcon,
    tUSDT: CurrencyUsdtIcon,
    DEMO: CurrencyDemoRoundedIcon,
};

export const defaultIcons: TIconTypes = {
    BTC: PaymentMethodBitcoinBrandIcon,
    DEMO: PaymentMethodDerivDemoBrandDarkIcon,
    ETH: PaymentMethodEthereumBrandIcon,
    LTC: PaymentMethodLitecoinBrandIcon,
    USDC: PaymentMethodUsdCoinBrandIcon,
    USDT: PaymentMethodTetherUsdtBrandIcon,
    eUSDT: PaymentMethodTetherUsdtBrandIcon,
    tUSDT: PaymentMethodTetherUsdtBrandIcon,
};

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
    currency: THooks.WalletAccountsList['wallet_currency_type'];
    height?: CSSProperties['height'];
    rounded?: boolean;
    size?: keyof typeof defaultIconWidth | keyof typeof roundedIconWidth;
};

const WalletCurrencyIcon: React.FC<TWalletCurrencyIconsProps> = ({
    currency,
    height,
    rounded = false,
    size = 'md',
}) => {
    const isFiat = fiatIcons.includes(currency as typeof fiatIcons[number]);
    const width = rounded || isFiat ? roundedIconWidth[size] : defaultIconWidth[size];
    const Icon = rounded || isFiat ? roundedIcons[currency] : defaultIcons[currency];

    return <Icon data-testid='dt_wallet_currency_icon' height={height ?? '100%'} width={width} />;
};

export default WalletCurrencyIcon;
