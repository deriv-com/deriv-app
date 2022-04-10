import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

export const getHeaderConfig = () => ({
    purchased: { title: localize('Contract Purchased'), icon: <Icon icon='IcTick' /> },
    won: { title: localize('Contract Won'), icon: <Icon icon='IcContractFlag' /> },
    lost: { title: localize('Contract Lost'), icon: <Icon icon='IcContractFlag' /> },
});
