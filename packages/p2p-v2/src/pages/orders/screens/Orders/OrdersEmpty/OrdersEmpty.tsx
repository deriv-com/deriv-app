import React from 'react';
import { useHistory } from 'react-router-dom';
import { BASE_URL } from '@/constants';
import { DerivLightOrderIcon } from '@deriv/quill-icons';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';

const OrdersEmpty = () => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'lg' : 'md';
    const history = useHistory();
    return (
        <div className='lg:p-0 py-16 px-[1.6rem]'>
            <ActionScreen
                actionButtons={
                    <Button
                        onClick={() => history.push(`${BASE_URL}/buy-sell`)}
                        size='lg'
                        textSize={isMobile ? 'md' : 'sm'}
                    >
                        Buy/Sell
                    </Button>
                }
                icon={<DerivLightOrderIcon height='128px' width='128px' />}
                title={
                    <Text size={textSize} weight='bold'>
                        You have no orders.
                    </Text>
                }
            />
        </div>
    );
};

export default OrdersEmpty;
