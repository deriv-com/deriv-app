import React from 'react';
import { Text } from '@deriv-com/ui';
import { AccountClosureSteps } from '../../containers';

export const AccountClosure = () => {
    return (
        <div>
            <Text as='h4' className='mb-16' size='sm' weight='bold'>
                Are you sure?
            </Text>
            <AccountClosureSteps />
        </div>
    );
};
