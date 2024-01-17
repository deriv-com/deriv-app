import React from 'react';
import { useAdvertiserStats } from '../../../../hooks';
import InfoOutlineIcon from '../../../../public/ic-info-outline.svg';
import { numberToCurrencyText } from '../../../../utils';
import './MyProfileBalance.scss';

const MyProfileBalance = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserStats();

    if (isLoading || !advertiserInfo) return <h1>Loading...</h1>;

    return (
        <div className='p2p-v2-my-profile-balance'>
            <div className='p2p-v2-my-profile-balance__amount'>
                <div>
                    <h1>Available Deriv P2P Balance</h1>
                    <InfoOutlineIcon />
                </div>
                <span>{numberToCurrencyText(advertiserInfo.balance_available || 0)} USD</span>
            </div>
            <div className='p2p-v2-my-profile-balance__items'>
                <div className='p2p-v2-my-profile-balance__item'>
                    <h1>Buy</h1>
                    <div className='p2p-v2-my-profile-balance__item-limits'>
                        <div>
                            <h1>Daily limit</h1>
                            <span>{advertiserInfo?.daily_buy_limit} USD</span>
                        </div>
                        <div>
                            <h1>Available</h1>
                            <span>{numberToCurrencyText(advertiserInfo.dailyAvailableBuyLimit)} USD</span>
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
                            <span>{numberToCurrencyText(advertiserInfo.dailyAvailableSellLimit)} USD</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileBalance;
