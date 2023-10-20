// TODO: hardcoded dynamic leverage values, to be replaced with API call
const dynamic_leverages = [
    {
        key: 'forex',
        title: 'Forex majors',
        description: '',
        leverage: 'Up to 1:1500',
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
        title: 'Metals',
        description: '(XAUUSD, XAGUSD)',
        leverage: 'Up to 1:1000',
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
        title: 'Cryptocurrencies',
        description: '(BTCUSD, ETHUSD)',
        leverage: 'Up to 1:300',
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
        title: 'Stock indices',
        description: '(US_30, US_100, US_500)',
        leverage: 'Up to 1:300',
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

/** A custom hook that gets dynamic leverage values. */
const useDynamicLeverage = () => {
    // TODO: replace with API call once the endpoint is ready.

    return {
        data: dynamic_leverages,
    };
};

export default useDynamicLeverage;
