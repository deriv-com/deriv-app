import React from 'react';
import { Text } from '@deriv-com/ui';
import { ConnectedAppsBullets } from './ConnectedAppsBullets';

export const ConnectedAppsEmpty = () => {
    return (
        <div className='flex flex-col md:gap-8 sm:gap-16 md:mt-96'>
            <Text align='center' size='sm' weight='bold'>
                You currently don&apos;t have any third-party authorised apps associated with your account.
            </Text>
            <ConnectedAppsBullets
                color='less-prominent'
                style='flex flex-col list-decimal pl-16 pr-16 md:gap-8 sm:gap-4'
            />
        </div>
    );
};
