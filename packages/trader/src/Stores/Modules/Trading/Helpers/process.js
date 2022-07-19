import { ContractType as ContractTypeHelper } from 'Stores/Modules/Trading/Helpers/contract-type';
import * as ContractType from '../Actions/contract-type';
import * as Duration from '../Actions/duration';
import * as StartDate from '../Actions/start-date';

const processInSequence = async (store, functions) => {
    const snapshot = store.getSnapshot();
    // To make sure that every function is invoked and affects the snapshot respectively, we have to use for instead of forEach
    for (let i = 0; i < functions.length; i++) {
        // Shallow copy with Object.assign is good enough to extend the snapshot with new state
        // we don't need deep extension here, since each function in functions array composes a property of the store completely
        Object.assign(snapshot, await functions[i](snapshot)); // eslint-disable-line no-await-in-loop
    }
    store.updateStore({
        ...snapshot,
    });
};

export const processTradeParams = async (store, new_state) => {
    const functions = getMethodsList(store, new_state);
    await processInSequence(store, functions);

    const duration_functions = getExpiryMethodsList();
    await processInSequence(store, duration_functions);

    store.updateStore({
        is_trade_enabled: true,
    });
};

const getMethodsList = (store, new_state) => [
    ContractTypeHelper.getContractCategories,
    ContractType.onChangeContractTypeList,
    ...(/\b(symbol|contract_type|is_equal)\b/.test(Object.keys(new_state)) || !store.contract_type // symbol/contract_type changed or contract_type not set yet
        ? [ContractType.onChangeContractType]
        : []),
    StartDate.onChangeStartDate,
    Duration.onChangeExpiry, // it should be always after StartDate.onChangeStartDate
    ...(/\b(symbol|contract_type|is_equal)\b/.test(Object.keys(new_state)) || !store.contract_type // symbol/contract_type changed or contract_type not set yet
        ? [Duration.onChangeContractType]
        : []),
];

const getExpiryMethodsList = () => [StartDate.onChangeExpiry];
