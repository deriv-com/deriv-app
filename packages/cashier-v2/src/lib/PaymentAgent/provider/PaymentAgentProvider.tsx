import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { usePaymentAgentList } from '@deriv/api-v2';
import type { THooks } from '../../../hooks/types';
import { shuffleArray } from '../../../utils';

type TPaymentAgentContext = {
    isPaymentAgentListLoading: boolean;
    isSearchLoading: boolean;
    onChangeSearchTermHandler: (value: string) => void;
    onSelectPaymentMethodHandler: (value: React.SyntheticEvent<HTMLInputElement, Event> | string) => void;
    paymentAgentList?: THooks.PaymentAgentList;
    selectedPaymentMethod?: string;
    supportedPaymentMethods: string[];
};

const PaymentAgentContext = createContext<TPaymentAgentContext | null>(null);

export const usePaymentAgentContext = () => {
    const context = useContext(PaymentAgentContext);

    if (!context)
        throw new Error('usePaymentAgentContext() must be called within a component wrapped in PaymentAgentProvider.');

    return context;
};

const defaultPaymentMethod = '0';

const PaymentAgentProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { data: list, isLoading: isPaymentAgentListLoading } = usePaymentAgentList();
    const allPaymentAgentList = useMemo(() => shuffleArray(list), [list]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(defaultPaymentMethod);
    const [searchTerm, setSearchTerm] = useState('');

    const supportedPaymentMethods = useMemo(() => {
        const supportedPaymentMethods = new Set<string>();

        allPaymentAgentList?.forEach(paymentAgent => {
            paymentAgent.supported_payment_methods.forEach(({ payment_method: paymentMethod }) => {
                if (!paymentMethod) return;

                if (!supportedPaymentMethods.has(paymentMethod)) {
                    supportedPaymentMethods.add(paymentMethod);
                }
            });
        });

        return [...supportedPaymentMethods].sort((a, b) => a.localeCompare(b));
    }, [allPaymentAgentList]);

    const filteredByPaymentMethodPaymentAgentList = useMemo(() => {
        return defaultPaymentMethod === selectedPaymentMethod
            ? allPaymentAgentList
            : allPaymentAgentList?.filter(paymentAgent => {
                  const paymentMethods = paymentAgent.supported_payment_methods;
                  const paymentMethodIndex = paymentMethods
                      .map(({ payment_method: paymentMethod }) => {
                          if (!paymentMethod) return;
                          return paymentMethod;
                      })
                      .indexOf(selectedPaymentMethod);

                  if (paymentMethodIndex !== -1) return paymentAgent;
              });
    }, [allPaymentAgentList, selectedPaymentMethod]);

    const searchedByTermPaymentAgentList = useMemo(() => {
        return !searchTerm
            ? filteredByPaymentMethodPaymentAgentList
            : filteredByPaymentMethodPaymentAgentList?.filter(paymentAgent => {
                  return paymentAgent.name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
              });
    }, [filteredByPaymentMethodPaymentAgentList, searchTerm]);

    const debouncedOnChangeSearchTermHandler = useMemo(
        () =>
            debounce((value: string) => {
                setSearchTerm(value);
                setIsSearchLoading(false);
            }, 500),
        []
    );

    const onSelectPaymentMethodHandler = useCallback(
        (value: React.SyntheticEvent<HTMLInputElement, Event> | string) => {
            setSelectedPaymentMethod(value as string);
        },
        []
    );

    const onChangeSearchTermHandler = useCallback(
        (value: string) => {
            if (!value) {
                debouncedOnChangeSearchTermHandler.cancel();
                setSearchTerm('');
                setIsSearchLoading(false);
                return;
            }
            setIsSearchLoading(true);
            debouncedOnChangeSearchTermHandler(value);
        },
        [debouncedOnChangeSearchTermHandler]
    );

    return (
        <PaymentAgentContext.Provider
            value={{
                isPaymentAgentListLoading,
                isSearchLoading,
                onChangeSearchTermHandler,
                onSelectPaymentMethodHandler,
                paymentAgentList: searchedByTermPaymentAgentList,
                selectedPaymentMethod,
                supportedPaymentMethods,
            }}
        >
            {children}
        </PaymentAgentContext.Provider>
    );
};

export default PaymentAgentProvider;
