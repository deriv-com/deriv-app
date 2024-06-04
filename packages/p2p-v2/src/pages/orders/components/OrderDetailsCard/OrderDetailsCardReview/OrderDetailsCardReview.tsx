import React, { useEffect, useState } from 'react';
import { StarRating } from '@/components';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { getDateAfterHours } from '@/utils';
import { p2p } from '@deriv/api-v2';
import { StandaloneStarFillIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { RecommendationStatus } from './RecommendationStatus';

const OrderDetailsCardReview = () => {
    const { orderDetails } = useOrderDetails();
    const {
        completion_time: completionTime,
        hasReviewDetails,
        is_reviewable: isReviewable,
        isCompletedOrder,
        review_details: reviewDetails,
    } = orderDetails;
    const { data: p2pSettingsData } = p2p.settings.useGetSettings();
    const [remainingReviewTime, setRemainingReviewTime] = useState<string | null>(null);
    const ratingAverageDecimals = reviewDetails ? Number(Number(reviewDetails.rating).toFixed(1)) : 0;
    const { isMobile } = useDevice();

    useEffect(() => {
        if (completionTime && p2pSettingsData?.review_period) {
            setRemainingReviewTime(getDateAfterHours(completionTime, p2pSettingsData.review_period));
        }
    }, [completionTime, p2pSettingsData?.review_period]);

    if (isCompletedOrder && !hasReviewDetails)
        return (
            <div className='flex flex-col px-[1.6rem] py-10 gap-3'>
                <Button
                    className='border-[1px] gap-[0.2rem] pl-4 pr-[1.4rem] w-fit'
                    color='black'
                    disabled={!isReviewable}
                    icon={<StandaloneStarFillIcon fill='#FFAD3A' height={18} width={18} />}
                    variant='outlined'
                >
                    <Text size={isMobile ? 'sm' : 'xs'}>{isReviewable ? 'Rate this transaction' : 'Not rated'}</Text>
                </Button>
                <Text color='less-prominent' size={isMobile ? 'xs' : '2xs'}>
                    {isReviewable
                        ? `You have until ${remainingReviewTime} GMT to rate this transaction.`
                        : 'You can no longer rate this transaction.'}
                </Text>
            </div>
        );

    if (hasReviewDetails) {
        return (
            <div className='flex flex-col px-[1.6rem] py-10 gap-4'>
                <Text weight='bold'>Your transaction experience</Text>
                <div className='flex justify-between w-4/5 ml-2'>
                    <StarRating isReadonly ratingValue={ratingAverageDecimals} starsScale={1.2} />
                    <RecommendationStatus />
                </div>
            </div>
        );
    }

    return null;
};

export default OrderDetailsCardReview;
