import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { WalletText } from '../Base';

type TProps = {
    currency: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[0]['currency'];
};

const WalletListCardTitle: React.FC<TProps> = ({ currency }) => {
    return (
        <WalletText lineHeight='4xl' size='xl' weight='bold'>
            {currency} Wallet
        </WalletText>
    );
};

export default WalletListCardTitle;
