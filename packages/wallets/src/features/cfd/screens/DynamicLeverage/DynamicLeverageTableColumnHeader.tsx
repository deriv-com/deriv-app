import React, { FC } from 'react';
import { WalletText } from '../../../../components/Base';
import './DynamicLeverageTableColumnHeader.scss';

type TDynamicLeverageTableColumnHeader = {
    subtitle: string;
    title: string;
};

export const DynamicLeverageTableColumnHeader: FC<TDynamicLeverageTableColumnHeader> = ({ subtitle, title }) => (
    <div className='wallets-dynamic-leverage-modal__market-table-header-cell'>
        <WalletText align='center' size='xs' weight='bold'>
            {title}
        </WalletText>
        <WalletText align='center' size='2xs'>
            {subtitle}
        </WalletText>
    </div>
);
