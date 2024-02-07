import React, { CSSProperties, ElementType } from 'react';
import {
    AccountsDerivAccountLightIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5DerivedIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5SwfIcon,
    DerivProductDerivBotBrandLightLogoHorizontalIcon,
    DerivProductDerivGoBrandLightLogoHorizontalIcon,
    DerivProductDerivTraderBrandLightLogoHorizontalIcon,
    DerivProductDerivXBrandLightLogoIcon,
    PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    PartnersProductDerivCtraderBrandLightLogoHorizontalIcon,
    PartnersProductSmarttraderBrandLightLogoIcon,
} from '@deriv/quill-icons';

interface IconProps<T> {
    className?: string;
    height?: CSSProperties['height'];
    icon: T;
    onClick?: () => void;
    width?: CSSProperties['width'];
}

export const PlatformIcons: Record<string, ElementType> = {
    BinaryBot: PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    CFDs: AccountsDmt5CfdsIcon,
    CTrader: PartnersProductDerivCtraderBrandLightLogoHorizontalIcon,
    DBot: DerivProductDerivBotBrandLightLogoHorizontalIcon,
    DerivApps: AccountsDerivAccountLightIcon,
    Derived: AccountsDmt5DerivedIcon,
    DerivGo: DerivProductDerivGoBrandLightLogoHorizontalIcon,
    DerivX: DerivProductDerivXBrandLightLogoIcon,
    DTrader: DerivProductDerivTraderBrandLightLogoHorizontalIcon,
    Financial: AccountsDmt5FinancialIcon,
    SmartTrader: PartnersProductSmarttraderBrandLightLogoIcon,
    SwapFree: AccountsDmt5SwfIcon,
};

const PlatformIcon = ({ className, height = 48, icon, onClick, width = 48 }: IconProps<keyof typeof PlatformIcons>) => {
    const TradingPlatformIcon = PlatformIcons[icon] as ElementType;

    return TradingPlatformIcon ? (
        <TradingPlatformIcon className={className} height={height} onClick={onClick} width={width} />
    ) : null;
};

export default PlatformIcon;
