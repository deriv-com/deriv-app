import React from 'react';
import { LabelPairedStarLgFillIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';

type TOrderRatingButtonProps = {
    buttonLabel?: string;
    isDetails?: boolean;
};

const OrderRatingButton = ({ buttonLabel = 'Rate', isDetails = false }: TOrderRatingButtonProps) => {
    const { isMobile } = useDevice();
    const onClick = () => {
        // open rating modal
    };

    return (
        <Button className='ml-8 w-fit border-[1px]' color='black' onClick={onClick} variant='outlined'>
            <Text className='flex gap-2' size={isMobile ? 'sm' : 'xs'} weight={isDetails ? 'normal' : 'bold'}>
                <LabelPairedStarLgFillIcon fill='#FFAD3A' height={16} width={16} />
                {buttonLabel}
            </Text>
        </Button>
    );
};

export default OrderRatingButton;
