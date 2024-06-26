import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './cfds-title.scss';

const CFDsTitle = () => {
    const { isDesktop } = useDevice();

    if (!isDesktop) return null;
    return (
        <div className='cfds-title'>
            <Text size='sm' weight='bold' color='prominent'>
                <Localize i18n_default_text='CFDs' />
            </Text>
        </div>
    );
};

export default CFDsTitle;
