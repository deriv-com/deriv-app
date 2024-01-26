import React from 'react';
import { useAdvertiserStats, useDevice } from '../../../../hooks';
import InfoOutlineIcon from '../../../../public/ic-info-outline.svg';
import { numberToCurrencyText } from '../../../../utils';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './MyProfileBalance.scss';

const MyProfileBalance = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserStats();
    const { isDesktop } = useDevice();

    if (isLoading || !advertiserInfo) return <h1>Loading...</h1>;

    return (
        <div className='p2p-v2-my-profile-balance'>
            <div className='p2p-v2-my-profile-balance__amount'>
                <div>
                    <Text color='less-prominent' size={isDesktop ? 'sm' : 'md'} weight='normal'>
                        Available Deriv P2P Balance
                    </Text>
                    <InfoOutlineIcon />
                </div>
                <Text size='xl' weight='bold'>
                    {numberToCurrencyText(advertiserInfo.balance_available || 0)} USD
                </Text>
            </div>
            <div className='p2p-v2-my-profile-balance__items'>
                <div className='p2p-v2-my-profile-balance__item'>
                    <Text size='sm'>Buy</Text>
                    <div className='p2p-v2-my-profile-balance__item-limits'>
                        <div>
                            <Text color='less-prominent' size='sm'>
                                Daily limit
                            </Text>
                            <Text className='p2p-v2-my-profile-balance__label' size='sm' weight='bold'>
                                {advertiserInfo?.daily_buy_limit} USD
                            </Text>
                        </div>
                        <div>
                            <Text color='less-prominent' size='sm'>
                                Available
                            </Text>
                            <Text className='p2p-v2-my-profile-balance__label' size='sm' weight='bold'>
                                {numberToCurrencyText(advertiserInfo.dailyAvailableBuyLimit)} USD
                            </Text>
                        </div>
                    </div>
                </div>
                <div className='p2p-v2-my-profile-balance__item'>
                    <Text size='sm'>Sell</Text>
                    <div className='p2p-v2-my-profile-balance__item-limits'>
                        <div>
                            <Text color='less-prominent' size='sm'>
                                Daily limit
                            </Text>
                            <Text className='p2p-v2-my-profile-balance__label' size='sm' weight='bold'>
                                {advertiserInfo?.daily_sell_limit} USD
                            </Text>
                        </div>
                        <div>
                            <Text color='less-prominent' size='sm'>
                                Available
                            </Text>
                            <Text className='p2p-v2-my-profile-balance__label' size='sm' weight='bold'>
                                {numberToCurrencyText(advertiserInfo.dailyAvailableSellLimit)} USD
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileBalance;
