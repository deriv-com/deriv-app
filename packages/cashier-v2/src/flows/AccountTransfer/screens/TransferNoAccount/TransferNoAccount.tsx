import React from 'react';
import { ActionScreen, Button } from '@deriv-com/ui';
import NoAccountIcon from '../../../../assets/images/ic-cashier-no-balance.svg';

const TransferNoAccount = () => {
    return (
        <ActionScreen
            actionButtons={<Button size='lg'>Create Account</Button>}
            description='Please create another Deriv, Deriv MT5, or Deriv X account.'
            icon={<NoAccountIcon />}
            title='You need at least two accounts'
        />
    );
};

export default TransferNoAccount;
