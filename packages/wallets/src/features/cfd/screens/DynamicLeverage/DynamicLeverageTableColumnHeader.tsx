import React, { FC } from 'react';
import { Text } from '@deriv-com/ui';
import './DynamicLeverageTableColumnHeader.scss';

type TDynamicLeverageTableColumnHeader = {
    subtitle: string;
    title: string;
};

export const DynamicLeverageTableColumnHeader: FC<TDynamicLeverageTableColumnHeader> = ({ subtitle, title }) => (
    <div className='wallets-dynamic-leverage-screen__table-cell'>
        <Text align='center' size='sm' weight='bold'>
            {title}
        </Text>
        <Text align='center' size='xs'>
            {subtitle}
        </Text>
    </div>
);
