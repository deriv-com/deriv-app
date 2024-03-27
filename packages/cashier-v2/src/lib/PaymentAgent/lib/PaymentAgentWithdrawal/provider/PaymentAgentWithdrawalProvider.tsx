import React, { createContext, useContext, useState } from 'react';
import { useActiveAccount, usePaymentAgentWithdrawal } from '@deriv/api-v2';
import type { THooks } from '../../../../../hooks/types';
import type { TCurrency } from '../../../../../types';
import type { TConfirm, TPaymentAgentWithdrawalModuleProps, TReceipt } from '../types';
import {
    getPaymentAgentListedWithdrawalValidationSchema,
    getPaymentAgentUnlistedWithdrawalValidationSchema,
} from '../utils';

type TRequestTryPaymentAgentWithdrawalParams = Omit<
    Parameters<ReturnType<typeof usePaymentAgentWithdrawal>['mutateAsync']>[0]['payload'],
    'currency' | 'verification_code'
>;

type TRequestPaymentAgentWithdrawalParams = TRequestTryPaymentAgentWithdrawalParams & {
    paymentAgentEmail: TReceipt['paymentAgentEmail'];
    paymentAgentPhoneNumbers: TReceipt['paymentAgentPhoneNumbers'];
    paymentAgentUrls: TReceipt['paymentAgentUrls'];
};

type TGetPaymentAgentWithdrawalValidationSchema = (
    maxWithdrawal?: THooks.PaymentAgentList[number]['max_withdrawal'],
    minWithdrawal?: THooks.PaymentAgentList[number]['min_withdrawal']
) => ReturnType<typeof getPaymentAgentListedWithdrawalValidationSchema>;

type TPaymentAgentWithdrawalContext = {
    activeAccount?: THooks.ActiveAccount;
    getPaymentAgentWithdrawalValidationSchema: TGetPaymentAgentWithdrawalValidationSchema;
    isLoading: boolean;
    isTryWithdrawalSuccessful: boolean;
    isUnlistedWithdrawal: boolean;
    isWithdrawalRequestSubmitting: boolean;
    isWithdrawalSuccessful: boolean;
    requestPaymentAgentWithdrawal: (params: TRequestPaymentAgentWithdrawalParams) => void;
    requestTryPaymentAgentWithdrawal: (params: TRequestTryPaymentAgentWithdrawalParams) => void;
    resetPaymentAgentWithdrawal: VoidFunction;
    setIsTryWithdrawalSuccessful: React.Dispatch<React.SetStateAction<boolean>>;
    setIsUnlistedWithdrawal: React.Dispatch<React.SetStateAction<boolean>>;
    setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
    verificationCode: string;
    withdrawalConfirm: TConfirm;
    withdrawalReceipt: TReceipt;
};

const PaymentAgentWithdrawalContext = createContext<TPaymentAgentWithdrawalContext | null>(null);

export const usePaymentAgentWithdrawalContext = () => {
    const context = useContext(PaymentAgentWithdrawalContext);

    if (!context)
        throw new Error(
            'usePaymentAgentWithdrawalContext() must be called within a component wrapped in PaymentAgentWithdrawalProvider.'
        );

    return context;
};

