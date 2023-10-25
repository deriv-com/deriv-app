import React from 'react';
import { WalletButton, WalletText } from '../../../../../../components/Base';

type TTransactionStatusError = {
    refresh: VoidFunction;
};

const TransactionStatusError: React.FC<TTransactionStatusError> = ({ refresh }) => (
    <React.Fragment>
        <WalletText lineHeight='sm' size='xs'>
            Unfortunately, we cannot retrieve the information at this time.
        </WalletText>
        <div className='transaction-status-error__divider' />
        <WalletButton
            color='transparent'
            isFullWidth={true}
            onClick={refresh}
            size='sm'
            text='Refresh'
            variant='outlined'
        />
    </React.Fragment>
);

export default TransactionStatusError;
