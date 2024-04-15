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
    btc: <PaymentMethodBitcoinBrandIcon height={40} width={64} />,
    eth: <PaymentMethodEthereumBrandIcon height={40} width={64} />,
    eur: <CurrencyEurIcon iconSize='md' />,
    eusdt: <PaymentMethodTetherUsdtBrandIcon height={40} width={64} />,
    gbp: <CurrencyGbpIcon iconSize='md' />,
    ltc: <PaymentMethodLitecoinBrandIcon height={40} width={64} />,
    tusdt: <PaymentMethodTetherUsdtBrandIcon height={40} width={64} />,
    usd: <CurrencyUsdIcon iconSize='md' />,
    usdc: <PaymentMethodUsdCoinBrandIcon height={40} width={64} />,
    ust: <PaymentMethodTetherUsdtBrandIcon height={40} width={64} />,
};

type TWalletCurrencyIconProps = {
    currency: THooks.AllWalletAccounts['currency'];
};

const WalletAddMoreCurrencyIcon: React.FC<TWalletCurrencyIconProps> = ({ currency }) => (
    <React.Fragment>
        {currenciesIcon[currency as keyof typeof currenciesIcon] ?? <CurrencyPlaceholderIcon iconSize='lg' />}
    </React.Fragment>
);

export default WalletAddMoreCurrencyIcon;
