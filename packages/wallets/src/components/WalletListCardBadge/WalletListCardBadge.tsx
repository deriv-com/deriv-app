import React from 'react';
import { WalletText } from '../Base';
import './WalletListCardBadge.scss';

const WalletListCardBadge: React.FC = () => (
    <div className='wallets-list-card-badge' data-testid='dt_wallet_list_card_badge'>
        <WalletText color='white' size='2xs' weight='bold'>
            Demo
        </WalletText>
    </div>
);

export default WalletListCardBadge;
