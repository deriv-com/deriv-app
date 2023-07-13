import moment from 'moment';
import { unique } from '../object';
import { TContractInfo, TLimitOrder, TDigitsInfo, TTickItem } from './contract-types';

type TGetAccuBarriersDTraderTimeout = (params: {
    barriers_update_timestamp: number;
    has_default_timeout: boolean;
    should_update_contract_barriers?: boolean;
    tick_update_timestamp: number | null;
    underlying: string;
}) => number;

export const DELAY_TIME_1S_SYMBOL = 500;
// generation_interval will be provided via API later to help us distinguish between 1-second and 2-second symbols
export const symbols_2s = ['R_10', 'R_25', 'R_50', 'R_75', 'R_100'];

export const getContractStatus = ({ contract_type, exit_tick_time, profit, status }: TContractInfo) => {
    const closed_contract_status = profit && profit < 0 && exit_tick_time ? 'lost' : 'won';
    return isAccumulatorContract(contract_type)
        ? (status === 'open' && !exit_tick_time && 'open') || closed_contract_status
        : status;
};

export const getFinalPrice = (contract_info: TContractInfo) => contract_info.sell_price || contract_info.bid_price;

export const getIndicativePrice = (contract_info: TContractInfo) =>
    getFinalPrice(contract_info) && isEnded(contract_info)
        ? getFinalPrice(contract_info)
        : Number(contract_info.bid_price) || null;

export const getCancellationPrice = (contract_info: TContractInfo) => {
    const { cancellation: { ask_price: cancellation_price = 0 } = {} } = contract_info;
    return cancellation_price;
};

export const isEnded = (contract_info: TContractInfo) =>
    !!(
        (contract_info.status && contract_info.status !== 'open') ||
        contract_info.is_expired ||
        contract_info.is_settleable
    );

export const isOpen = (contract_info: TContractInfo) => getContractStatus(contract_info) === 'open';

export const isUserSold = (contract_info: TContractInfo) => contract_info.status === 'sold';

export const isValidToCancel = (contract_info: TContractInfo) => !!contract_info.is_valid_to_cancel;

export const isValidToSell = (contract_info: TContractInfo) =>
    !isEnded(contract_info) && !isUserSold(contract_info) && Number(contract_info.is_valid_to_sell) === 1;

export const hasContractEntered = (contract_info: TContractInfo) => !!contract_info.entry_spot;

export const isAccumulatorContract = (contract_type = '') => /ACCU/i.test(contract_type);

export const isAccumulatorContractOpen = (contract_info: TContractInfo = {}) => {
    return isAccumulatorContract(contract_info.contract_type) && getContractStatus(contract_info) === 'open';
};

export const isMultiplierContract = (contract_type: string) => /MULT/i.test(contract_type);

export const isVanillaContract = (contract_type: string) => /VANILLA/i.test(contract_type);

export const isCryptoContract = (underlying: string) => /^cry/.test(underlying);

export const getAccuBarriersDefaultTimeout = (symbol: string) => {
    return symbols_2s.includes(symbol) ? DELAY_TIME_1S_SYMBOL * 2 : DELAY_TIME_1S_SYMBOL;
};

export const getAccuBarriersDTraderTimeout: TGetAccuBarriersDTraderTimeout = ({
    barriers_update_timestamp,
    has_default_timeout,
    should_update_contract_barriers,
    tick_update_timestamp,
    underlying,
}) => {
    if (has_default_timeout || !tick_update_timestamp) return getAccuBarriersDefaultTimeout(underlying);
    const animation_correction_time =
        (should_update_contract_barriers
            ? getAccuBarriersDefaultTimeout(underlying) / -4
            : getAccuBarriersDefaultTimeout(underlying) / 4) || 0;
    const target_update_time =
        tick_update_timestamp + getAccuBarriersDefaultTimeout(underlying) + animation_correction_time;
    const difference = target_update_time - barriers_update_timestamp;
    return difference < 0 ? 0 : difference;
};

