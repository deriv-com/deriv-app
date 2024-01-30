import React, { CSSProperties, ElementType } from 'react';
import {
    DerivProductDerivBotBrandLightLogoHorizontalIcon,
    DerivProductDerivGoBrandLightLogoHorizontalIcon,
    DerivProductDerivTraderBrandLightLogoHorizontalIcon,
    DerivProductDerivXBrandLightLogoIcon,
    PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    PartnersProductDerivCtraderBrandLightLogoHorizontalIcon,
    PartnersProductSmarttraderBrandLightLogoIcon,
    PlatformsDerivAppsLightIcon,
    PlatformsDmt5CFDsIcon,
    PlatformsDmt5DerivedIcon,
    PlatformsDmt5FinancialIcon,
    PlatformsDmt5SWFIcon,
} from '@deriv/quill-icons';

interface IconProps<T> {
    className?: string;
    height?: CSSProperties['height'];
    icon: T;
    onClick?: () => void;
    width?: CSSProperties['width'];
}

export const PlatformIcons = {
    BinaryBot: PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    CFDs: PlatformsDmt5CFDsIcon,
    CTrader: PartnersProductDerivCtraderBrandLightLogoHorizontalIcon,
    DBot: DerivProductDerivBotBrandLightLogoHorizontalIcon,
    DerivApps: PlatformsDerivAppsLightIcon,
    Derived: PlatformsDmt5DerivedIcon,
    DerivGo: DerivProductDerivGoBrandLightLogoHorizontalIcon,
    DerivX: DerivProductDerivXBrandLightLogoIcon,
    DTrader: DerivProductDerivTraderBrandLightLogoHorizontalIcon,
    Financial: PlatformsDmt5FinancialIcon,
    SmartTrader: PartnersProductSmarttraderBrandLightLogoIcon,
    SwapFree: PlatformsDmt5SWFIcon,
};

const PlatformIcon = ({
    className,
    height = '48px',
    icon,
    onClick,
    width = '48px',
}: IconProps<keyof typeof PlatformIcons>) => {
    const TradingPlatformIcon = PlatformIcons[icon] as ElementType;

    return TradingPlatformIcon ? (
        <TradingPlatformIcon className={className} height={height} onClick={onClick} width={width} />
    ) : null;
};

export default PlatformIcon;
