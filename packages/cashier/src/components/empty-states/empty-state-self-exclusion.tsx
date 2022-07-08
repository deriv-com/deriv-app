import { formatDate } from '@deriv/shared';
import { localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

type TProps = {
    excluded_until: number;
};

const EmptyStateSelfExclusion: React.FC<TProps> = ({ excluded_until }) => (
    <EmptyState
        icon={'IcCashierDepositLock'}
        title={localize('Deposits are locked')}
        description={localize(
            'You have chosen to exclude yourself from trading on our website until {{exclude_until}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via live chat.',
            {
                exclude_until: formatDate(excluded_until, 'DD MMM, YYYY'),
            }
        )}
    />
);

export default EmptyStateSelfExclusion;
