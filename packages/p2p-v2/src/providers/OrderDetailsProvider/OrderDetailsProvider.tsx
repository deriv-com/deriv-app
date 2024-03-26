import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useExtendedOrderDetails } from '@/hooks';

type TOrderDetails = ReturnType<typeof useExtendedOrderDetails>['data'];

type TContextValue = {
    isErrorOrderInfo: boolean;
    orderDetails: TOrderDetails;
};

const OrderDetailsContext = createContext<TContextValue>({} as TContextValue);

type TOrderDetailsProviderProps = {
    value: TContextValue;
};

export const OrderDetailsProvider = ({ children, value }: PropsWithChildren<TOrderDetailsProviderProps>) => (
    <OrderDetailsContext.Provider value={value}>{children}</OrderDetailsContext.Provider>
);

export const useOrderDetails = (): TContextValue => useContext(OrderDetailsContext);
