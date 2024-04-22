import React from 'react';
import { THooks } from 'src/hooks/types';
import { DerivLightCashierNoBalanceIcon } from '@deriv/quill-icons';
import { ActionScreen, Button } from '@deriv-com/ui';

type TTransferNotAccountProps = {
    accounts: THooks.TransferAccounts;
};

const TransferNoAccount: React.FC<React.PropsWithChildren<TTransferNotAccountProps>> = ({ accounts, children }) => {
    if (accounts.length < 2)
        return (
            <ActionScreen
                actionButtons={<Button size='lg'>Create Account</Button>}
                description='Please create another Deriv, Deriv MT5, or Deriv X account.'
                icon={<DerivLightCashierNoBalanceIcon height='128' width='128' />}
                title='You need at least two accounts'
            />
        );

    return <>{children}</>;
};

export default TransferNoAccount;
