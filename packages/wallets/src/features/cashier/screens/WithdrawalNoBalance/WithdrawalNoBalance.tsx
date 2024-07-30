import React from 'react';
import { useHistory } from 'react-router-dom';
import { DerivLightCashierNoBalanceIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import { WalletsActionScreen } from '../../../../components';
import { THooks } from '../../../../types';

type TWithdrawalNoBalanceProps = {
    activeWallet: THooks.ActiveWalletAccount;
};

const WithdrawalNoBalance: React.FC<TWithdrawalNoBalanceProps> = ({ activeWallet }) => {
    const history = useHistory();

    return (
        <WalletsActionScreen
            description={`You don't have funds in your ${activeWallet.currency} Wallet to complete a withdrawal.`}
            descriptionSize='md'
            icon={<DerivLightCashierNoBalanceIcon height='128px' width='128px' />}
            renderButtons={() => (
                <Button borderWidth='sm' onClick={() => history.push('/wallet/deposit')} size='lg' textSize='md'>
                    Add funds
                </Button>
            )}
            title={`No funds in ${activeWallet.currency} Wallet`}
        />
    );
};

export default WithdrawalNoBalance;
