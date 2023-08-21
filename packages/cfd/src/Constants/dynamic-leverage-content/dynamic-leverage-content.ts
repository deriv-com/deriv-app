import { localize } from '@deriv/translations';

export const dynamic_leverages = [
    {
        key: 'forex',
        title: localize('Forex majors'),
        description: '',
        leverage: localize('Up to 1:1500'),
        data: [
            {
                from: 0.01,
                to: 1,
                leverage: 1500,
            },
            {
                from: 1.01,
                to: 5,
                leverage: 1000,
            },
            {
                from: 5.01,
                to: 10,
                leverage: 500,
            },
            {
                from: 10.01,
                to: 15,
                leverage: 100,
            },
        ],
    },
    {
        key: 'metals',
        title: localize('Metals'),
        description: localize('(XAUUSD, XAGUSD)'),
        leverage: localize('Up to 1:1000'),
        data: [
            {
                from: 0.01,
                to: 1,
                leverage: 1000,
            },
            {
                from: 1.01,
                to: 5,
                leverage: 500,
            },
            {
                from: 5.01,
                to: 10,
                leverage: 100,
            },
            {
                from: 10.01,
                to: 15,
                leverage: 50,
            },
        ],
    },
    {
        key: 'cryptocurrencies',
        title: localize('Cryptocurrencies'),
        description: localize('(BTCUSD, ETHUSD)'),
        leverage: localize('Up to 1:300'),
        data: [
            {
                from: 0.01,
                to: 1,
                leverage: 300,
            },
            {
                from: 1.01,
                to: 3,
                leverage: 200,
            },
            {
                from: 3.01,
                to: 5,
                leverage: 100,
            },
            {
                from: 5.01,
                to: 10,
                leverage: 50,
            },
        ],
    },
    {
        key: 'stock_indices',
        title: localize('Stock indices'),
        description: localize('(US_30, US_100, US_500)'),
        leverage: localize('Up to 1:300'),
        data: [
            {
                from: 0.1,
                to: 5,
                leverage: 300,
            },
            {
                from: 5.1,
                to: 50,
                leverage: 200,
            },
            {
                from: 50.1,
                to: 5,
                leverage: 100,
            },
        ],
    },
];
