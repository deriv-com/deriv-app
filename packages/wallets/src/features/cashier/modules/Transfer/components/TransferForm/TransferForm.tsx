import React, { useCallback, useRef } from 'react';
import { Formik } from 'formik';
import { Loader, WalletButton } from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import { useTransfer } from '../../provider';
import type { TInitialTransferFormValues } from '../../types';
import { TransferFormAmountInput } from '../TransferFormAmountInput';
import { TransferFormDropdown } from '../TransferFormDropdown';
import './TransferForm.scss';

const TransferForm = () => {
    const { isMobile } = useDevice();
    const { activeWallet, isLoading, requestTransferBetweenAccounts } = useTransfer();
    const mobileAccountsListRef = useRef<HTMLDivElement | null>(null);

    const initialValues: TInitialTransferFormValues = {
        activeAmountFieldName: undefined,
        fromAccount: activeWallet,
        fromAmount: 0,
        toAccount: undefined,
        toAmount: 0,
    };

    const onSubmit = useCallback(
        (values: TInitialTransferFormValues) => requestTransferBetweenAccounts(values),
        [requestTransferBetweenAccounts]
    );

    if (isLoading) return <Loader />;

    return (
        <div className='wallets-transfer'>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {({ handleSubmit, values }) => (
                    <form className='wallets-transfer__form' onSubmit={handleSubmit}>
                        <div className='wallets-transfer__fields'>
                            <div className='wallets-transfer__fields-section'>
                                <TransferFormAmountInput fieldName='fromAmount' />
                                <TransferFormDropdown
                                    fieldName='fromAccount'
                                    mobileAccountsListRef={mobileAccountsListRef}
                                />
                            </div>
                            <div style={{ height: '20px' }} />
                            <div className='wallets-transfer__fields-section'>
                                <TransferFormAmountInput fieldName='toAmount' />
                                <TransferFormDropdown
                                    fieldName='toAccount'
                                    mobileAccountsListRef={mobileAccountsListRef}
                                />
                            </div>
                        </div>
                        <div className='wallets-transfer__submit-button'>
                            <WalletButton disabled={!values.toAmount} size={isMobile ? 'md' : 'lg'}>
                                Transfer
                            </WalletButton>
                        </div>
                    </form>
                )}
            </Formik>
            {/* Portal for accounts list in mobile view */}
            <div className='wallets-transfer__mobile-accounts-list' ref={mobileAccountsListRef} />
        </div>
    );
};

export default TransferForm;
