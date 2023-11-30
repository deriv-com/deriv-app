import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletsActionScreen } from '../../../../components';
import type { THooks } from '../../../../types';
import getMessage from './TransferNotAvailableProvider';
import './TransferNotAvailable.scss';

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
            <div className='wallets-transfer-not-available'>
                <WalletsActionScreen
                    description={state.description}
                    descriptionSize='md'
                    renderButtons={state.actionButton}
                    title={state.title}
                    titleSize='xl'
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default TransferNotAvailable;
