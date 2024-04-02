import React, { createContext, useCallback, useContext, useState } from 'react';
import { getCryptoFiatConverterValidationSchema } from '../../../components';
import { THooks } from '../../../hooks/types';
import { TCurrency } from '../../../types';
import { useExtendedTransferAccounts } from '../hooks';
import { TTransferableAccounts, TTransferReceipt } from '../types';

export type TTransferContext = {
    accounts?: TTransferableAccounts;
    activeAccount?: TTransferableAccounts[number];
    isLoading?: boolean;
    setTransferReceipt?: React.Dispatch<React.SetStateAction<TTransferReceipt | undefined>>;
    setTransferValidationSchema: (
        fromAccount: TTransferableAccounts[number],
        toAccount: TTransferableAccounts[number]
    ) => void;
    transferReceipt?: TTransferReceipt;
    transferValidationSchema?: ReturnType<typeof getCryptoFiatConverterValidationSchema>;
};

const TransferContext = createContext<TTransferContext | null>(null);

export const useTransfer = () => {
    const context = useContext(TransferContext);

    if (!context) {
        throw new Error('useTransfer() must be called within a component wrapped in TransferProvider.');
    }

    return context;
};

type TTransferProviderProps = {
    accounts: THooks.TransferAccounts;
};

const TransferProvider: React.FC<React.PropsWithChildren<TTransferProviderProps>> = ({ accounts, children }) => {
    const {
        accounts: transferAccounts,
        activeAccount: transferActiveAccount,
        isLoading,
    } = useExtendedTransferAccounts(accounts);
    const [validationSchema, setValidationSchema] =
        useState<ReturnType<typeof getCryptoFiatConverterValidationSchema>>();

    const [transferReceipt, setTransferReceipt] = useState<TTransferReceipt>();

    const setTransferValidationSchema = useCallback(
        (fromAccount: TTransferableAccounts[number], toAccount: TTransferableAccounts[number]) => {
            const modifiedFromAccounts = {
                balance: parseFloat(fromAccount.balance ?? ''),
                currency: fromAccount.currency as TCurrency,
                fractionalDigits: fromAccount.currencyConfig?.fractional_digits,
                limits: {
                    max: 100,
                    min: 1,
                },
            };

            const modifiedToAccounts = {
                currency: toAccount.currency as TCurrency,
                fractionalDigits: toAccount.currencyConfig?.fractional_digits,
            };

            setValidationSchema(
                getCryptoFiatConverterValidationSchema({
                    fromAccount: modifiedFromAccounts,
                    toAccount: modifiedToAccounts,
                })
            );
        },
        []
    );

    return (
        <TransferContext.Provider
            value={{
                accounts: transferAccounts,
                activeAccount: transferActiveAccount,
                isLoading,
                setTransferReceipt,
                setTransferValidationSchema,
                transferReceipt,
                transferValidationSchema: validationSchema,
            }}
        >
            {children}
        </TransferContext.Provider>
    );
};

export default TransferProvider;
