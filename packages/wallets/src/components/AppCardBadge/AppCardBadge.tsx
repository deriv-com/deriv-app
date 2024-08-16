import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { THooks } from '../../types';
import './AppCardBadge.scss';

type TProps = {
    isDemo: THooks.ActiveWalletAccount['is_virtual'];
};

const AppCardBadge: React.FC<TProps> = ({ isDemo }) => {
    const className = classNames('wallets-app-card-badge', {
        'wallets-app-card-badge--demo': isDemo,
        'wallets-app-card-badge--real': !isDemo,
    });

    const formattedLabel = isDemo ? <Localize i18n_default_text='Demo' /> : <Localize i18n_default_text='Real' />;

    return (
        <div className={className}>
            <Text color='white' size='2xs' weight='bold'>
                {formattedLabel}
            </Text>
        </div>
    );
};

export default AppCardBadge;
