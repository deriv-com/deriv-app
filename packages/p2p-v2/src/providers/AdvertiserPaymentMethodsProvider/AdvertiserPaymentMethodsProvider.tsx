import React, { createContext, Dispatch, PropsWithChildren, useContext, useReducer } from 'react';
import { TAdvertiserPaymentMethodsConfig, TReducerAction } from '../types';
import advertiserPaymentMethodsReducer from './advertiserPaymentMethodsReducer';

const AdvertiserPaymentMethodsConfigContext = createContext<TAdvertiserPaymentMethodsConfig | null>(null);

const AdvertiserPaymentMethodsConfigDispatchContext = createContext<Dispatch<TReducerAction> | null>(null);

export const AdvertiserPaymentMethodsProvider = ({ children }: PropsWithChildren<unknown>) => {
    const [advertiserPaymentMethodsConfig, dispatch] = useReducer(advertiserPaymentMethodsReducer, {});
    return (
        <AdvertiserPaymentMethodsConfigContext.Provider value={advertiserPaymentMethodsConfig}>
            <AdvertiserPaymentMethodsConfigDispatchContext.Provider value={dispatch}>
                {children}
            </AdvertiserPaymentMethodsConfigDispatchContext.Provider>
        </AdvertiserPaymentMethodsConfigContext.Provider>
    );
};

export const useAdvertiserPaymentMethodsConfig = () => {
    const context = useContext(AdvertiserPaymentMethodsConfigContext);
    if (!context) {
        throw new Error('useAdvertiserPaymentMethodsConfig must be used within an AdvertiserPaymentMethodsProvider');
    }
    return context;
};

export const useAdvertiserPaymentMethodsConfigDispatch = () => {
    const dispatch = useContext(AdvertiserPaymentMethodsConfigDispatchContext);
    if (!dispatch) {
        throw new Error(
            'useAdvertiserPaymentMethodsConfigDispatch must be used within an AdvertiserPaymentMethodsProvider'
        );
    }
    return dispatch;
};

export default AdvertiserPaymentMethodsProvider;
