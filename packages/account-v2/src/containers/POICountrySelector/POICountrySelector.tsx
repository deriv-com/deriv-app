import React from 'react';
import { InlineMessage, Text } from '@deriv-com/ui';
import CountrySelector from '../../components/CountrySelector/CountrySelector';

export const POICountrySelector = () => {
    return (
        <div className='flex flex-col gap-10'>
            <Text className='text-xs lg:text-sm' weight='bold'>
                Your identity verification failed because:
            </Text>
            <InlineMessage type='filled' variant='error'>
                We were unable to verify the identity document with the details provided.
            </InlineMessage>
            <Text size='xs'>In which country was your document issued?</Text>
            <CountrySelector label='Country' name='country' />
        </div>
    );
};
