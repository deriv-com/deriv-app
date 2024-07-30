import React from 'react';
import { Button, Divider } from '@deriv-com/ui';
import { WalletText } from '../../../../../../components/Base';

type TTransactionStatusError = {
    refresh: VoidFunction;
};

const TransactionStatusError: React.FC<TTransactionStatusError> = ({ refresh }) => (
    <React.Fragment>
        <WalletText lineHeight='sm' size='xs'>
            Unfortunately, we cannot retrieve the information at this time.
        </WalletText>
        <Divider color='var(--general-active)' />
        <Button borderWidth='sm' color='black' isFullWidth={true} onClick={refresh} size='sm' variant='outlined'>
            Refresh
        </Button>
    </React.Fragment>
);

export default TransactionStatusError;
