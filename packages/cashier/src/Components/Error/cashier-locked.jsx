import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const CashierLocked = () => {
    return (
        <div className='cashier-locked'>
            <Icon icon='IcCashierLocked' className='cashier-locked__icon' />
            <h2 className='cashier-locked__title'>{localize('Cashier is locked')}</h2>
            <Text as='p' size='xs' align='center' className='cashier-locked__desc'>
                {localize('Please check your email for details')}
            </Text>
        </div>
    );
};

export default CashierLocked;
