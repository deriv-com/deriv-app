import React, { ComponentType, SVGAttributes } from 'react';
import IcWalletCTrader from '../../public/images/ctrader.svg';
import IcWalletCurrencyAud from '../../public/images/currencies/aud.svg';
import IcWalletBitcoinLight from '../../public/images/currencies/btc.svg';
import IcWalletBitcoinDark from '../../public/images/currencies/btc-dark.svg';
import IcWalletEthereumLight from '../../public/images/currencies/eth.svg';
import IcWalletEthereumDark from '../../public/images/currencies/eth-dark.svg';
import IcWalletCurrencyEur from '../../public/images/currencies/eur.svg';
import IcWalletCurrencyGbp from '../../public/images/currencies/gbp.svg';
import IcWalletLiteCoinLight from '../../public/images/currencies/ltc.svg';
import IcWalletLiteCoinDark from '../../public/images/currencies/ltc-dark.svg';
import IcWalletCurrencyUsd from '../../public/images/currencies/usd.svg';
import IcWalletUsdCoinLight from '../../public/images/currencies/usdc.svg';
import IcWalletUsdCoinDark from '../../public/images/currencies/usdc-dark.svg';
import IcWalletTetherLight from '../../public/images/currencies/usdt.svg';
import IcWalletTetherDark from '../../public/images/currencies/usdt-dark.svg';
import IcWalletDerivX from '../../public/images/derivx.svg';
import IcWalletMt5CFDs from '../../public/images/mt5-cfds.svg';
import IcWalletMt5Derived from '../../public/images/mt5-derived.svg';
import IcWalletMt5Financial from '../../public/images/mt5-financial.svg';
import IcWalletMt5All from '../../public/images/mt5-swap-free.svg';
import IcWalletDerivDemoDark from '../../public/images/wallet/ic-wallet-deriv-demo-dark.svg';
import IcWalletDerivDemoLight from '../../public/images/wallet/ic-wallet-deriv-demo-light.svg';
import IcWalletDerivP2PDark from '../../public/images/wallet/ic-wallet-deriv-p2p-dark.svg';
import IcWalletDerivP2PLight from '../../public/images/wallet/ic-wallet-deriv-p2p-light.svg';
import IcWalletOptionsDark from '../../public/images/wallet/ic-wallet-options-dark.svg';
import IcWalletOptionsLight from '../../public/images/wallet/ic-wallet-options-light.svg';
import './WalletResponsiveSvg.scss';

interface IconTypes {
    [key: string]: ComponentType<SVGAttributes<SVGElement>>;
}

const ICONS: IconTypes = {
    IcWalletBitcoinDark,
    IcWalletBitcoinLight,
    IcWalletCTrader,
    IcWalletCurrencyAud,
    IcWalletCurrencyEur,
    IcWalletCurrencyGbp,
    IcWalletCurrencyUsd,
    IcWalletDerivDemoDark,
    IcWalletDerivDemoLight,
    IcWalletDerivP2PDark,
    IcWalletDerivP2PLight,
    IcWalletDerivX,
    IcWalletEthereumDark,
    IcWalletEthereumLight,
    IcWalletLiteCoinDark,
    IcWalletLiteCoinLight,
    IcWalletMt5All,
    IcWalletMt5CFDs,
    IcWalletMt5Derived,
    IcWalletMt5Financial,
    IcWalletOptionsDark,
    IcWalletOptionsLight,
    IcWalletTetherDark,
    IcWalletTetherLight,
    IcWalletUsdCoinDark,
    IcWalletUsdCoinLight,
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
