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
                description={`Please make a deposit to use this feature.`}
                descriptionSize='md'
                icon={<DerivLightCashierNoBalanceIcon height='128px' width='128px' />}
                renderButtons={() => (
                    <WalletButton onClick={() => history.push('/wallets/cashier/deposit')} size='lg'>
                        Deposit Now
                    </WalletButton>
                )}
                title={`You have no funds in your ${activeWallet.currency} account`}
                titleSize='xl'
            />
        );

    return <>{children}</>;
};

export default WithdrawalNoBalance;
