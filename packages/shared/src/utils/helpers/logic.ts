import moment from 'moment';
import { isEmptyObject } from '../object';
import { isAccumulatorContract, isOpen, isUserSold } from '../contract';
import { TContractInfo, TContractStore } from '../contract/contract-types';
import { TickSpotData, WebsiteStatus, AccountListResponse } from '@deriv/api-types';
import { getSupportedContracts } from '../constants/contract';

type TIsSoldBeforeStart = Required<Pick<TContractInfo, 'sell_time' | 'date_start'>>;

export const sortApiData = (arr: AccountListResponse[]) => {
    return arr.slice().sort((a, b) => {
        const loginA = a?.login;
        const loginB = b?.login;

        if (loginA && loginB) {
            if (loginA < loginB) {
                return -1;
            }
            if (loginA > loginB) {
                return 1;
            }
        }
        return 0;
    });
};

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

export const hasContractStarted = (contract_info?: TContractInfo) =>
    Number(contract_info?.current_spot_time) > Number(contract_info?.date_start);

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
 * Checks if the server is currently down or updating.
 *
 * @param {WebsiteStatusResponse} response - The response object containing the status of the website.
 * @returns {boolean} True if the website status is 'down' or 'updating', false otherwise.
 */
export const checkServerMaintenance = (website_status: WebsiteStatus | undefined | null) => {
    const { site_status = '' } = website_status || {};
    return site_status === 'down' || site_status === 'updating';
};

export const isContractSupportedAndStarted = (symbol: string, contract_info?: TContractInfo) =>
    !!contract_info &&
    symbol === contract_info.underlying &&
    //Added check for unsupported and forward starting contracts, which have not started yet
    !!getSupportedContracts()[contract_info?.contract_type as keyof ReturnType<typeof getSupportedContracts>] &&
    hasContractStarted(contract_info);
