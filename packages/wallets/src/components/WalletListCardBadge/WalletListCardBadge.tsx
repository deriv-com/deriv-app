import React from 'react';
import { THooks } from '../../types';
import { WalletText } from '../Base';
import './WalletListCardBadge.scss';

type TProps = {
    isDemo?: THooks.WalletAccountsList['is_virtual'];
    label?: THooks.WalletAccountsList['landing_company_name'];
};

const WalletListCardBadge: React.FC<TProps> = ({ isDemo, label }) => {
    const className = isDemo ? 'wallets-list-card__badge--demo' : 'wallets-list-card__badge';

    const formattedLabel = label === 'virtual' ? 'Demo' : label?.toUpperCase() || 'SVG';

    return (
        <div className={className}>
            <div className='wallets-list-card__name'>
                <WalletText color={isDemo ? 'white' : 'black'} size='2xs' weight='bold'>
                    {formattedLabel}
                </WalletText>
            </div>
        </div>
    );
};

export default WalletListCardBadge;
