import React from 'react';
import { Text } from '../Text';

type TProps = {
    currency: string;
};

const WalletListCardTitle: React.FC<TProps> = ({ currency }) => {
    return (
        <Text size='sm' weight='bold' align='center'>
            {currency} Wallet
        </Text>
    );
};

export default WalletListCardTitle;
