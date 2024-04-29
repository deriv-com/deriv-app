/* eslint-disable sort-keys */
import React, { CSSProperties } from 'react';
import {
    AccountsDerivAccountDarkIcon,
    AccountsDerivAccountLightIcon,
    AccountsDerivCtraderIcon,
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5DerivedIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5SwfIcon,
    IconTypes,
    PaymentMethodDerivP2pBrandDarkIcon,
    PaymentMethodDerivP2pBrandIcon,
} from '@deriv/quill-icons';

const MT5MarketIcons: Record<string, IconTypes> = {
    IcWalletMt5All: AccountsDmt5SwfIcon,
    IcWalletMt5CFDs: AccountsDmt5CfdsIcon,
    IcWalletMt5Derived: AccountsDmt5DerivedIcon,
    IcWalletMt5Financial: AccountsDmt5FinancialIcon,
};

const CFDPlatformIcons: Record<string, IconTypes> = {
    IcWalletCTrader: AccountsDerivCtraderIcon,
    IcWalletDerivX: AccountsDerivXIcon,
};

const PlatformIcons: Record<string, IconTypes> = {
    IcWalletDerivP2P: PaymentMethodDerivP2pBrandIcon,
    IcWalletDerivP2PDark: PaymentMethodDerivP2pBrandDarkIcon,
    IcWalletOptionsDark: AccountsDerivAccountDarkIcon,
    IcWalletOptionsLight: AccountsDerivAccountLightIcon,
};

const ICONS: Record<string, IconTypes> = {
    ...MT5MarketIcons,
    ...CFDPlatformIcons,
    ...PlatformIcons,
};

const IconSizes = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
} as const;

type TWalletIconProps = {
    className?: string;
    height?: CSSProperties['height'];
    icon: keyof typeof ICONS;
    size?: keyof typeof IconSizes;
    width?: CSSProperties['width'];
};

const WalletMarketIcon = ({ className = '', height, icon, size = 'md', width }: TWalletIconProps) => {
    const IconSize = IconSizes[size];
    const IconSvg = ICONS[icon];

    if (!IconSvg) {
        return null;
    }

    return (
        <div className={className} data-testid='dt_wallet_icon'>
            <IconSvg height={height ?? IconSize} width={width ?? IconSize} />
        </div>
    );
};

export default WalletMarketIcon;
