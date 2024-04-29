/* eslint-disable sort-keys */
import React, { CSSProperties } from 'react';
import classNames from 'classnames';
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
import './WalletResponsiveSvg.scss';

// TODO: Remove all the commented out imports with the SVGs
// import IcWalletCTrader from '../../public/images/ctrader.svg';
// import IcWalletDerivX from '../../public/images/derivx.svg';
// import IcWalletMt5CFDs from '../../public/images/mt5-cfds.svg';
// import IcWalletMt5Derived from '../../public/images/mt5-derived.svg';
// import IcWalletMt5Financial from '../../public/images/mt5-financial.svg';
// import IcWalletMt5All from '../../public/images/mt5-swap-free.svg';
// import IcWalletDerivP2PDark from '../../public/images/wallet/ic-wallet-deriv-p2p-dark.svg';
// import IcWalletDerivP2PLight from '../../public/images/wallet/ic-wallet-deriv-p2p-light.svg';
// import IcWalletOptionsDark from '../../public/images/wallet/ic-wallet-options-dark.svg';
// import IcWalletOptionsLight from '../../public/images/wallet/ic-wallet-options-light.svg';

const ICONS: Record<string, IconTypes> = {
    IcWalletCTrader: AccountsDerivCtraderIcon,
    IcWalletDerivP2P: PaymentMethodDerivP2pBrandIcon,
    IcWalletDerivP2PDark: PaymentMethodDerivP2pBrandDarkIcon,
    IcWalletDerivX: AccountsDerivXIcon,
    IcWalletMt5All: AccountsDmt5SwfIcon,
    IcWalletMt5CFDs: AccountsDmt5CfdsIcon,
    IcWalletMt5Derived: AccountsDmt5DerivedIcon,
    IcWalletMt5Financial: AccountsDmt5FinancialIcon,
    IcWalletOptionsDark: AccountsDerivAccountDarkIcon,
    IcWalletOptionsLight: AccountsDerivAccountLightIcon,
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

const WalletResponsiveSvg = ({ className = '', height, icon, size = 'md', width }: TWalletIconProps) => {
    const IconSize = IconSizes[size];
    const IconSvg = ICONS[icon];

    if (!IconSvg) {
        return null;
    }

    return (
        <div className={classNames('wallets-responsive-svg', className)} data-testid='dt_wallet_icon'>
            <IconSvg height={height ?? IconSize} width={width ?? IconSize} />
        </div>
    );
};

export default WalletResponsiveSvg;
