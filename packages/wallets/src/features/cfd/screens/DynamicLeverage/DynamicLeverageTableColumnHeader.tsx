import React, { FC } from 'react';
import { WalletText } from '../../../../components/Base';
import './DynamicLeverageTableColumnHeader.scss';

type TDynamicLeverageTableColumnHeader = {
    subtitle: string;
    title: string;
};

export const DynamicLeverageTableColumnHeader: FC<TDynamicLeverageTableColumnHeader> = ({ subtitle, title }) => (
    <div className='wallets-dynamic-leverage-screen__table-cell'>
        <WalletText align='center' size='sm' weight='bold'>
            {title}
        </WalletText>
        <WalletText align='center' size='xs'>
            {subtitle}
        </WalletText>
    </div>
);
