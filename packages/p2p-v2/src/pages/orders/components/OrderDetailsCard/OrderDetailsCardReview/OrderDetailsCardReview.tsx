import React, { useEffect, useState } from 'react';
import { StarRating } from '@/components';
import { useOrderDetails } from '@/pages/orders/screens/OrderDetails/OrderDetailsProvider';
import { getDateAfterHours } from '@/utils';
import { p2p } from '@deriv/api-v2';
import {
    StandaloneStarFillIcon,
    StandaloneThumbsDownRegularIcon,
    StandaloneThumbsUpRegularIcon,
} from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';

const OrderDetailsCardReview = () => {
    const orderDetails = useOrderDetails();
    const {
        completion_time: completionTime,
        hasReviewDetails,
        isCompletedOrder,
        review_details: reviewDetails,
    } = orderDetails;
    const { data: p2pSettingsData } = p2p.settings.useGetSettings();
    const [remainingReviewTime, setRemainingReviewTime] = useState<string | null>(null);

    const ratingAverageDecimals = reviewDetails ? Number(Number(reviewDetails.rating).toFixed(1)) : 0;

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
                    icon={<StandaloneStarFillIcon fill='#FFAD3A' height={18} width={18} />}
                    variant='outlined'
                >
                    <Text size='xs'>Rate this transaction</Text>
                </Button>
                <Text color='less-prominent' size='2xs'>
                    You have until {remainingReviewTime} GMT to rate this transaction.
                </Text>
            </div>
        );

    if (hasReviewDetails) {
        return (
            <div className='flex flex-col px-[1.6rem] py-10 gap-4'>
                <Text weight='bold'>Your transaction experience</Text>
                <div className='flex justify-between w-4/5 ml-2'>
                    <StarRating isReadonly ratingValue={ratingAverageDecimals} starsScale={1.2} />
                    <Text as='div' className='flex items-center gap-1' color='less-prominent' size='xs'>
                        {reviewDetails?.recommended !== null &&
                            (reviewDetails?.recommended ? (
                                <>
                                    <StandaloneThumbsUpRegularIcon
                                        className='mb-[0.3rem]'
                                        fill='#4BB4B3'
                                        iconSize='sm'
                                    />
                                    Recommended
                                </>
                            ) : (
                                <>
                                    <StandaloneThumbsDownRegularIcon
                                        className='mb-[0.3rem]'
                                        fill='#ec3f3f'
                                        iconSize='sm'
                                    />
                                    Not Recommended
                                </>
                            ))}
                    </Text>
                </div>
            </div>
        );
    }

    return null;
};

export default OrderDetailsCardReview;
