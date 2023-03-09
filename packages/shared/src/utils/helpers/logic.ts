import moment from 'moment';
import { isEmptyObject } from '../object';
import { isUserSold } from '../contract';
import { TContractInfo } from '../contract/contract-types';

type TTick = {
    ask?: number;
    bid?: number;
    epoch?: number;
    id?: string;
    pip_size: number;
    quote?: number;
    symbol?: string;
};

type TIsEndedBeforeCancellationExpired = TGetEndTime & {
    cancellation: {
        ask_price: number;
        date_expiry: number;
    };
};

type TIsSoldBeforeStart = Required<Pick<TContractInfo, 'sell_time' | 'date_start'>>;

type TIsStarted = Required<Pick<TContractInfo, 'is_forward_starting' | 'current_spot_time' | 'date_start'>>;

type TGetEndTime = Pick<TContractInfo, 'is_expired' | 'sell_time' | 'status' | 'tick_count'> &
    Required<Pick<TContractInfo, 'date_expiry' | 'exit_tick_time' | 'is_path_dependent'>>;

type TGetBuyPrice = {
    contract_info: {
        buy_price: number;
    };
};

export const isContractElapsed = (contract_info: TGetEndTime, tick: TTick) => {
    if (isEmptyObject(tick) || isEmptyObject(contract_info)) return false;
    const end_time = getEndTime(contract_info) || 0;
    if (end_time && tick.epoch) {
        const seconds = moment.duration(moment.unix(tick.epoch).diff(moment.unix(end_time))).asSeconds();
        return seconds >= 2;
    }
    return false;
};

export const isEndedBeforeCancellationExpired = (contract_info: TIsEndedBeforeCancellationExpired) => {
    const end_time = getEndTime(contract_info) || 0;
    return !!(contract_info.cancellation && end_time < contract_info.cancellation.date_expiry);
};

export const isSoldBeforeStart = (contract_info: TIsSoldBeforeStart) =>
    contract_info.sell_time && +contract_info.sell_time < +contract_info.date_start;

export const isStarted = (contract_info: TIsStarted) =>
    !contract_info.is_forward_starting || contract_info.current_spot_time > contract_info.date_start;

export const isUserCancelled = (contract_info: TContractInfo) => contract_info.status === 'cancelled';

export const getEndTime = (contract_info: TGetEndTime) => {
    const {
        exit_tick_time,
        date_expiry,
        is_expired,
        is_path_dependent,
        sell_time,
        status,
        tick_count: is_tick_contract,
    } = contract_info;

    const is_finished = is_expired && status !== 'open';

    if (!is_finished && !isUserSold(contract_info) && !isUserCancelled(contract_info)) return undefined;

    if (isUserSold(contract_info) && sell_time) {
        return sell_time > date_expiry ? date_expiry : sell_time;
    } else if (!is_tick_contract && sell_time && sell_time > date_expiry) {
        return date_expiry;
    }

    return date_expiry > exit_tick_time && !+is_path_dependent ? date_expiry : exit_tick_time;
};

export const getBuyPrice = (contract_store: TGetBuyPrice) => {
    return contract_store.contract_info.buy_price;
};

/**
 * Set contract update form initial values
 * @param {object} contract_update - contract_update response
 * @param {object} limit_order - proposal_open_contract.limit_order response
 */
