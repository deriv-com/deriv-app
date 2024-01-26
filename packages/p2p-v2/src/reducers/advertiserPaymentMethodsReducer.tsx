import { TFormState, TReducerAction } from './types';

/**
 * @name advertiserPaymentMethodsReducer
 *
 * Reducer function for managing advertiser payment methods form state.
 * @param currentState - The current state of the form.
 * @param action - The action dispatched to the reducer.
 * @returns The new state after applying the action.
 * @example const [formState, dispatch] = useReducer(advertiserPaymentMethodsReducer, {});
 */
const advertiserPaymentMethodsReducer = (currentState: TFormState, action: TReducerAction) => {
    // TODO: Remember to translate the strings in this reducer function
    switch (action.type) {
        case 'ADD': {
            return {
                actionType: action.type,
                isVisible: true,
                selectedPaymentMethod: action.payload?.selectedPaymentMethod
                    ? {
                          display_name: action.payload?.selectedPaymentMethod?.displayName,
                          fields: action.payload?.selectedPaymentMethod?.fields,
                          id: action.payload?.selectedPaymentMethod?.id,
                          method: action.payload?.selectedPaymentMethod?.method,
                      }
                    : undefined,
                title: 'Add payment method',
            };
        }
        case 'EDIT': {
            return {
                ...currentState,
                actionType: action.type,
                isVisible: true,
                selectedPaymentMethod: {
                    display_name: action.payload?.selectedPaymentMethod?.displayName,
                    fields: action.payload?.selectedPaymentMethod?.fields,
                    id: action.payload?.selectedPaymentMethod?.id,
                    method: action.payload?.selectedPaymentMethod?.method,
                },
                title: 'Edit payment method',
            };
        }
        case 'DELETE': {
            return {
                actionType: action.type,
                selectedPaymentMethod: action.payload?.selectedPaymentMethod,
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
