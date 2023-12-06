import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const CashierUnderMaintenance = () => (
    <div className='cashier-under-maintenance'>
        <Icon className='cashier-under-maintenance__icon' icon='IcCashierUnderMaintenance' size={128} />
        <Text className='cashier-under-maintenance__title' weight='bold'>
            <Localize i18n_default_text='Cashier is currently down for maintenance' />
        </Text>
        <Text align='center'>
            <Localize
                i18n_default_text='Please check back in a few minutes.<0></0>Thank you for your patience.'
                components={[<br key={0} />]}
            />
        </Text>
    </div>
);

export default CashierUnderMaintenance;
