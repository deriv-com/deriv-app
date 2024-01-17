import React, { useState } from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import MyProfileStatsLimitModal from './MyProfileStatsLimitModal';
import './MyProfileStatsLimitNotification.scss';

type TMyProfileStatsLimitNotificationProps = {
    buyLimit: number;
    currency: string;
    sellLimit: number;
};

const MyProfileStatsLimitNotification = ({ buyLimit, currency, sellLimit }: TMyProfileStatsLimitNotificationProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className='p2p-v2-my-profile-stats-limit-notification'>
                <Text color='less-prominent' lineHeight='sm' size='xs'>
                    Want to increase your daily limits to{' '}
                    <span className='p2p-v2-my-profile-stats-limit-notification--bold'>
                        {buyLimit} {currency}{' '}
                    </span>{' '}
                    (buy) and{' '}
                    <span className='p2p-v2-my-profile-stats-limit-notification--bold'>
                        {sellLimit} {currency}{' '}
                    </span>{' '}
                    (sell)?
                </Text>
                <Button onClick={() => setIsModalOpen(true)} size='xs' textSize='xs' variant='ghost'>
                    Increase my limits
                </Button>
            </div>
            {/* TODO: to move the below to parent */}
            <MyProfileStatsLimitModal
                currency={currency}
                isModalOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default MyProfileStatsLimitNotification;
