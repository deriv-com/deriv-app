import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import './WalletListCardBadge.scss';

const WalletListCardBadge: React.FC = () => (
    <div className='wallets-list-card-badge' data-testid='dt_wallet_list_card_badge'>
        <Text color='white' size='2xs' weight='bold'>
            <Localize i18n_default_text='Demo' />
        </Text>
    </div>
);

export default WalletListCardBadge;
