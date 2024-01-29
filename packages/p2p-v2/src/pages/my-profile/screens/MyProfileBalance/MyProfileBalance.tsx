import React, { useState } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { DailyLimitModal } from '../../../../components';
import { useAdvertiserStats, useDevice } from '../../../../hooks';
import InfoOutlineIcon from '../../../../public/ic-info-outline.svg';
import { numberToCurrencyText } from '../../../../utils';
import './MyProfileBalance.scss';

const MyProfileBalance = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserStats();
    const { isDesktop } = useDevice();
    const [shouldShowDailyLimitModal, setShouldShowDailyLimitModal] = useState(false);

    if (isLoading || !advertiserInfo) return <h1>Loading...</h1>;

    return (
        <>
            <DailyLimitModal
                currency='USD'
                isModalOpen={shouldShowDailyLimitModal}
                onRequestClose={() => setShouldShowDailyLimitModal(false)}
            />
            <div className='p2p-v2-my-profile-balance'>
                <div className='p2p-v2-my-profile-balance__amount'>
                    <div>
                        <Text color='less-prominent' size={isDesktop ? 'sm' : 'md'}>
                            Available Deriv P2P Balance
                        </Text>
                        <InfoOutlineIcon />
                    </div>
                    <Text size='xl' weight='bold'>
                        {numberToCurrencyText(advertiserInfo.balance_available || 0)} USD
                    </Text>
                </div>
                <div className='flex flex-col gap-[1.6rem]'>
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
                    <div className='p2p-v2-my-profile-balance__daily-limits'>
                        <Text color='less-prominent' size='xs'>
                            Want to increase your daily limits to <strong>{advertiserInfo?.daily_buy_limit} USD</strong>{' '}
                            (buy) and <strong>{advertiserInfo?.daily_sell_limit} USD</strong> (sell)?
                        </Text>
                        <button className='' onClick={() => setShouldShowDailyLimitModal(true)}>
                            <Text color='error' size='xs' weight='bold'>
                                Increase my limits
                            </Text>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyProfileBalance;
