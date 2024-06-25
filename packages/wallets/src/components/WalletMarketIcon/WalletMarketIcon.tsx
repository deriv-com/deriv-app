/* eslint-disable sort-keys */
import React, { CSSProperties } from 'react';
import {
    AccountsDerivAccountDarkIcon,
    AccountsDerivAccountLightIcon,
    AccountsDerivCtraderIcon,
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5StandardIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5SwfIcon,
    DerivProductDerivBotBrandLightLogoHorizontalIcon,
    DerivProductDerivGoBrandLightLogoHorizontalIcon,
    DerivProductDerivTraderBrandLightLogoHorizontalIcon,
    PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    PartnersProductSmarttraderBrandLightLogoIcon,
    PaymentMethodDerivP2pBrandDarkIcon,
    PaymentMethodDerivP2pBrandIcon,
} from '@deriv/quill-icons';
import { TIconTypes } from '../../types';

const MT5MarketIcons: TIconTypes = {
    IcWalletMt5All: AccountsDmt5SwfIcon,
    IcWalletMt5CFDs: AccountsDmt5CfdsIcon,
    IcWalletMt5Derived: AccountsDmt5StandardIcon,
    IcWalletMt5Financial: AccountsDmt5FinancialIcon,
};

const CFDPlatformIcons: TIconTypes = {
    IcWalletCTrader: AccountsDerivCtraderIcon,
    IcWalletDerivX: AccountsDerivXIcon,
};

const AppIcons = {
    binarybot: PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    bot: DerivProductDerivBotBrandLightLogoHorizontalIcon,
    derivgo: DerivProductDerivGoBrandLightLogoHorizontalIcon,
    smarttrader: PartnersProductSmarttraderBrandLightLogoIcon,
    trader: DerivProductDerivTraderBrandLightLogoHorizontalIcon,
};

const PlatformIcons: TIconTypes = {
    IcWalletDerivP2P: PaymentMethodDerivP2pBrandIcon,
    IcWalletDerivP2PDark: PaymentMethodDerivP2pBrandDarkIcon,
    IcWalletOptionsDark: AccountsDerivAccountDarkIcon,
    IcWalletOptionsLight: AccountsDerivAccountLightIcon,
};

const Icons: TIconTypes = {
    ...AppIcons,
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
    icon: keyof typeof Icons;
    size?: keyof typeof IconSizes;
    width?: CSSProperties['width'];
};

const WalletMarketIcon = ({ className = '', height, icon, size = 'md', width }: TWalletIconProps) => {
    const IconSize = IconSizes[size];
    const Icon = Icons[icon];

    if (!Icon) {
        return null;
    }

    return (
        <Icon
            className={className}
            data-testid='dt_wallet_icon'
            height={height ?? IconSize}
            width={width ?? IconSize}
        />
    );
};

export default WalletMarketIcon;
