import React from 'react';
import { ExtendedOrderDetails } from '@/hooks/useExtendedOrderDetails';
import { Button, useDevice } from '@deriv-com/ui';

type TOrderDetailsCardFooterProps = {
    orderDetails: ExtendedOrderDetails;
};

const OrderDetailsCardFooter = ({ orderDetails }: TOrderDetailsCardFooterProps) => {
    const {
        shouldShowCancelAndPaidButton,
        shouldShowComplainAndReceivedButton,
        shouldShowOnlyComplainButton,
        shouldShowOnlyReceivedButton,
    } = orderDetails;
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';

    if (shouldShowCancelAndPaidButton)
        return (
            <div className='flex justify-end gap-4 p-[1.6rem]'>
                <Button className='border-2' color='black' size='lg' textSize={textSize} variant='outlined'>
                    Cancel order
                </Button>
                <Button size='lg' textSize={textSize}>
                    I’ve paid
                </Button>
            </div>
        );

    if (shouldShowComplainAndReceivedButton)
        return (
            <div className='flex justify-between p-[1.6rem]'>
                <Button className='border-2' size='lg' textSize={textSize} variant='ghost'>
                    Complain
                </Button>
                <Button size='lg' textSize={textSize}>
                    I’ve received payment
                </Button>
            </div>
        );

    if (shouldShowOnlyComplainButton)
        return (
            <div className='flex justify-end p-[1.6rem]'>
                <Button className='border-2' size='lg' textSize={textSize} variant='ghost'>
                    Complain
                </Button>
            </div>
        );

    if (shouldShowOnlyReceivedButton)
        return (
            <div className='flex justify-end p-[1.6rem]'>
                <Button size='lg' textSize={textSize}>
                    I’ve received payment
                </Button>
            </div>
        );

    return null;
};

export default OrderDetailsCardFooter;
