import React from 'react';
import { useAdvertiserStats } from '../../hooks';
import { StarRating } from '../StarRating';
import ThumbUpIcon from '../../public/ic-thumb-up.svg';
import BlockedUserOutlineIcon from '../../public/ic-user-blocked-outline.svg';
import './AdvertiserNameStats.scss';

const AdvertiserNameStats = () => {
    const { data: advertiserStats, isLoading } = useAdvertiserStats();

    // TODO: Use Skeleton loader here
    if (isLoading || !advertiserStats) return <h1>Loading...</h1>;

    const { blocked_by_count, daysSinceJoined, rating_average, rating_count, recommended_average } = advertiserStats;

    return (
        <div className='p2p-v2-advertiser-name-stats'>
            <div>
                <h2>Joined {daysSinceJoined}d</h2>
            </div>
            {!rating_average && (
                <div>
                    <h2>Not rated yet</h2>
                </div>
            )}
            {rating_average && (
                <>
                    <div>
                        <div className='p2p-v2-advertiser-name-stats__rating'>
                            <StarRating ratingValue={rating_average} />
                            <h2>({rating_count} ratings)</h2>
                        </div>
                    </div>
                    <div>
                        <ThumbUpIcon />
                        <h2>{recommended_average || 0}%</h2>
                    </div>
                </>
            )}
            <div>
                <BlockedUserOutlineIcon />
                <h2>{blocked_by_count}</h2>
            </div>
        </div>
    );
};
AdvertiserNameStats.displayName = 'AdvertiserNameStats';

export default AdvertiserNameStats;
