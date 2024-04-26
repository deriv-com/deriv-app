import React, { ComponentType, SVGAttributes } from 'react';
import IcWalletCTrader from '../../public/images/ctrader.svg';
import IcWalletDerivX from '../../public/images/derivx.svg';
import IcWalletMt5CFDs from '../../public/images/mt5-cfds.svg';
import IcWalletMt5Derived from '../../public/images/mt5-derived.svg';
import IcWalletMt5Financial from '../../public/images/mt5-financial.svg';
import IcWalletMt5All from '../../public/images/mt5-swap-free.svg';
import IcWalletDerivP2PDark from '../../public/images/wallet/ic-wallet-deriv-p2p-dark.svg';
import IcWalletDerivP2PLight from '../../public/images/wallet/ic-wallet-deriv-p2p-light.svg';
import IcWalletOptionsDark from '../../public/images/wallet/ic-wallet-options-dark.svg';
import IcWalletOptionsLight from '../../public/images/wallet/ic-wallet-options-light.svg';
import './WalletResponsiveSvg.scss';

interface IconTypes {
    [key: string]: ComponentType<SVGAttributes<SVGElement>>;
}

const ICONS: IconTypes = {
    IcWalletCTrader,
    IcWalletDerivP2PDark,
    IcWalletDerivP2PLight,
    IcWalletDerivX,
    IcWalletMt5All,
    IcWalletMt5CFDs,
    IcWalletMt5Derived,
    IcWalletMt5Financial,
    IcWalletOptionsDark,
    IcWalletOptionsLight,
} as const;

type TWalletIconProps = {
    className?: string;
    icon: keyof typeof ICONS;
};

const WalletResponsiveSvg = ({ className = '', icon }: TWalletIconProps) => {
    const IconSvg: ComponentType<SVGAttributes<SVGElement>> = ICONS[icon];

    if (!IconSvg) {
        return null;
    }

    return (
        <div className={`wallets-responsive-svg ${className}`} data-testid='dt_wallet_icon'>
            <IconSvg preserveAspectRatio='xMidYMid meet' />
        </div>
    );
};

export default WalletResponsiveSvg;
