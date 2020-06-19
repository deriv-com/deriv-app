import ContractTypeHelper from './contract-type';
import * as ContractType from '../Actions/contract-type';
import * as Duration from '../Actions/duration';
import * as StartDate from '../Actions/start-date';

export const processTradeParams = async (store, new_state) => {
    const snapshot = store.getSnapshot();
    const functions = getMethodsList(store, new_state);

    // To make sure that every function is invoked and affects the snapshot respectively, we have to use for instead of forEach
    for (let i = 0; i < functions.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        Object.assign(snapshot, await functions[i](snapshot));
    }

    return snapshot;
};

const getMethodsList = (store, new_state) => [
    ContractTypeHelper.getContractCategories,
    ContractType.onChangeContractTypeList,
    ...(/\b(symbol|contract_type)\b/.test(Object.keys(new_state)) || !store.contract_type // symbol/contract_type changed or contract_type not set yet
        ? [ContractType.onChangeContractType]
        : []),
    StartDate.onChangeStartDate,
    Duration.onChangeExpiry, // it should be always after StartDate.onChangeStartDate
];
