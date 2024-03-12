import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { usePaymentAgentList } from '@deriv/api-v2';
import type { THooks } from '../../../hooks/types';
import { getNormalizedPaymentMethod, getSupportedPaymentMethods } from '../utils';

type TPaymentAgentContext = {
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
    const { data: allPaymentAgentList } = usePaymentAgentList();
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(defaultPaymentMethod);
    const [searchTerm, setSearchTerm] = useState('');
    const supportedPaymentMethods = useMemo(
        () => getSupportedPaymentMethods(allPaymentAgentList),
        [allPaymentAgentList]
    );

    const filteredByPaymentMethodPaymentAgentList = useMemo(() => {
        return defaultPaymentMethod === selectedPaymentMethod
            ? //TODO: shuffle allPaymentAgentList
              allPaymentAgentList
            : allPaymentAgentList?.filter(paymentAgent => {
                  const paymentMethods = paymentAgent.supported_payment_methods;
                  const paymentMethodIndex = paymentMethods
                      .map(({ payment_method: paymentMethod }) => {
                          if (!paymentMethod) return;
                          return getNormalizedPaymentMethod(paymentMethod)?.toLowerCase();
                      })
                      .indexOf(selectedPaymentMethod.toLowerCase());

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
