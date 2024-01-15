import React from 'react';
import {
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyEurIcon,
    CurrencyGbpIcon,
    CurrencyLtcIcon,
    CurrencyUsdcIcon,
    CurrencyUsdIcon,
    CurrencyUsdtIcon,
} from '@deriv/quill-icons';

export const CURRENCY_TYPES = {
    CRYPTO: 'CRYPTO',
    FIAT: 'FIAT',
} as const;

export function getCurrencyConfig(type: keyof typeof CURRENCY_TYPES) {
    if (type === CURRENCY_TYPES.FIAT)
        return [
            {
                icon: () => <CurrencyUsdIcon iconSize='lg' />,
                key: 'USD',
                title: 'US Dollar',
            },
            {
                icon: () => <CurrencyEurIcon iconSize='lg' />,
                key: 'EUR',
                title: 'Euro',
            },
            {
                icon: () => <CurrencyGbpIcon iconSize='lg' />,
                key: 'GBP',
                title: 'Pound Sterling',
            },
        ];

    return [
        {
            icon: () => <CurrencyUsdtIcon iconSize='lg' />,
            key: 'USDT',
            title: 'Tether',
        },
        {
            icon: () => <CurrencyBtcIcon iconSize='lg' />,
            key: 'BTC',
            title: 'Bitcoin',
        },
        {
            icon: () => <CurrencyEthIcon iconSize='lg' />,
            key: 'ETH',
            title: 'Ethereum',
        },
        {
            icon: () => <CurrencyLtcIcon iconSize='lg' />,
            key: 'LTC',
            title: 'Litecoin',
        },
        {
            icon: () => <CurrencyUsdtIcon iconSize='lg' />,
            key: 'eUSDT',
            title: 'Tether ERC20',
        },
        {
            icon: () => <CurrencyUsdcIcon iconSize='lg' />,
            key: 'USDC',
            title: 'USD Coin',
        },
    ];
}
