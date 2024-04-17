import React, { createContext, useCallback, useContext, useState } from 'react';
import { useActiveAccount, usePaymentAgentWithdrawal } from '@deriv/api-v2';
import type { THooks } from '../../../../hooks/types';
import type { TCurrency } from '../../../../types';
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

type TWithdrawalStatus = 'idle' | 'successful' | 'try_successful';

type TPaymentAgentWithdrawalContext = {
    activeAccount?: THooks.ActiveAccount;
    getPaymentAgentWithdrawalValidationSchema: TGetPaymentAgentWithdrawalValidationSchema;
    isLoading: boolean;
    isUnlistedWithdrawal: boolean;
    isWithdrawalRequestSubmitting: boolean;
    requestPaymentAgentWithdrawal: (params: TRequestPaymentAgentWithdrawalParams) => void;
    requestTryPaymentAgentWithdrawal: (params: TRequestTryPaymentAgentWithdrawalParams) => void;
    resetPaymentAgentWithdrawal: VoidFunction;
    setIsUnlistedWithdrawal: React.Dispatch<React.SetStateAction<boolean>>;
    setWithdrawalStatus: React.Dispatch<React.SetStateAction<TWithdrawalStatus>>;
    withdrawalConfirm: TConfirm;
    withdrawalReceipt: TReceipt;
    withdrawalStatus: TWithdrawalStatus;
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

const initialWithdrawalConfirmValues: TConfirm = {
    amount: '',
    clientID: '',
    currency: undefined,
    paymentAgentID: '',
    paymentAgentName: '',
};
const initialWithdrawalReceiptValues: TReceipt = {
    amount: '',
    currency: undefined,
    paymentAgentEmail: '',
    paymentAgentName: '',
    paymentAgentPhoneNumbers: [],
    paymentAgentUrls: [],
};

const PaymentAgentWithdrawalProvider: React.FC<React.PropsWithChildren<TPaymentAgentWithdrawalModuleProps>> = ({
    children,
    setVerificationCode,
    verificationCode,
}) => {
    const { data: activeAccount, isLoading } = useActiveAccount();
    const { isLoading: isWithdrawalRequestSubmitting, mutateAsync } = usePaymentAgentWithdrawal();
    const [withdrawalStatus, setWithdrawalStatus] = useState<TWithdrawalStatus>('idle');
    const [isUnlistedWithdrawal, setIsUnlistedWithdrawal] = useState(false);
    const currency = activeAccount?.currency as TCurrency;

    const [withdrawalConfirm, setWithdrawalConfirm] = useState(initialWithdrawalConfirmValues);
    const [withdrawalReceipt, setWithdrawalReceipt] = useState(initialWithdrawalReceiptValues);

    const getPaymentAgentWithdrawalValidationSchema: TGetPaymentAgentWithdrawalValidationSchema = useCallback(
        (maxWithdrawal, minWithdrawal) => {
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
        },
        [activeAccount?.balance, activeAccount?.currency_config?.fractional_digits, currency, isUnlistedWithdrawal]
    );

    const requestTryPaymentAgentWithdrawal = useCallback(
        ({ amount, paymentagent_loginid: paymentAgentLoginid }: TRequestTryPaymentAgentWithdrawalParams) => {
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
                    setWithdrawalStatus('try_successful');
                }
            });
        },
        [activeAccount?.loginid, currency, mutateAsync, verificationCode]
    );

    const requestPaymentAgentWithdrawal = useCallback(
        ({
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
                    setWithdrawalStatus('successful');
                }
            });
        },
        [currency, mutateAsync, verificationCode]
    );

    const resetPaymentAgentWithdrawal = useCallback(() => {
        setWithdrawalConfirm(initialWithdrawalConfirmValues);
        setWithdrawalReceipt(initialWithdrawalReceiptValues);
        setWithdrawalStatus('idle');
        setIsUnlistedWithdrawal(false);
        setVerificationCode('');
    }, [setVerificationCode]);

    return (
        <PaymentAgentWithdrawalContext.Provider
            value={{
                activeAccount,
                getPaymentAgentWithdrawalValidationSchema,
                isLoading,
                isUnlistedWithdrawal,
                isWithdrawalRequestSubmitting,
                requestPaymentAgentWithdrawal,
                requestTryPaymentAgentWithdrawal,
                resetPaymentAgentWithdrawal,
                setIsUnlistedWithdrawal,
                setWithdrawalStatus,
                withdrawalConfirm,
                withdrawalReceipt,
                withdrawalStatus,
            }}
        >
            {children}
        </PaymentAgentWithdrawalContext.Provider>
    );
};

export default PaymentAgentWithdrawalProvider;
