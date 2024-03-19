import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useExtendedOrderDetails } from '@/hooks';

type TOrderDetails = ReturnType<typeof useExtendedOrderDetails>['data'];

const OrderDetailsContext = createContext<TOrderDetails>({} as TOrderDetails);

type TOrderDetailsProviderProps = {
    orderDetails: TOrderDetails;
};

export const OrderDetailsProvider = ({ children, orderDetails }: PropsWithChildren<TOrderDetailsProviderProps>) => (
    <OrderDetailsContext.Provider value={orderDetails}>{children}</OrderDetailsContext.Provider>
);

export const useOrderDetails = (): TOrderDetails => useContext(OrderDetailsContext);
