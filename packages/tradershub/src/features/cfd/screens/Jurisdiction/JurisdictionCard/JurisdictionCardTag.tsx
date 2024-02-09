import React from 'react';
import { Text } from '@deriv-com/ui';

type TJurisdictionCardTagProps = {
    tag: string;
};

const JurisdictionCardTag = ({ tag }: TJurisdictionCardTagProps) => (
    <div className='absolute top-50 left-50 w-full p-8 text-center rounded-t-[13px] rounded-b-50 bg-system-light-text-info-blue-background'>
        <Text className='text-random-blue text-50' weight='bold'>
            {tag}
        </Text>
    </div>
);

export default JurisdictionCardTag;
