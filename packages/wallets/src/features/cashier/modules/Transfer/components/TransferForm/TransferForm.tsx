import React, { useCallback, useRef } from 'react';
import { Formik } from 'formik';
import { Localize } from '@deriv-com/translations';
import { Button, Loader, useDevice } from '@deriv-com/ui';
import { MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '../../../../../cfd/constants';
import { useTransfer } from '../../provider';
import type { TAccount, TInitialTransferFormValues } from '../../types';
import { TransferFormAmountInput } from '../TransferFormAmountInput';
import { TransferFormDropdown } from '../TransferFormDropdown';
import { TransferMessages } from '../TransferMessages';
import './TransferForm.scss';

const TransferForm = () => {
    const { isDesktop } = useDevice();
    const { activeWallet, isLoading, requestTransferBetweenAccounts } = useTransfer();
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

    const isAccountUnavailable = (account: TAccount) =>
        account?.status === TRADING_PLATFORM_STATUS.UNAVAILABLE ||
        account?.status === MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE;

    const hasPlatformStatus = (values: TInitialTransferFormValues) =>
        isAccountUnavailable(values.fromAccount) || isAccountUnavailable(values.toAccount);
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
                                disabled={
                                    !values.fromAmount ||
                                    !values.toAmount ||
                                    values.isError ||
                                    hasPlatformStatus(values)
                                }
                                size={isDesktop ? 'lg' : 'md'}
                                textSize={isDesktop ? 'md' : 'sm'}
                                type='submit'
                            >
                                <Localize i18n_default_text='Transfer' />
                            </Button>
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
