import React from 'react';
import { Text } from '@deriv/components';

type TApiTokenTableRowHeader = {
    text: string;
};

const ApiTokenTableRowHeader = ({ text }: TApiTokenTableRowHeader) => (
    <th className='da-api-token__table-header'>
        <Text color='prominent ' size='xs' line_height='m' weight='bold'>
            {text}
        </Text>
    </th>
);

export default ApiTokenTableRowHeader;
