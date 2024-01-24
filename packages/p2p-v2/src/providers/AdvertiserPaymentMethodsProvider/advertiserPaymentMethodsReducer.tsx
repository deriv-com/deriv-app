import { TAdvertiserPaymentMethodsConfig, TReducerAction } from '../types';

const advertiserPaymentMethodsReducer = (
    currentFormState: TAdvertiserPaymentMethodsConfig,
    action: TReducerAction
): TAdvertiserPaymentMethodsConfig => {
    // TODO: Remember to translate the strings in this reducer function
    switch (action.type) {
        case 'ADD': {
            return {
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
                formState: {
                    ...currentFormState.formState,
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

export default advertiserPaymentMethodsReducer;
