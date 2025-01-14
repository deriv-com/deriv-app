import React, { useCallback, useRef } from 'react';
import { Formik } from 'formik';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { WalletLoader } from '../../../../../../components';
import { useTransfer } from '../../provider';
import type { TInitialTransferFormValues } from '../../types';
import { TransferFormAmountInput } from '../TransferFormAmountInput';
import { TransferFormDropdown } from '../TransferFormDropdown';
import { TransferMessages } from '../TransferMessages';
import './TransferForm.scss';

const TransferForm = () => {
    const { isDesktop } = useDevice();
    const { activeWallet, hasPlatformStatus, isLoading, requestTransferBetweenAccounts } = useTransfer();
    const mobileAccountsListRef = useRef<HTMLDivElement | null>(null);

    const initialValues: TInitialTransferFormValues = {
        activeAmountFieldName: undefined,
        fromAccount: activeWallet,
        fromAmount: 0,
        isError: false,
        toAccount: undefined,
        toAmount: 0,
    };

    const onSubmit = useCallback(
        (values: TInitialTransferFormValues) => requestTransferBetweenAccounts(values),
        [requestTransferBetweenAccounts]
    );

    if (isLoading) return <WalletLoader />;

    return (
        <div className='wallets-transfer'>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {({ handleSubmit, values }) => {
                    const { fromAccount, fromAmount, isError, toAccount, toAmount } = values;
                    const isTransferBtnDisabled =
                        !fromAmount || !toAmount || isError || [fromAccount, toAccount].some(hasPlatformStatus);

                    return (
                        <form className='wallets-transfer__form' onSubmit={handleSubmit}>
                            <div className='wallets-transfer__fields'>
                                <div className='wallets-transfer__fields-section'>
                                    <TransferFormAmountInput fieldName='fromAmount' />
                                    <TransferFormDropdown
                                        fieldName='fromAccount'
                                        mobileAccountsListRef={mobileAccountsListRef}
                                    />
                                </div>
                                <TransferMessages />
                                <div className='wallets-transfer__fields-section'>
                                    <TransferFormAmountInput fieldName='toAmount' />
                                    <TransferFormDropdown
                                        fieldName='toAccount'
                                        mobileAccountsListRef={mobileAccountsListRef}
                                    />
                                </div>
                            </div>
                            <div className='wallets-transfer__submit-button' data-testid='dt_transfer_form_submit_btn'>
                                <Button
                                    borderWidth='sm'
                                    disabled={isTransferBtnDisabled}
                                    size={isDesktop ? 'lg' : 'md'}
                                    textSize={isDesktop ? 'md' : 'sm'}
                                    type='submit'
                                >
                                    <Localize i18n_default_text='Transfer' />
                                </Button>
                            </div>
                        </form>
                    );
                }}
            </Formik>
            {/* Portal for accounts list in mobile view */}
            <div className='wallets-transfer__mobile-accounts-list' ref={mobileAccountsListRef} />
        </div>
    );
};

export default TransferForm;
