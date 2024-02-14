import React from 'react';
import { Text } from '@deriv-com/ui';

type TJurisdictionCardTagProps = {
    tag: string;
};

const JurisdictionCardTag = ({ tag }: TJurisdictionCardTagProps) => (
    <div className='absolute top-0 left-0 w-full p-8 text-center rounded-t-lg rounded-b-none bg-system-light-text-info-blue-background'>
        <Text className='text-random-blue' size='sm' weight='bold'>
            {tag}
        </Text>
    </div>
);

export default JurisdictionCardTag;
