import React, { useEffect } from 'react';
import { useSubscription } from '@deriv/api';

const Wallets: React.FC = () => {
    const { data, subscribe } = useSubscription('ticks');

    useEffect(() => {
        subscribe({ payload: { ticks: 'R_50' } });
    }, [subscribe]);

    return (
        <div
            style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100%',
                fontSize: 30,
            }}
        >
            <h1>Hello from Wallets</h1>
            <br />
            <br />
            <span>symbol: {data?.tick?.symbol}</span>
            <br />
            <span>bid: {data?.tick?.bid}</span>
            <br />
            <span>ask: {data?.tick?.ask}</span>
        </div>
    );
};

export default Wallets;
