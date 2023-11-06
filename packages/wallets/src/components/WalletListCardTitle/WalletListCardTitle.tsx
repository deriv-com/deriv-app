import React from 'react';
import { THooks } from '../../types';
import { WalletText } from '../Base';

type TProps = {
    title: THooks.WalletAccountsList['currency'];
};

const WalletListCardTitle: React.FC<TProps> = ({ title }) => {
    return (
        <WalletText size='lg' weight='bold'>
            {title} Wallet
        </WalletText>
    );
};

export default WalletListCardTitle;
