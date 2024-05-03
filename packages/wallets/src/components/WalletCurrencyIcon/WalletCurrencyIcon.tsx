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
    BTC: CurrencyBtcIcon,
    DEMO: CurrencyDemoRoundedIcon,
    ETH: CurrencyEthIcon,
    EUR: CurrencyEurIcon,
    eUSDT: CurrencyUsdtIcon,
    GBP: CurrencyGbpIcon,
    LTC: CurrencyLtcIcon,
    tUSDT: CurrencyUsdtIcon,
    USD: CurrencyUsdIcon,
    USDC: CurrencyUsdcIcon,
    USDT: CurrencyUsdtIcon,
    UST: CurrencyUsdtIcon,
};

export const defaultIcons: TIconTypes = {
    BTC: PaymentMethodBitcoinBrandIcon,
    DEMO: PaymentMethodDerivDemoBrandDarkIcon,
    ETH: PaymentMethodEthereumBrandIcon,
    eUSDT: PaymentMethodTetherUsdtBrandIcon,
    LTC: PaymentMethodLitecoinBrandIcon,
    tUSDT: PaymentMethodTetherUsdtBrandIcon,
    USDC: PaymentMethodUsdCoinBrandIcon,
    USDT: PaymentMethodTetherUsdtBrandIcon,
    UST: PaymentMethodTetherUsdtBrandIcon,
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
    className?: string;
    currency: THooks.WalletAccountsList['wallet_currency_type'];
    height?: CSSProperties['height'];
    rounded?: boolean;
    size?: keyof typeof defaultIconWidth | keyof typeof roundedIconWidth;
    width?: CSSProperties['width'];
};

const WalletCurrencyIcon: React.FC<TWalletCurrencyIconsProps> = ({
    className,
    currency,
    height,
    rounded = false,
    size = 'md',
    width,
}) => {
    const isFiat = fiatIcons.includes(currency as typeof fiatIcons[number]);
    const IconSize = rounded || isFiat ? roundedIconWidth[size] : defaultIconWidth[size];
    const Icon = rounded || isFiat ? roundedIcons[currency] : defaultIcons[currency];

    if (!Icon) return null;

    return (
        <Icon
            className={className}
            data-testid='dt_wallet_currency_icon'
            height={height ?? '100%'}
            width={width ?? IconSize}
        />
    );
};

export default WalletCurrencyIcon;
