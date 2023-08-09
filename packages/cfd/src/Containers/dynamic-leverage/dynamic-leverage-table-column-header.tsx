import React from 'react';
import { Table, Text } from '@deriv/components';
import { TDynamicLeverageTableColumnHeader } from 'Containers/props.types';

export const DynamicLeverageTableColumnHeader = ({ title, subtitle }: TDynamicLeverageTableColumnHeader) => (
    <Table.Head>
        <div className='dynamic-leverage-modal__market-table-header-cell'>
            <Text size='xs' align='center' weight='bold'>
                {title}
            </Text>
            <Text size='xxs' align='center'>
                {subtitle}
            </Text>
        </div>
    </Table.Head>
);
