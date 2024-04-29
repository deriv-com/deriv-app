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

const WalletMarketIcon = ({ className = '', height, icon, size = 'md', width }: TWalletIconProps) => {
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

export default WalletMarketIcon;
