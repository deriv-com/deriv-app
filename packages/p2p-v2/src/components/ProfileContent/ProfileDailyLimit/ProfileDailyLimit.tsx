import React, { useState } from 'react';
import { DailyLimitModal } from '@/components/Modals';
import { useAdvertiserStats, useDevice } from '@/hooks';
import { useActiveAccount } from '@deriv/api-v2';
import { Button, Text } from '@deriv-com/ui';
import './ProfileDailyLimit.scss';

const ProfileDailyLimit = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();
    const { data: advertiserStats } = useAdvertiserStats();
    const { data: activeAccount } = useActiveAccount();

    return (
        <>
            <div className='p2p-v2-profile-daily-limit' data-testid='dt_p2p_v2_profile_daily_limit'>
                <Text color='less-prominent' lineHeight='sm' size='xs'>
                    Want to increase your daily limits to{' '}
                    <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                        {advertiserStats?.daily_buy_limit} {activeAccount?.currency || 'USD'}{' '}
                    </Text>{' '}
                    (buy) and{' '}
                    <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                        {advertiserStats?.daily_sell_limit} {activeAccount?.currency || 'USD'}{' '}
                    </Text>{' '}
                    (sell)?
                </Text>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    size='sm'
                    textSize={isMobile ? 'sm' : 'xs'}
                    variant='ghost'
                >
                    Increase my limits
                </Button>
            </div>
            <DailyLimitModal
                currency={activeAccount?.currency || 'USD'}
                isModalOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default ProfileDailyLimit;
