import React, { ComponentType, SVGAttributes } from 'react';
import './WalletBaseIcon.scss';

import IcWalletOptionsLight from '../../public/images/wallet/ic-wallet-options-light.svg';
import IcWalletOptionsDark from '../../public/images/wallet/ic-wallet-options-dark.svg';
import IcWalletDerivP2PLight from '../../public/images/wallet/ic-wallet-deriv-p2p-light.svg';
import IcWalletDerivP2PDark from '../../public/images/wallet/ic-wallet-deriv-p2p-dark.svg';

import IcWalletDerivDemoLight from '../../public/images/wallet/ic-wallet-deriv-demo-light.svg';
import IcWalletDerivDemoDark from '../../public/images/wallet/ic-wallet-deriv-demo-dark.svg';
import IcWalletCurrencyUsd from '../../public/images/wallet/ic-wallet-currency-usd.svg';
import IcWalletCurrencyEur from '../../public/images/wallet/ic-wallet-currency-eur.svg';
import IcWalletCurrencyAud from '../../public/images/wallet/ic-wallet-currency-aud.svg';
import IcWalletCurrencyGbp from '../../public/images/wallet/ic-wallet-currency-gbp.svg';
import IcWalletBitcoinLight from '../../public/images/wallet/ic-wallet-bitcoin-light.svg';
import IcWalletBitcoinDark from '../../public/images/wallet/ic-wallet-bitcoin-dark.svg';
import IcWalletEthereumLight from '../../public/images/wallet/ic-wallet-ethereum-light.svg';
import IcWalletEthereumDark from '../../public/images/wallet/ic-wallet-ethereum-dark.svg';
import IcWalletLiteCoinLight from '../../public/images/wallet/ic-wallet-lite-coin-light.svg';
import IcWalletLiteCoinDark from '../../public/images/wallet/ic-wallet-lite-coin-dark.svg';
import IcWalletUsdCoinLight from '../../public/images/wallet/ic-wallet-usd-coin-light.svg';
import IcWalletUsdCoinDark from '../../public/images/wallet/ic-wallet-usd-coin-dark.svg';
import IcWalletTetherLight from '../../public/images/wallet/ic-wallet-tether-light.svg';
import IcWalletTetherDark from '../../public/images/wallet/ic-wallet-tether-dark.svg';

interface IconTypes {
    [key: string]: ComponentType<SVGAttributes<SVGElement>>;
}

const ICONS: IconTypes = {
    IcWalletOptionsLight,
    IcWalletOptionsDark,
    IcWalletDerivP2PLight,
    IcWalletDerivP2PDark,

    IcWalletDerivDemoLight,
    IcWalletDerivDemoDark,
    IcWalletCurrencyUsd,
    IcWalletCurrencyEur,
    IcWalletCurrencyAud,
    IcWalletCurrencyGbp,
    IcWalletBitcoinLight,
    IcWalletBitcoinDark,
    IcWalletEthereumLight,
    IcWalletEthereumDark,
    IcWalletLiteCoinLight,
    IcWalletLiteCoinDark,
    IcWalletUsdCoinLight,
    IcWalletUsdCoinDark,
    IcWalletTetherDark,
    IcWalletTetherLight,
} as const;

type TWalletIconProps = {
    className?: string;
    icon: string;
};

const WalletBaseIcon = ({ className = '', icon }: TWalletIconProps) => {
    const IconSvg: ComponentType<SVGAttributes<SVGElement>> = ICONS[icon];

    if (!IconSvg) {
        return null;
    }

    return (
        <div className={`wallets-base-icon ${className}`} data-testid='dt_wallet_icon'>
            <IconSvg preserveAspectRatio='xMidYMid meet' />
        </div>
    );
};

export default WalletBaseIcon;
