import React from 'react';
import { InlineMessage, Text } from '@deriv-com/ui';
import { CONNECTED_APPS_INFO_BULLETS } from '../../constants/connectedAppsConstants';

export const ConnectedAppsInfo = () => {
    return (
        <InlineMessage iconPosition='top' variant='info'>
            <div>
                <Text as='h4' size='xs' weight='bold'>
                    What are connected apps?
                </Text>
                <Text
                    as='ol'
                    className='flex flex-col md:gap-14 sm:gap-10 list-decimal md:pt-14 md:pl-14 sm:pt-10 sm:pl-10 md:text-sm sm:text-xs'
                >
                    {CONNECTED_APPS_INFO_BULLETS.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                    ))}
                </Text>
            </div>
        </InlineMessage>
    );
};
