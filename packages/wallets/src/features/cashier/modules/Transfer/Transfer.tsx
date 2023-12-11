import React from 'react';
import { WalletButton, WalletText } from '../../../../components';
import type { THooks } from '../../../../types';
import { TransferForm, TransferReceipt } from './components';
import { TransferProvider, useTransfer } from './provider';

type TProps = {
    accounts: THooks.TransferAccount[];
};

const TransferModule: React.FC<TProps> = ({ accounts }) => {
    return (
        <TransferProvider accounts={accounts}>
            <Transfer />
        </TransferProvider>
    );
};

const Transfer: React.FC = () => {
    const { error, receipt, resetTransfer } = useTransfer();

    //temporary error handling
    if (error?.error.message)
        return (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.6rem',
                }}
            >
                <WalletText as='p' color='error' size='md'>
                    {error?.error.message}
                </WalletText>
                <WalletButton onClick={() => resetTransfer()} variant='contained'>
                    Reset error
                </WalletButton>
            </div>
        );

    if (receipt) return <TransferReceipt />;

    return <TransferForm />;
};

export default TransferModule;
