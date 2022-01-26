import * as React from 'react';
import { Text } from '@deriv/components';

type ApiTokenTableRowHeaderProps = {
    text: string;
};

const ApiTokenTableRowHeader = ({ text }: ApiTokenTableRowHeaderProps) => (
    <th className='da-api-token__table-header'>
        <Text color='prominent ' size='xs' line_height='m' weight='bold'>
            {text}
        </Text>
    </th>
);

export default ApiTokenTableRowHeader;
