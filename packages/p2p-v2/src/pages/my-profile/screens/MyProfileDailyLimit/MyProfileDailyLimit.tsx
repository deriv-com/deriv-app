import React, { useState } from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import DailyLimitModal from '../../../../components/Modals/DailyLimitModal/DailyLimitModal';
import { useDevice } from '../../../../hooks';
import './MyProfileDailyLimit.scss';

type TMyProfileDailyLimitProps = {
    buyLimit: number;
    currency: string;
    sellLimit: number;
};

const MyProfileDailyLimit = ({ buyLimit, currency, sellLimit }: TMyProfileDailyLimitProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();

    return (
        <>
            <div className='p2p-v2-my-profile-daily-limit'>
                <Text color='less-prominent' lineHeight='sm' size='xs'>
                    Want to increase your daily limits to{' '}
                    <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                        {buyLimit} {currency}{' '}
                    </Text>{' '}
                    (buy) and{' '}
                    <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                        {sellLimit} {currency}{' '}
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
            <DailyLimitModal
                currency={currency}
                isModalOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default MyProfileDailyLimit;
