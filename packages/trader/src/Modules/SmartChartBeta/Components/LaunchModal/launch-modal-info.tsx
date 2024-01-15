import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const LaunchModalInfo = () => (
    <div className='modal-content' data-testid='launch-modal'>
        <Text as='h1' weight='bold' align='center' size='sm'>
            <Localize i18n_default_text='Deriv Trader Chart v2.0' />
        </Text>
        <Text as='p' align='center'>
            <Localize i18n_default_text='Smoother charts. Smarter insights.' />
        </Text>
    </div>
);

export default LaunchModalInfo;
