import React, { createContext, Dispatch, PropsWithChildren, useContext, useReducer } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { p2p } from '@deriv/api';

type TSelectedPaymentMethod = Partial<{
    displayName: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['display_name'];
    fields: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['fields'];
    id: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['id'];
    method: NonNullable<TAdvertiserPaymentMethods>[number]['method'];
}>;

type TAdvertiserPaymentMethodsConfig = {
    formState?: {
        actionType?: 'ADD' | 'DELETE' | 'EDIT' | 'RESET';
        isVisible?: boolean;
        paymentMethod?: DeepPartial<NonNullable<TAdvertiserPaymentMethods>[number]>;
        title?: string;
    };
};

type TReducerAction = {
    payload?: {
        formState?: TAdvertiserPaymentMethodsConfig['formState'];
        paymentMethod?: DeepPartial<TSelectedPaymentMethod>;
    };
    type?: NonNullable<TAdvertiserPaymentMethodsConfig['formState']>['actionType'];
};

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

const advertiserPaymentMethodsReducer = (
    advertiserPaymentMethodsConfig: TAdvertiserPaymentMethodsConfig,
    action: TReducerAction
): TAdvertiserPaymentMethodsConfig => {
    // TODO: Remember to translate the strings in this reducer function
    switch (action.type) {
        case 'ADD': {
            return {
                ...advertiserPaymentMethodsConfig,
                formState: {
                    actionType: action.type,
                    isVisible: true,
                    paymentMethod: action.payload?.paymentMethod
                        ? {
                              display_name: action.payload?.paymentMethod?.displayName,
                              fields: action.payload?.paymentMethod?.fields,
                              id: action.payload?.paymentMethod?.id,
                              method: action.payload?.paymentMethod?.method,
                          }
                        : undefined,
                    title: 'Add payment method',
                },
            };
        }
        case 'EDIT': {
            return {
                ...advertiserPaymentMethodsConfig,
                formState: {
                    ...advertiserPaymentMethodsConfig.formState,
                    actionType: action.type,
                    isVisible: true,
                    paymentMethod: {
                        display_name: action.payload?.paymentMethod?.displayName,
                        fields: action.payload?.paymentMethod?.fields,
                        id: action.payload?.paymentMethod?.id,
                        method: action.payload?.paymentMethod?.method,
                    },
                    title: 'Edit payment method',
                },
            };
        }
        case 'DELETE': {
            return {
                formState: {
                    actionType: action.type,
                    paymentMethod: action.payload?.paymentMethod,
                },
            };
        }
        case 'RESET': {
            return {};
        }

        default: {
            throw Error(`Unknown action: ${action.type}`);
        }
    }
};

export default AdvertiserPaymentMethodsProvider;
