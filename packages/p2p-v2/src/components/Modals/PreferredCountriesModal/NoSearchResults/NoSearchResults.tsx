import React from 'react';
import { Text } from '@deriv-com/ui';

type TNoSearchResultsProps = {
    value: string;
};
const NoSearchResults = ({ value }: TNoSearchResultsProps) => {
    return (
        <div className='flex flex-col items-center justify-center mt-64 break-all'>
            <Text align='center' weight='bold'>
                {`No results for “${value}”.`}
            </Text>
            <Text align='center'>Check your spelling or use a different term.</Text>
        </div>
    );
};

export default NoSearchResults;
