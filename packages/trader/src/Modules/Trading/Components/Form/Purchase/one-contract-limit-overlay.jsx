import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const OneContractLimitOverlay = () => (
    <div className='contract-limit-overlay'>
        <Text weight='bold' size='xs' className='contract-limit-overlay__caption'>
            {localize('You can only purchase one contract at a time')}
        </Text>
    </div>
);

export default React.memo(OneContractLimitOverlay);
