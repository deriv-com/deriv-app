/* eslint-disable camelcase */
import React from 'react';
import clsx from 'clsx';
import { TAdvertiserStats } from 'types';
import { OnlineStatusIcon, OnlineStatusLabel, StarRating } from '@/components';
import { getCurrentRoute } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';
import ThumbUpIcon from '../../public/ic-thumb-up.svg';
import BlockedUserOutlineIcon from '../../public/ic-user-blocked-outline.svg';
import './AdvertiserNameStats.scss';

/**
 * This component is to show an advertiser's stats, in UI its commonly used under an advertiser's name
 * Example:
 * Joined 2d | Not rated yet | x x x x x (5 ratings)
 *
 * Use cases are to show this in My Profile and Advertiser page
 */
const AdvertiserNameStats = ({ advertiserStats }: { advertiserStats: TAdvertiserStats }) => {
    const { isMobile } = useDevice();
    const isMyProfile = getCurrentRoute() === 'my-profile';

    const {
        blocked_by_count,
        daysSinceJoined,
        is_online,
        last_online_time,
        rating_average,
        rating_count,
        recommended_average,
    } = advertiserStats || {};

    return (
        <div
            className={clsx('p2p-v2-advertiser-name-stats', {
                'gap-2': !isMyProfile && isMobile,
            })}
            data-testid='dt_p2p_v2_advertiser_name_stats'
        >
            <div>
                {!isMyProfile && (
                    <div className='border-r-[1px] border-solid border-r-[#ededed]'>
                        <OnlineStatusIcon isOnline={is_online} isRelative size='0.8em' />
                        <OnlineStatusLabel isOnline={is_online} lastOnlineTime={last_online_time} />
                    </div>
                )}
                <Text color='less-prominent' size='sm'>
                    Joined {daysSinceJoined}d
                </Text>
            </div>
            {!rating_average && (
                <div>
                    <Text color='less-prominent' size='sm'>
                        Not rated yet
                    </Text>
                </div>
            )}
            {rating_average && (
                <>
                    <div>
                        <div className='p2p-v2-advertiser-name-stats__rating'>
                            {isMobile && (
                                <Text color='less-prominent' size='sm'>
                                    ({rating_average})
                                </Text>
                            )}
                            <StarRating isReadonly ratingValue={rating_average} />
                            <Text color='less-prominent' size='sm'>
                                ({rating_count} ratings)
                            </Text>
                        </div>
                    </div>
                    <div>
                        <ThumbUpIcon />
                        <Text color='less-prominent' size='sm'>
                            {recommended_average || 0}%
                        </Text>
                    </div>
                </>
            )}
            {isMyProfile && (
                <div>
                    <BlockedUserOutlineIcon />
                    <Text color='less-prominent' size='sm'>
                        {blocked_by_count || 0}
                    </Text>
                </div>
            )}
        </div>
    );
};
AdvertiserNameStats.displayName = 'AdvertiserNameStats';

export default AdvertiserNameStats;
