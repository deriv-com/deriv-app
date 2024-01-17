import React from 'react';
import { Text } from '@deriv/quill-design';

type TJurisdictionCardTagProps = {
    tag: string;
};

const JurisdictionCardTag = ({ tag }: TJurisdictionCardTagProps) => (
    <div className='absolute top-50 left-50 w-full p-400 text-center rounded-t-[13px] rounded-b-50 bg-[#dfeaff]'>
        <Text bold className='text-random-blue text-50'>
            {tag}
        </Text>
    </div>
);

export default JurisdictionCardTag;
