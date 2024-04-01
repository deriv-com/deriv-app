import React from 'react';
import {
    CurrencyAudIcon,
    CurrencyEurIcon,
    CurrencyGbpIcon,
    CurrencyPlaceholderIcon,
    CurrencyUsdIcon,
    PaymentMethodBitcoinBrandIcon,
    PaymentMethodEthereumBrandIcon,
    PaymentMethodLitecoinBrandIcon,
    PaymentMethodTetherUsdtBrandIcon,
    PaymentMethodUsdCoinBrandIcon,
} from '@deriv/quill-icons';
import { THooks } from '../../types';

const currenciesIcon = {
    aud: <CurrencyAudIcon iconSize='md' />,
    btc: <PaymentMethodBitcoinBrandIcon height={49} width={32} />,
    eth: <PaymentMethodEthereumBrandIcon height={49} width={30} />,
    eur: <CurrencyEurIcon iconSize='md' />,
    eusdt: <PaymentMethodTetherUsdtBrandIcon height={49} width={32} />,
    gbp: <CurrencyGbpIcon iconSize='md' />,
    ltc: <PaymentMethodLitecoinBrandIcon height={49} width={32} />,
    tusdt: <PaymentMethodTetherUsdtBrandIcon height={49} width={32} />,
    usd: <CurrencyUsdIcon iconSize='md' />,
    usdc: <PaymentMethodUsdCoinBrandIcon height={49} width={32} />,
    ust: <PaymentMethodTetherUsdtBrandIcon height={49} width={32} />,
};

type TWalletCurrencyIconProps = {
    currency: THooks.AllWalletAccounts['currency'];
};

const WalletAddMoreCurrencyIcon: React.FC<TWalletCurrencyIconProps> = ({ currency }) => (
    <div className='wallets-add-more-currency-icon'>
        {currenciesIcon[currency as keyof typeof currenciesIcon] ?? <CurrencyPlaceholderIcon iconSize='lg' />}
    </div>
);

export default WalletAddMoreCurrencyIcon;
