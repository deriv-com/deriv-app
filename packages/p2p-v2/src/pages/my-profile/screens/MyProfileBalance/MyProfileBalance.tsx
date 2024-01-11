import React from 'react';
import { useAdvertiserInfo } from '@deriv/api';

const MyProfileBalance = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserInfo();

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <div>
            <div>{advertiserInfo?.balance_available}</div>
            <h1>Buy</h1>
            <div>
                <div>
                    <h2>Daily limit</h2>
                    <span>{advertiserInfo?.daily_buy_limit}</span>
                </div>
                <div>
                    <h2>Available</h2>
                    <span>{advertiserInfo?.balance_available}</span>
                </div>
            </div>
            <h1>Sell</h1>
            <div>
                <div>
                    <h2>Daily limit</h2>
                    <span>{advertiserInfo?.daily_sell_limit}</span>
                </div>
            </div>
            <div>
                <h2>Available</h2>
                <span>{advertiserInfo?.balance_available}</span>
            </div>
        </div>
    );
};

export default MyProfileBalance;
