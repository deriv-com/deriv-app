import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import './cfds-title.scss';

const CFDsTitle = observer(() => {
    const { ui } = useStore();
    const { is_mobile_or_tablet } = ui;

    if (is_mobile_or_tablet) return null;
    return (
        <div className='cfds-title'>
            <Text size='sm' weight='bold' color='prominent'>
                {localize('CFDs')}
            </Text>
        </div>
    );
});

export default CFDsTitle;
