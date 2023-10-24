import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { WalletText } from '../Base';

type TProps = {
    title: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[0]['currency'];
};

const WalletListCardTitle: React.FC<TProps> = ({ title }) => {
    return (
        <WalletText size='xl' weight='bold'>
            {title} Wallet
        </WalletText>
    );
};

export default WalletListCardTitle;
