import React from 'react';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { StandaloneThumbsDownRegularIcon, StandaloneThumbsUpRegularIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';

const RecommendationStatus = () => {
    const { isMobile } = useDevice();
    const { orderDetails } = useOrderDetails();
    const { review_details: reviewDetails } = orderDetails;

    // If the user doesn't select any recommendation, we don't show the recommendation status
    if (reviewDetails?.recommended === null) return null;

    return (
        <Text as='div' className='flex items-center gap-1' color='less-prominent' size={isMobile ? 'sm' : 'xs'}>
            {reviewDetails?.recommended ? (
                <>
                    <StandaloneThumbsUpRegularIcon className='mb-[0.3rem]' fill='#4BB4B3' iconSize='sm' />
                    Recommended
                </>
            ) : (
                <>
                    <StandaloneThumbsDownRegularIcon fill='#ec3f3f' iconSize='sm' />
                    Not Recommended
                </>
            )}
        </Text>
    );
};

export default RecommendationStatus;
