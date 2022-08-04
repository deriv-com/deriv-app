import * as React from 'react';
import { useStores } from 'Stores';

const TradingHub = () => {
    const { client } = useStores();

    return (
        <div className='trading-hub'>
            {client.has_wallet_account && (
                <div
                    style={{
                        display: 'flex',
                        background: 'pink',
                        margin: '30px 20px',
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            background: 'red',
                        }}
                    >
                        content
                    </div>
                    <div>arrow</div>
                </div>
            )}
        </div>
    );
};

export default TradingHub;
