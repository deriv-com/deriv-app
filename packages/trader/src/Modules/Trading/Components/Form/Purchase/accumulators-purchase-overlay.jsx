import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const AccumulatorsPurchaseOverlay = () => (
    <div className='accu-purchase-overlay'>
        <Text weight='bold' size='xs' className='accu-purchase-overlay__caption'>
            {localize('You can only purchase one contract at a time')}
        </Text>
    </div>
);

export default AccumulatorsPurchaseOverlay;
