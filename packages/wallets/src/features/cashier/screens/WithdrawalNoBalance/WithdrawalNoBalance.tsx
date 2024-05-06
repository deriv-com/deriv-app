import React from 'react';
import { useHistory } from 'react-router-dom';
import { DerivLightCashierNoBalanceIcon } from '@deriv/quill-icons';
import { WalletButton, WalletsActionScreen } from '../../../../components';
import { THooks } from '../../../../types';

type TWithdrawalNoBalanceProps = {
    activeWallet: THooks.ActiveWalletAccount;
};

const WithdrawalNoBalance: React.FC<React.PropsWithChildren<TWithdrawalNoBalanceProps>> = ({
    activeWallet,
    children,
}) => {
    const history = useHistory();

    if (activeWallet.balance <= 0)
        return (
            <WalletsActionScreen
                description={`You don't have funds in your ${activeWallet.currency} Wallet to complete a withdrawal.`}
                descriptionSize='md'
                icon={<DerivLightCashierNoBalanceIcon height='128px' width='128px' />}
                renderButtons={() => (
                    <WalletButton onClick={() => history.push('/wallets/cashier/deposit')} size='lg'>
                        Add funds
                    </WalletButton>
                )}
                title={`No funds in ${activeWallet.currency} Wallet`}
            />
        );

    return <>{children}</>;
};

export default WithdrawalNoBalance;
