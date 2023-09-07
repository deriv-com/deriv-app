import * as constants from '../constants';

const initialState = {
    scope: constants.STOP,
};

const signal = (state = initialState, action) => {
    switch (action.type) {
        case constants.START:
            return {
                scope: constants.BEFORE_PURCHASE,
            };
        case constants.PURCHASE_SUCCESSFUL:
            return {
                scope: constants.DURING_PURCHASE,
                openContract: false,
            };
        case constants.OPEN_CONTRACT:
            return {
                scope: constants.DURING_PURCHASE,
                openContract: true,
            };
        case constants.SELL:
            return {
                scope: constants.STOP,
            };
        case constants.NEW_TICK:
            return {
                ...state,
                newTick: action.payload,
            };
        default:
            return state;
    }
};

export default signal;
