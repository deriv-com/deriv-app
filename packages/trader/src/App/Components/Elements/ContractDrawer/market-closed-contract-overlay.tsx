import React from 'react';
import { Text } from '@deriv/components';

const MarketClosedContractOverlay = ({ validation_error }: { validation_error?: string }) => (
    <div className='contract-card__market-closed'>
        <Text align='center' as='p' className='contract-card__market-closed__title' weight='bold'>
            {validation_error}
        </Text>
    </div>
);

export default MarketClosedContractOverlay;
