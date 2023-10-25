import React from 'react';
import { WalletButton, WalletText } from '../../../../../../components/Base';

const TransactionStatusError = () => (
    <React.Fragment>
        <WalletText lineHeight='sm' size='xs'>
            Unfortunately, we cannot retrieve the information at this time.
        </WalletText>
        <div className='transaction-status-error-divider' />
        <WalletButton
            color='transparent'
            isFullWidth={true}
            onClick={() => {
                /* should re-subscribe */
            }}
            size='sm'
            text='Refresh'
            variant='outlined'
        />
    </React.Fragment>
);

export default TransactionStatusError;
