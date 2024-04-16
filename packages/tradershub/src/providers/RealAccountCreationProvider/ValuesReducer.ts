import { ACTION_TYPES } from './RealAccountCreationContext';
import { TActions, TState } from './types';

export function valuesReducer(state: TState, action: TActions) {
    if (action.type === ACTION_TYPES.RESET) return { currency: '' };

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
                ...payload,
            };
        case ACTION_TYPES.SET_ADDRESS:
            return {
                ...state,
                ...payload,
            };
        default:
            return state;
    }
}
