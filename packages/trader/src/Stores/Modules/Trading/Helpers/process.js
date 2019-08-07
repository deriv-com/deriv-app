import extend from 'extend';

import ContractTypeHelper from './contract-type';
import * as ContractType  from '../Actions/contract-type';
import * as Duration      from '../Actions/duration';
import * as StartDate     from '../Actions/start-date';

export const processTradeParams = async(store, new_state) => {
    const snapshot = store.getSnapshot();
    const functions = getMethodsList(store, new_state);

    // To make sure that every function is invoked and affects the snapshot respectively, we have to use for instead of forEach
    for (let i = 0; i < functions.length; i++){
        extendOrReplace(snapshot, await functions[i](snapshot)); // eslint-disable-line no-await-in-loop
    }

    return snapshot;
};

const getMethodsList = (store, new_state) => ([
    ContractTypeHelper.getContractCategories,
    ContractType.onChangeContractTypeList,
    ...(/\b(symbol|contract_type)\b/.test(Object.keys(new_state)) || !store.contract_type ? // symbol/contract_type changed or contract_type not set yet
        [ContractType.onChangeContractType] : []),
    StartDate.onChangeStartDate,
    Duration.onChangeExpiry, // it should be always after StartDate.onChangeStartDate
]);

// Some values need to be replaced, not extended
const extendOrReplace = (source, new_values) => {
    const to_replace = ['contract_types_list', 'duration_units_list', 'form_components', 'market_close_times', 'trade_types'];

    to_replace.forEach((key) => {
        if (key in new_values) {
            source[key] = undefined;
        }
    });

    extend(true, source, new_values);
};
