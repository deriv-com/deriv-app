import React from 'react';
import { InlineMessage, Text } from '@deriv-com/ui';

export const POICountrySelector = () => {
    return (
        <React.Fragment>
            <div>
                <React.Fragment>
                    <Text align='center' className='text-xs lg:text-sm' weight='bold'>
                        Your identity verification failed because:
                    </Text>
                    <InlineMessage type='filled' variant='error'>
                        We were unable to verify the identity document with the details provided.
                    </InlineMessage>
                </React.Fragment>
            </div>
        </React.Fragment>
    );
};
