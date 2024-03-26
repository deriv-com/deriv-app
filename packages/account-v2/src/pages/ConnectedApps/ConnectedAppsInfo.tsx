import React from 'react';
import { InlineMessage, Text } from '@deriv-com/ui';
import { ConnectedAppsBullets } from './ConnectedAppsBullets';

export const ConnectedAppsInfo = () => {
    return (
        <InlineMessage iconPosition='top' variant='info'>
            <div>
                <Text as='h4' className='md:text-sm sm:text-xs' weight='bold'>
                    What are connected apps?
                </Text>
                <ConnectedAppsBullets style='flex flex-col list-decimal md:gap-14 sm:gap-10 md:pt-14 md:pl-14 sm:pt-10 sm:pl-10 md:text-sm sm:text-xs' />
            </div>
        </InlineMessage>
    );
};
