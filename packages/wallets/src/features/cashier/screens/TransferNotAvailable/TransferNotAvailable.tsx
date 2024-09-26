import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { ActionScreen } from '@deriv-com/ui';
import type { THooks } from '../../../../types';
import getMessage from './TransferNotAvailableProvider';

type TProps = {
    accounts: THooks.TransferAccount[];
};

const TransferNotAvailable: React.FC<React.PropsWithChildren<TProps>> = ({ accounts, children }) => {
    const history = useHistory();
    const { data: activeWallet } = useActiveWalletAccount();
    const hasAccountsForTransfer = accounts.length > 1;
    const hasTransferAccountsWithFunds = accounts.some(account => Number(account.balance) > 0);

    const state = getMessage({
        currency: activeWallet?.currency || 'USD',
        hasAccountsForTransfer,
        hasTransferAccountsWithFunds,
        history,
        isVirtual: activeWallet?.is_virtual,
    });

    if (state) {
        return (
            <ActionScreen
                actionButtons={state.actionButton}
                description={state.description}
                title={state.title}
                titleSize='xl'
            />
        );
    }

    return <>{children}</>;
};

export default TransferNotAvailable;
