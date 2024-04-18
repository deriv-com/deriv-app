import React, { createContext, PropsWithChildren, useContext } from 'react';
import { TSocketError } from '@deriv/api-v2/types';

type TContextValue = {
    error: TSocketError<'p2p_advertiser_info'> | undefined;
    isIdle: boolean;
    isLoading: boolean;
    isSubscribed: boolean;
    setHasCreatedAdvertiser: (hasCreatedAdvertiser: boolean) => void;
};

const AdvertiserInfoStateContext = createContext<TContextValue>({} as TContextValue);

type TAdvertiserInfoStateProviderProps = {
    value: TContextValue;
};

export const AdvertiserInfoStateProvider = ({
    children,
    value,
}: PropsWithChildren<TAdvertiserInfoStateProviderProps>) => (
    <AdvertiserInfoStateContext.Provider value={value}>{children}</AdvertiserInfoStateContext.Provider>
);

export const useAdvertiserInfoState = (): TContextValue => useContext(AdvertiserInfoStateContext);
