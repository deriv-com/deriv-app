import React from 'react';
import './table.scss';
import { Text } from '@deriv/components';

type TableErrorProps = {
    message: string
};

export const TableError = (
    {
        message
    }: TableErrorProps
) => <Text as='p' color='loss-danger' size='xs' className='dp2p-table-error'>
    {message}
</Text>;
