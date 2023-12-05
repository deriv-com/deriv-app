import React from 'react';
import { Divider, WalletButton, WalletText } from '../../../../../../components/Base';

type TTransactionStatusError = {
    refresh: VoidFunction;
};

const TransactionStatusError: React.FC<TTransactionStatusError> = ({ refresh }) => (
    <React.Fragment>
        <WalletText lineHeight='sm' size='xs'>
            Unfortunately, we cannot retrieve the information at this time.
        </WalletText>
        <Divider color='#d6dadb' /> {/* --color-grey-5 */}
        <WalletButton isFullWidth={true} onClick={refresh} size='sm' variant='outlined'>
            Refresh
        </WalletButton>
    </React.Fragment>
);

export default TransactionStatusError;
