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
                id: 'USD',
                title: 'US Dollar',
            },
            {
                icon: () => <CurrencyEurIcon iconSize='lg' />,
                id: 'EUR',
                title: 'Euro',
            },
            {
                icon: () => <CurrencyGbpIcon iconSize='lg' />,
                id: 'GBP',
                title: 'Pound Sterling',
            },
        ];

    return [
        {
            icon: () => <CurrencyUsdtIcon iconSize='lg' />,
            id: 'USDT',
            info: true,
            title: 'Tether',
        },
        {
            icon: () => <CurrencyBtcIcon iconSize='lg' />,
            id: 'BTC',
            title: 'Bitcoin',
        },
        {
            icon: () => <CurrencyEthIcon iconSize='lg' />,
            id: 'ETH',
            title: 'Ethereum',
        },
        {
            icon: () => <CurrencyLtcIcon iconSize='lg' />,
            id: 'LTC',
            title: 'Litecoin',
        },
        {
            icon: () => <CurrencyUsdtIcon iconSize='lg' />,
            id: 'eUSDT',
            info: true,
            title: 'Tether ERC20',
        },
        {
            icon: () => <CurrencyUsdcIcon iconSize='lg' />,
            id: 'USDC',
            title: 'USD Coin',
        },
    ];
}
