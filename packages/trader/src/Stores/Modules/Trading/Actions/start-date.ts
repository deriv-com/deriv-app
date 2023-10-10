import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { TTradeStore } from 'Types';

export const onChangeStartDate = async (store: TTradeStore) => {
    const { contract_type, duration_unit, start_date } = store;
    const server_time = store.root_store?.common.server_time;
    let { start_time, expiry_type } = store;

    start_time = start_time || server_time?.clone().add(6, 'minute').format('HH:mm'); // when there is not a default value for start_time, it should be set more than 5 min after server_time

    const obj_contract_start_type = ContractType.getStartType(start_date);
    const contract_start_type = obj_contract_start_type.contract_start_type;
    const obj_sessions = ContractType.getSessions(contract_type, start_date);
    const sessions = obj_sessions.sessions;
    const obj_start_time = ContractType.getStartTime(sessions, start_date, start_time);

    const obj_duration_units_list = ContractType.getDurationUnitsList(contract_type, contract_start_type);
    const duration_units_list = obj_duration_units_list.duration_units_list;
    const obj_duration_unit = ContractType.getDurationUnit(duration_unit, contract_type, contract_start_type);

    const obj_expiry_type = ContractType.getExpiryType(duration_units_list, expiry_type);
    expiry_type = obj_expiry_type.expiry_type;
    const obj_expiry_date = ContractType.getExpiryDate(duration_units_list, store.expiry_date, expiry_type, start_date);

    const obj_duration_min_max = ContractType.getDurationMinMax(contract_type, contract_start_type);

    return {
        ...obj_contract_start_type,
        ...obj_duration_units_list,
        ...obj_duration_min_max,
        ...obj_duration_unit,
        ...obj_sessions,
        ...obj_start_time,
        ...obj_expiry_date,
        ...obj_expiry_type,
    };
};

export const onChangeExpiry = async (store: TTradeStore) => {
    const { start_time, expiry_date, expiry_type, expiry_time, start_date, symbol, sessions } = store;
    const trading_times = await ContractType.getTradingTimes(expiry_date, symbol);
    const obj_market_open_times = { market_open_times: trading_times.open };
    const obj_market_close_times = { market_close_times: trading_times.close };

    const market_close_times = obj_market_close_times.market_close_times;
    const obj_expiry_time = ContractType.getExpiryTime(
        expiry_date,
        expiry_time,
        expiry_type,
        market_close_times,
        sessions,
        start_date,
        start_time
    );

    return {
        ...obj_expiry_time,
        ...obj_market_open_times,
        ...obj_market_close_times,
    };
};
