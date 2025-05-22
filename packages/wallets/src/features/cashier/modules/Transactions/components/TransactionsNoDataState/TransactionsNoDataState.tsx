import React from 'react';
import { DerivLightNoRecentTransactionsIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { ActionScreen } from '@deriv-com/ui';
import './TransactionsNoDataState.scss';

const TransactionsNoDataState = () => {
    const { localize } = useTranslations();

    return (
        <div className='wallets-transactions-no-data-state'>
            <ActionScreen
                icon={<DerivLightNoRecentTransactionsIcon width={128} />}
                title={localize('No transactions found')}
            />
        </div>
    );
};

export default TransactionsNoDataState;
