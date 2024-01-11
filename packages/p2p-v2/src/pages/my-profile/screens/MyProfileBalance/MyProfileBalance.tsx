import React from 'react';
import { useAdvertiserInfo } from '@deriv/api';
import './MyProfileBalance.scss';

const MyProfileBalance = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserInfo();

    if (isLoading) return <h1>Loading...</h1>;

    const balanceText = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'decimal',
    }).format(advertiserInfo?.balance_available || 0);

    return (
        <div className='p2p-v2-my-profile-balance'>
            <div className='p2p-v2-my-profile-balance__amount'>
                <h1>Available Deriv P2P Balance</h1>
                <span>{balanceText} USD</span>
            </div>
            <div className='p2p-v2-my-profile-balance__item'>
                <h1>Buy</h1>
                <div className='p2p-v2-my-profile-balance__item-limits'>
                    <div>
                        <h1>Daily limit</h1>
                        <span>{advertiserInfo?.daily_buy_limit} USD</span>
                    </div>
                    <div>
                        <h1>Available</h1>
                        <span>{advertiserInfo?.balance_available} USD</span>
                    </div>
                </div>
            </div>
            <div className='p2p-v2-my-profile-balance__item'>
                <h1>Sell</h1>
                <div className='p2p-v2-my-profile-balance__item-limits'>
                    <div>
                        <h1>Daily limit</h1>
                        <span>{advertiserInfo?.daily_sell_limit} USD</span>
                    </div>
                    <div>
                        <h1>Available</h1>
                        <span>{advertiserInfo?.balance_available} USD</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileBalance;
