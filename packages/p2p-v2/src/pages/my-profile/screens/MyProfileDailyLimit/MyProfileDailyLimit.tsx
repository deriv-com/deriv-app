import React, { useState } from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import DailyLimitModal from '../../../../components/Modals/DailyLimitModal/DailyLimitModal';
import { useAdvertiserStats, useDevice } from '../../../../hooks';
import './MyProfileDailyLimit.scss';

const MyProfileDailyLimit = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();
    const { data: advertiserStats } = useAdvertiserStats();

    return (
        <>
            <div className='p2p-v2-my-profile-daily-limit'>
                <Text color='less-prominent' lineHeight='sm' size='xs'>
                    Want to increase your daily limits to{' '}
                    <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                        {advertiserStats?.daily_buy_limit} USD{' '}
                    </Text>{' '}
                    (buy) and{' '}
                    <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                        {advertiserStats?.daily_sell_limit} USD{' '}
                    </Text>{' '}
                    (sell)?
                </Text>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    size='xs'
                    textSize={isMobile ? 'sm' : 'xs'}
                    variant='ghost'
                >
                    Increase my limits
                </Button>
            </div>
            {/* TODO: to move the below to parent */}
            <DailyLimitModal currency='USD' isModalOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default MyProfileDailyLimit;
