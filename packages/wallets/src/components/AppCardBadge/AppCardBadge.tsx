import React from 'react';
import classNames from 'classnames';
import { THooks } from '../../types';
import { WalletText } from '../Base';
import './AppCardBadge.scss';

type TProps = {
    isDemo: THooks.ActiveWalletAccount['is_virtual'];
};

const AppCardBadge: React.FC<TProps> = ({ isDemo }) => {
    const className = classNames('wallets-app-card-badge', {
        'wallets-app-card-badge--demo': isDemo,
        'wallets-app-card-badge--real': !isDemo,
    });

    const formattedLabel = isDemo ? 'Demo' : 'Real';

    return (
        <div className={className}>
            <WalletText color='white' size='2xs' weight='bold'>
                {formattedLabel}
            </WalletText>
        </div>
    );
};

export default AppCardBadge;
