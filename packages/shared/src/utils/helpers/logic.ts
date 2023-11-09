import moment from 'moment';
import { isEmptyObject } from '../object';
import { isAccumulatorContract, isOpen, isUserSold } from '../contract';
import { TContractInfo, TContractStore } from '../contract/contract-types';
import { TickSpotData } from '@deriv/api-types';

type TIsSoldBeforeStart = Required<Pick<TContractInfo, 'sell_time' | 'date_start'>>;

type TIsStarted = Required<Pick<TContractInfo, 'is_forward_starting' | 'current_spot_time' | 'date_start'>>;

export const isContractElapsed = (contract_info: TContractInfo, tick?: null | TickSpotData) => {
    if (isEmptyObject(tick) || isEmptyObject(contract_info)) return false;
    const end_time = getEndTime(contract_info) || 0;
    if (end_time && tick && tick.epoch) {
        const seconds = moment.duration(moment.unix(tick.epoch).diff(moment.unix(end_time))).asSeconds();
        return seconds >= 2;
    }
    return false;
};

export const isEndedBeforeCancellationExpired = (contract_info: TContractInfo) => {
    const end_time = getEndTime(contract_info) || 0;
    return !!(contract_info.cancellation?.date_expiry && end_time < contract_info.cancellation.date_expiry);
};

export const isSoldBeforeStart = (contract_info: TIsSoldBeforeStart) =>
    contract_info.sell_time && +contract_info.sell_time < +contract_info.date_start;

export const isStarted = (contract_info: TIsStarted) =>
    !contract_info.is_forward_starting || contract_info.current_spot_time > contract_info.date_start;

export const isUserCancelled = (contract_info: TContractInfo) => contract_info.status === 'cancelled';

export const getEndTime = (contract_info: TContractInfo) => {
    const {
        contract_type,
        exit_tick_time,
        date_expiry,
        is_expired,
        is_path_dependent,
        sell_time,
        tick_count: is_tick_contract,
    } = contract_info;

    const is_finished = !isOpen(contract_info) && (is_expired || isAccumulatorContract(contract_type));

    if (!is_finished && !isUserSold(contract_info) && !isUserCancelled(contract_info)) return undefined;

    if (isUserSold(contract_info) && sell_time) {
        return sell_time > Number(date_expiry) ? date_expiry : sell_time;
    } else if (!is_tick_contract && sell_time && sell_time > Number(date_expiry)) {
        return date_expiry;
    }

    return Number(date_expiry) > Number(exit_tick_time) && !Number(is_path_dependent) ? date_expiry : exit_tick_time;
};

export const getBuyPrice = (contract_store: TContractStore) => {
    return contract_store.contract_info.buy_price;
};

/**
 * Set contract update form initial values
 * @param {object} contract_update - contract_update response
 * @param {object} limit_order - proposal_open_contract.limit_order response
 */
