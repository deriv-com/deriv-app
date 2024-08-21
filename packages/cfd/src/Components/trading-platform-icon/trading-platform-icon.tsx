import React from 'react';
import {
    AccountsDerivCtraderIcon,
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5StandardIcon,
    AccountsDmt5SwfIcon,
    AccountsDmt5ZrsIcon,
    QuillSvgProps,
} from '@deriv/quill-icons';

type TPlatformIconKeys = 'Financial' | 'CFDs' | 'CTrader' | 'SwapFree' | 'DerivX' | 'ZeroSpread' | 'Standard';

export const PlatformIcons: Record<TPlatformIconKeys, React.ForwardRefExoticComponent<Omit<QuillSvgProps, 'ref'>>> = {
    Financial: AccountsDmt5FinancialIcon,
    CFDs: AccountsDmt5CfdsIcon,
    CTrader: AccountsDerivCtraderIcon,
    SwapFree: AccountsDmt5SwfIcon,
    DerivX: AccountsDerivXIcon,
    ZeroSpread: AccountsDmt5ZrsIcon,
    Standard: AccountsDmt5StandardIcon,
};

export interface TTradingPlatformIconProps {
    icon: TPlatformIconKeys;
    className?: string;
    size: number;
    onClick?: () => void;
}

const TradingPlatformIcon = ({ icon, className, size, onClick }: TTradingPlatformIconProps) => {
    const IconComponent = PlatformIcons[icon];

    return IconComponent ? (
        <IconComponent fill='#000000' className={className} width={size} height={size} onClick={onClick} />
    ) : null;
};

export default TradingPlatformIcon;
