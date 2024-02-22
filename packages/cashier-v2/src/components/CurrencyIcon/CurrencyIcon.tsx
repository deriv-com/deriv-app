/* eslint-disable sort-keys */
import React from 'react';
import {
    CurrencyAudIcon as AUD,
    CurrencyBtcIcon as BTC,
    CurrencyEthIcon as ETH,
    CurrencyEurIcon as EUR,
    CurrencyGbpIcon as GBP,
    CurrencyLtcIcon as LTC,
    CurrencyUsdcIcon as USDC,
    CurrencyUsdIcon as USD,
    CurrencyUsdtIcon as Tether,
    IconTypes,
} from '@deriv/quill-icons';

const iconMapper: Record<string, IconTypes> = {
    AUD,
    EUR,
    GBP,
    USD,
    BTC,
    ETH,
    eUSDT: Tether,
    LTC,
    tUSDT: Tether,
    USDC,
    UST: Tether,
};

type TProps = {
    currency: keyof typeof iconMapper;
    size: 'lg' | 'md' | 'sm' | 'xl';
};

const CurrencyIcon: React.FC<TProps> = ({ currency, size }) => {
    const Icon = iconMapper[currency];

    return <Icon iconSize={size} />;
};

export default CurrencyIcon;
