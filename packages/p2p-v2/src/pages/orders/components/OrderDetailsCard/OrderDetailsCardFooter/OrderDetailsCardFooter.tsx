import React from 'react';
import { useOrderDetails } from '@/pages/orders/screens/OrderDetails/OrderDetailsProvider';
import { Button, useDevice } from '@deriv-com/ui';
import './OrderDetailsCardFooter.scss';

// TODO: Implement functionality for each button when integrating with the API
const OrderDetailsCardFooter = () => {
    const orderDetails = useOrderDetails();
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
            <div className='p2p-v2-order-details-card-footer justify-end gap-3'>
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
                <Button className='border-2' color='primary-light' size='lg' textSize={textSize} variant='ghost'>
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
                <Button className='border-2' color='primary-light' size='lg' textSize={textSize} variant='ghost'>
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
