import React from 'react';
import { PageContainer } from '../../components';
import TransferProvider from './provider/TransferProvider';
import { TransferForm } from './components';

const Transfer = () => {
    return (
        <PageContainer>
            <TransferProvider>
                <TransferForm />
            </TransferProvider>
        </PageContainer>
    );
};

export default Transfer;
