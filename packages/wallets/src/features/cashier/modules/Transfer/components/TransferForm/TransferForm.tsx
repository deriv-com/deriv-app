import React, { useCallback, useRef } from 'react';
import { Formik } from 'formik';
import { useGetExchangeRate } from '@deriv/api';
import { Loader, WalletButton } from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import { useTransfer } from '../../provider';
import type { TInitialTransferFormValues } from '../../types';
import { TransferFormAmountInput } from '../TransferFormAmountInput';
import { TransferFormDropdown } from '../TransferFormDropdown';
import { TransferMessages } from '../TransferMessages';
import './TransferForm.scss';

const TransferForm = () => {
    const { isMobile } = useDevice();
    const { activeWallet, isLoading, requestTransferBetweenAccounts } = useTransfer();
    const mobileAccountsListRef = useRef<HTMLDivElement | null>(null);

    const { data: exchangeRatesWalletCurrency, refetch: refetchExchangeRatesWalletCurrency } = useGetExchangeRate({
        base_currency: activeWallet?.currency ?? 'USD',
        loginid: activeWallet?.loginid,
    });
    const { data: exchangeRatesUSD, refetch: refetchExchangeRatesUSD } = useGetExchangeRate({
        base_currency: 'USD',
        loginid: activeWallet?.loginid,
    });

    const refetchExchangeRates = useCallback(() => {
        refetchExchangeRatesUSD();
        const newExchangeRatesWalletCurrency = refetchExchangeRatesWalletCurrency();

        return newExchangeRatesWalletCurrency;
    }, [refetchExchangeRatesUSD, refetchExchangeRatesWalletCurrency]);

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
                                <TransferFormAmountInput
                                    exchangeRatesWalletCurrency={exchangeRatesWalletCurrency}
                                    fieldName='fromAmount'
                                    refetchExchangeRates={refetchExchangeRates}
                                />
                                <TransferFormDropdown
                                    fieldName='fromAccount'
                                    mobileAccountsListRef={mobileAccountsListRef}
                                />
                            </div>
                            <TransferMessages
                                exchangeRatesUSD={exchangeRatesUSD}
                                exchangeRatesWalletCurrency={exchangeRatesWalletCurrency}
                                key={values.fromAmount.toString() + values.toAmount.toString()}
                            />
                            <div className='wallets-transfer__fields-section'>
                                <TransferFormAmountInput
                                    exchangeRatesWalletCurrency={exchangeRatesWalletCurrency}
                                    fieldName='toAmount'
                                    refetchExchangeRates={refetchExchangeRates}
                                />
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
