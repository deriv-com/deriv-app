import { ACTION_TYPES } from './SignupWizardContext';
import { TActions, TState } from './types';

export function valuesReducer(state: TState, action: TActions) {
    const { payload, type } = action;
    switch (type) {
        case ACTION_TYPES.SET_CURRENCY:
            return {
                ...state,
                currency: payload.currency,
            };
        case ACTION_TYPES.SET_PERSONAL_DETAILS:
            return {
                ...state,
                firstName: payload.firstName,
                lastName: payload.lastName,
            };
        case ACTION_TYPES.RESET:
            return {
                currency: '',
            };
        default:
            return state;
    }
}
