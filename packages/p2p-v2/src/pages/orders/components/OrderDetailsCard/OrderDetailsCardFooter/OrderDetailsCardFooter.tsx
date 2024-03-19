import React from 'react';
import { ExtendedOrderDetails } from '@/hooks/useExtendedOrderDetails';
import { Button, useDevice } from '@deriv-com/ui';
import './OrderDetailsCardFooter.scss';

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
            <div className='p2p-v2-order-details-card-footer justify-end'>
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
            <div className='p2p-v2-order-details-card-footer justify-between'>
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
            <div className='p2p-v2-order-details-card-footer justify-end'>
                <Button className='border-2' size='lg' textSize={textSize} variant='ghost'>
                    Complain
                </Button>
            </div>
        );

    if (shouldShowOnlyReceivedButton)
        return (
            <div className='p2p-v2-order-details-card-footer justify-end'>
                <Button size='lg' textSize={textSize}>
                    I’ve received payment
                </Button>
            </div>
        );

    return null;
};

export default OrderDetailsCardFooter;
