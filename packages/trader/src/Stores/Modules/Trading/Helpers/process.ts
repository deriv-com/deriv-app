import { ContractType as ContractTypeHelper } from 'Stores/Modules/Trading/Helpers/contract-type';
import * as ContractType from '../Actions/contract-type';
import * as Duration from '../Actions/duration';
import * as StartDate from '../Actions/start-date';
import { useTraderStore } from 'Stores/useTraderStores';

const processInSequence = async (
    store: ReturnType<typeof useTraderStore>,
    functions: ReturnType<typeof getMethodsList>
) => {
    //@ts-expect-error error will persist until basestore is typescript converted
    const snapshot: ReturnType<typeof useTraderStore> = store.getSnapshot();
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

export const processTradeParams = async (
    store: ReturnType<typeof useTraderStore>,
    new_state: DeepPartial<ReturnType<typeof useTraderStore>>
) => {
    const functions = getMethodsList(store, new_state);
    await processInSequence(store, functions);

    const duration_functions = getExpiryMethodsList();
    await processInSequence(store, duration_functions);

    store.updateStore({
        is_trade_enabled: true,
    });
};

const getMethodsList = (
    store: Parameters<typeof processTradeParams>[0],
    new_state: Parameters<typeof processTradeParams>[1]
) => {
    const filtered_keys = Object.keys(new_state).filter(key => /\b(symbol|contract_type|is_equal)\b/.test(key));
    return [
        ContractTypeHelper.getContractCategories,
        ContractType.onChangeContractTypeList,
        ...(filtered_keys.length > 0 || !store.contract_type // symbol/contract_type changed or contract_type not set yet
            ? [ContractType.onChangeContractType]
            : []),
        StartDate.onChangeStartDate,
        Duration.onChangeExpiry, // it should be always after StartDate.onChangeStartDate
        ...(filtered_keys.length || !store.contract_type // symbol/contract_type changed or contract_type not set yet
            ? [Duration.onChangeContractType]
            : []),
    ];
};

const getExpiryMethodsList = () => [StartDate.onChangeExpiry];
