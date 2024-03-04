import React, { useMemo } from 'react';
import clsx from 'clsx';
import { TAdvertiserStats } from 'types';
import { Text, useDevice } from '@deriv-com/ui';
import './ProfileStats.scss';

const ProfileStats = ({ advertiserStats }: { advertiserStats: Partial<TAdvertiserStats> }) => {
    const { isMobile } = useDevice();

    const advertiserStatsList = useMemo(() => {
        if (!advertiserStats) return [];

        const {
            averagePayTime,
            averageReleaseTime,
            buyCompletionRate,
            buyOrdersCount,
            sellCompletionRate,
            sellOrdersCount,
            tradePartners,
            tradeVolume,
        } = advertiserStats;

        return [
            {
                text: 'Buy completion 30d',
                value: buyCompletionRate > 0 ? `${buyCompletionRate}% (${buyOrdersCount})` : '-',
            },
            {
                text: 'Sell completion 30d',
                value: sellCompletionRate > 0 ? `${sellCompletionRate}% (${sellOrdersCount})` : '-',
            },
            { text: 'Trade volume 30d', value: `${tradeVolume.toFixed(2)} USD` },
            { text: 'Avg pay time 30d', value: averagePayTime !== -1 ? `${averagePayTime} min` : '-' },
            { text: 'Avg release time 30d', value: averageReleaseTime !== -1 ? `${averageReleaseTime} min` : '-' },
            { text: 'Trade partners', value: tradePartners },
        ];
    }, [advertiserStats]);

    return (
        <div className='p2p-v2-profile-stats'>
            <div className='p2p-v2-profile-stats__item'>
                {advertiserStatsList.slice(0, 3).map(stat => (
                    <div
                        className={clsx('flex flex-col lg:gap-1 p2p-v2-profile-stats__item-stat', {
                            'border-r-[1px] border-solid border-r-[#ededed]': isMobile,
                        })}
                        key={stat.value + stat.text}
                    >
                        <Text color='less-prominent' size='sm'>
                            {stat.text}
                        </Text>
                        <Text size='xl' weight='bold'>
                            {stat.value}
                        </Text>
                    </div>
                ))}
            </div>
            <div className='p2p-v2-profile-stats__item'>
                {advertiserStatsList.slice(-3).map(stat => (
                    <div
                        className={clsx('flex flex-col lg:gap-1 p2p-v2-profile-stats__item-stat', {
                            'border-none': isMobile,
                        })}
                        key={stat.value + stat.text}
                    >
                        <Text color='less-prominent' size='sm'>
                            {stat.text}
                        </Text>
                        <Text size='xl' weight='bold'>
                            {stat.value}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileStats;