export const getAccuBarriersForContractDetails = (contract_info: TContractInfo) => {
    if (!isAccumulatorContract(contract_info.contract_type)) return {};
    const is_contract_open = isOpen(contract_info);
    const { current_spot_high_barrier, current_spot_low_barrier, high_barrier, low_barrier } = contract_info || {};
    const accu_high_barrier = is_contract_open ? current_spot_high_barrier : high_barrier;
    const accu_low_barrier = is_contract_open ? current_spot_low_barrier : low_barrier;
    return { accu_high_barrier, accu_low_barrier };
};

export const getCurrentTick = (contract_info: TContractInfo) => {
    const tick_stream = unique(contract_info.tick_stream || [], 'epoch');
    const current_tick = isDigitContract(contract_info.contract_type) ? tick_stream.length : tick_stream.length - 1;
    return !current_tick || current_tick < 0 ? 0 : current_tick;
};

export const getLastTickFromTickStream = (tick_stream: TTickItem[] = []) => tick_stream[tick_stream.length - 1] || {};

export const isDigitContract = (contract_type = '') => /digit/i.test(contract_type);

export const getDigitInfo = (digits_info: TDigitsInfo, contract_info: TContractInfo) => {
    const { tick_stream } = contract_info;
    const { tick_display_value, epoch } = getLastTickFromTickStream(tick_stream);

    if (!tick_display_value || !epoch) return {}; // filter out empty responses

    const current =
        epoch in digits_info
            ? {} // filter out duplicated responses
            : createDigitInfo(tick_display_value, epoch);

    return {
        ...current,
    };
};

export const getTotalProfit = (contract_info: TContractInfo) =>
    Number(contract_info.bid_price) - Number(contract_info.buy_price);

const createDigitInfo = (spot: string, spot_time: number) => {
    const digit = +`${spot}`.slice(-1);

    return {
        [+spot_time]: {
            digit,
            spot,
        },
    };
};

export const getLimitOrderAmount = (limit_order?: TLimitOrder) => {
    if (!limit_order) return { stop_loss: 0, take_profit: 0 };
    const {
        stop_loss: { order_amount: stop_loss_order_amount } = {},
        take_profit: { order_amount: take_profit_order_amount } = {},
    } = limit_order;

    return {
        stop_loss: stop_loss_order_amount,
        take_profit: take_profit_order_amount,
    };
};

export const getTimePercentage = (server_time: moment.Moment, start_time: number, expiry_time: number) => {
    const duration_from_purchase = moment.duration(moment.unix(expiry_time).diff(moment.unix(start_time)));
    const duration_from_now = moment.duration(moment.unix(expiry_time).diff(server_time));
    let percentage = (duration_from_now.asMilliseconds() / duration_from_purchase.asMilliseconds()) * 100;

    if (percentage < 0.5) {
        percentage = 0;
    } else if (percentage > 100) {
        percentage = 100;
    }

    return Math.round(percentage);
};

export const getTickSizeBarrierPercentage = (tick_size_barrier: number) =>
    `${(tick_size_barrier * 100 + Number.EPSILON).toFixed(5)}%`;

export const getGrowthRatePercentage = (growth_rate: number) => growth_rate * 100;

export const getDisplayStatus = (contract_info: TContractInfo) => {
    let status = 'purchased';
    if (isEnded(contract_info)) {
        status = getTotalProfit(contract_info) >= 0 ? 'won' : 'lost';
    }
    return status;
};

/**
 * Set contract update form initial values
 * @param {object} contract_update - contract_update response
 * @param {object} limit_order - proposal_open_contract.limit_order response
 */

export const getContractUpdateConfig = ({ contract_update, limit_order }: TContractInfo) => {
    const { stop_loss, take_profit } = getLimitOrderAmount(limit_order || contract_update);

    return {
        // convert stop_loss, take_profit value to string for validation to work
        contract_update_stop_loss: stop_loss ? Math.abs(stop_loss).toString() : '',
        contract_update_take_profit: take_profit ? take_profit.toString() : '',
        has_contract_update_stop_loss: !!stop_loss,
        has_contract_update_take_profit: !!take_profit,
    };
};

export const shouldShowExpiration = (symbol: string) => /^cry/.test(symbol);

export const shouldShowCancellation = (symbol = '') => !/^(cry|CRASH|BOOM|stpRNG|WLD|JD)/.test(symbol);
