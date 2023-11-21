import * as constants from '../constants';

const dispatchIfScopeIs = ({ dispatch, getState, data, scope }) => {
    const { scope: currentScope } = getState();
    if (currentScope === scope) {
        dispatch(data);
    }
};

export const start = () => (dispatch, getState) =>
    dispatchIfScopeIs({ dispatch, getState, data: { type: constants.START }, scope: constants.STOP });

export const proposalsReady = () => ({ type: constants.PROPOSALS_READY });

export const clearProposals = () => ({ type: constants.CLEAR_PROPOSALS });

const dispatchIfScopeIsBeforePurchase = args => dispatchIfScopeIs({ ...args, scope: constants.BEFORE_PURCHASE });

const dispatchIfBeforePurchaseReady = args => {
    const { getState } = args;
    const { proposalsReady: beforePurchaseReady } = getState();

    if (beforePurchaseReady) {
        dispatchIfScopeIsBeforePurchase(args);
    }

    dispatchIfScopeIs({ ...args, scope: constants.BEFORE_PURCHASE });
};

export const purchaseSuccessful = () => (dispatch, getState) =>
    dispatchIfBeforePurchaseReady({ dispatch, getState, data: { type: constants.PURCHASE_SUCCESSFUL } });

export const openContractReceived = () => (dispatch, getState) => {
    const { scope: currentScope } = getState();
    if (currentScope === constants.DURING_PURCHASE) {
        dispatch({ type: constants.OPEN_CONTRACT });
    }
    dispatchIfBeforePurchaseReady({ dispatch, getState, data: { type: constants.OPEN_CONTRACT } });
};

export const sell = () => (dispatch, getState) =>
    dispatchIfScopeIs({ dispatch, getState, data: { type: constants.SELL }, scope: constants.DURING_PURCHASE });