const PaymentAgentWithdrawalProvider: React.FC<React.PropsWithChildren<TPaymentAgentWithdrawalModuleProps>> = ({
    children,
    setVerificationCode,
    verificationCode,
}) => {
    const { data: activeAccount, isLoading } = useActiveAccount();
    const { isLoading: isWithdrawalRequestSubmitting, mutateAsync } = usePaymentAgentWithdrawal();
    const [isUnlistedWithdrawal, setIsUnlistedWithdrawal] = useState(false);
    const [isTryWithdrawalSuccessful, setIsTryWithdrawalSuccessful] = useState(false);
    const [isWithdrawalSuccessful, setIsWithdrawalSuccessful] = useState(false);
    const currency = activeAccount?.currency as TCurrency;

    const initialWithdrawalConfirmValues: TConfirm = {
        amount: '',
        clientID: '',
        currency,
        paymentAgentID: '',
        paymentAgentName: '',
    };
    const initialWithdrawalReceiptValues: TReceipt = {
        amount: '',
        currency,
        paymentAgentEmail: '',
        paymentAgentName: '',
        paymentAgentPhoneNumbers: [],
        paymentAgentUrls: [],
    };
    const [withdrawalConfirm, setWithdrawalConfirm] = useState(initialWithdrawalConfirmValues);
    const [withdrawalReceipt, setWithdrawalReceipt] = useState(initialWithdrawalReceiptValues);

    const getPaymentAgentWithdrawalValidationSchema: TGetPaymentAgentWithdrawalValidationSchema = (
        maxWithdrawal,
        minWithdrawal
    ) => {
        const balance = Number(activeAccount?.balance);
        const fractionalDigits = activeAccount?.currency_config?.fractional_digits ?? 2;

        return isUnlistedWithdrawal
            ? getPaymentAgentUnlistedWithdrawalValidationSchema(balance, fractionalDigits)
            : getPaymentAgentListedWithdrawalValidationSchema({
                  balance,
                  currency,
                  fractionalDigits,
                  limits: {
                      max: Number(maxWithdrawal),
                      min: Number(minWithdrawal),
                  },
              });
    };

    const requestTryPaymentAgentWithdrawal = ({
        amount,
        paymentagent_loginid: paymentAgentLoginid,
    }: TRequestTryPaymentAgentWithdrawalParams) => {
        mutateAsync({
            payload: {
                amount,
                currency,
                dry_run: 1,
                paymentagent_loginid: paymentAgentLoginid,
                verification_code: verificationCode,
            },
        }).then(({ paymentagent_name: paymentAgentName = '', paymentagent_withdraw: paymentAgentWithdraw }) => {
            if (paymentAgentWithdraw === 2) {
                setWithdrawalConfirm({
                    amount: String(amount),
                    clientID: activeAccount?.loginid ?? '',
                    currency,
                    paymentAgentID: paymentAgentLoginid,
                    paymentAgentName,
                });
                setIsTryWithdrawalSuccessful(true);
            }
        });
    };

    const requestPaymentAgentWithdrawal = ({
        amount,
        paymentAgentEmail = '',
        paymentAgentPhoneNumbers = [],
        paymentAgentUrls = [],
        paymentagent_loginid: paymentAgentLoginid,
    }: TRequestPaymentAgentWithdrawalParams) => {
        mutateAsync({
            payload: {
                amount,
                currency,
                dry_run: 0,
                paymentagent_loginid: paymentAgentLoginid,
                verification_code: verificationCode,
            },
        }).then(({ paymentagent_name: paymentAgentName = '', paymentagent_withdraw: paymentAgentWithdraw }) => {
            if (paymentAgentWithdraw === 1) {
                setWithdrawalReceipt({
                    amount: String(amount),
                    currency,
                    paymentAgentEmail,
                    paymentAgentName,
                    paymentAgentPhoneNumbers,
                    paymentAgentUrls,
                });
                setIsTryWithdrawalSuccessful(false);
                setIsWithdrawalSuccessful(true);
            }
        });
    };

    const resetPaymentAgentWithdrawal = () => {
        setWithdrawalConfirm(initialWithdrawalConfirmValues);
        setWithdrawalReceipt(initialWithdrawalReceiptValues);
        setIsWithdrawalSuccessful(false);
        setIsUnlistedWithdrawal(false);
    };

    return (
        <PaymentAgentWithdrawalContext.Provider
            value={{
                activeAccount,
                getPaymentAgentWithdrawalValidationSchema,
                isLoading,
                isTryWithdrawalSuccessful,
                isUnlistedWithdrawal,
                isWithdrawalRequestSubmitting,
                isWithdrawalSuccessful,
                requestPaymentAgentWithdrawal,
                requestTryPaymentAgentWithdrawal,
                resetPaymentAgentWithdrawal,
                setIsTryWithdrawalSuccessful,
                setIsUnlistedWithdrawal,
                setVerificationCode,
                verificationCode,
                withdrawalConfirm,
                withdrawalReceipt,
            }}
        >
            {children}
        </PaymentAgentWithdrawalContext.Provider>
    );
};

export default PaymentAgentWithdrawalProvider;
