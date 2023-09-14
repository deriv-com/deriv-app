import React from 'react';
import { Text } from '../Text';
import './WalletListCardBadge.scss';

type TProps = {
    label: string;
};

const WalletListCardBadge: React.FC<TProps> = ({ label }) => {
    return (
        <div className='wallets-list-card__badge'>
            <Text size='xxxs' weight='bold'>
                {label.toUpperCase()}
            </Text>
        </div>
    );
};

export default WalletListCardBadge;
