import {
    CONTRACT_TYPES,
    TContractInfo,
    addComma,
    getDurationPeriod,
    getDurationTime,
    getDurationUnitText,
    getGrowthRatePercentage,
    isAccumulatorContract,
    isResetContract,
    getCardLabelsV2,
} from '@deriv/shared';
import { getBarrierValue } from 'App/Components/Elements/PositionsDrawer/helpers';

const CARD_LABELS = getCardLabelsV2();

// Contains all key values that are used more than once in different transform objects
const getCommonFields = (data: TContractInfo) => {
    const { tick_count, tick_passed, contract_type } = data;
    const ticks_label = Number(tick_count) < 2 ? CARD_LABELS.TICK : CARD_LABELS.TICKS;
    const ticks_duration_text = isAccumulatorContract(contract_type)
        ? `${tick_passed}/${tick_count} ${CARD_LABELS.TICKS}`
        : `${tick_count} ${ticks_label}`;

    return {
        [CARD_LABELS.REFERENCE_ID]: [
            data.transaction_ids?.buy ? `${data.transaction_ids.buy} (Buy)` : '',
            data.transaction_ids?.sell ? `${data.transaction_ids.sell} (Sell)` : '',
        ],
        [CARD_LABELS.STAKE]: data.buy_price ? `${data.buy_price.toFixed(2)} ${data.currency}` : '',
        [CARD_LABELS.DURATION]:
            Number(tick_count) > 0
                ? ticks_duration_text
                : `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [CARD_LABELS.PAYOUT_PER_POINT]: data.display_number_of_contracts ?? '',
    };
};

// For Multiplier
const transformMultiplierData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.MULTIPLIER]: data.multiplier ? `x${data.multiplier}` : '',
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.COMMISSION]: data.commission ? `${data.commission} ${data.currency}` : '',
        [CARD_LABELS.TAKE_PROFIT]: data.limit_order?.take_profit?.order_amount
            ? `${data.limit_order.take_profit.order_amount.toFixed(2)} ${data.currency}`
            : CARD_LABELS.NOT_SET,
        [CARD_LABELS.STOP_LOSS]: data.limit_order?.stop_loss?.order_amount
            ? `${data.limit_order.stop_loss.order_amount.toFixed(2)} ${data.currency}`
            : CARD_LABELS.NOT_SET,
        [CARD_LABELS.STOP_OUT_LEVEL]: data.limit_order?.stop_out?.order_amount
            ? `${data.limit_order.stop_out.order_amount.toFixed(2)} ${data.currency}`
            : '',
    };
};

// For Rise
const transformCallPutData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
        [CARD_LABELS.BARRIER]: data.barrier ?? '',
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
    };
};

// For Turbos
const transformTurbosData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
        [CARD_LABELS.BARRIER]: data.barrier ?? '',
        [CARD_LABELS.PAYOUT_PER_POINT]: commonFields[CARD_LABELS.PAYOUT_PER_POINT],
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.TAKE_PROFIT]: data.limit_order?.take_profit?.order_amount
            ? `${data.limit_order.take_profit.order_amount.toFixed(2)} ${data.currency}`
            : CARD_LABELS.NOT_SET,
    };
};

// For Digits
const transformDigitsData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [CARD_LABELS.TARGET]: getBarrierValue(data),
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
    };
};

// For Accumulators
const transformAccumulatorData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        ...{
            ...((data.is_expired || data.is_sold) && {
                [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
            }),
        },
        [CARD_LABELS.GROWTH_RATE]: data.growth_rate ? `${getGrowthRatePercentage(data.growth_rate)}%` : '',
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        ...{
            ...(data.limit_order?.take_profit && {
                [CARD_LABELS.TAKE_PROFIT]: data.limit_order?.take_profit?.order_amount
                    ? `${data.limit_order.take_profit.order_amount} ${data.currency}`
                    : CARD_LABELS.NOT_SET,
            }),
        },
    };
};

// For Vanillas
const transformVanillaData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[`${CARD_LABELS.REFERENCE_ID}`],
        [CARD_LABELS.STRIKE_PRICE]:
            (isResetContract(data.contract_type) ? addComma(data.entry_spot_display_value) : getBarrierValue(data)) ||
            ' - ',
        [CARD_LABELS.DURATION]: `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [CARD_LABELS.PAYOUT_PER_POINT]: commonFields[CARD_LABELS.PAYOUT_PER_POINT],
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
    };
};

// Map of contract types to their respective transform functions
const transformFunctionMap: Record<string, (data: TContractInfo) => Record<string, any>> = {
    [CONTRACT_TYPES.TURBOS.LONG]: transformTurbosData,
    [CONTRACT_TYPES.TURBOS.SHORT]: transformTurbosData,
    [CONTRACT_TYPES.MULTIPLIER.DOWN]: transformMultiplierData,
    [CONTRACT_TYPES.MULTIPLIER.UP]: transformMultiplierData,
    [CONTRACT_TYPES.MATCH_DIFF.MATCH]: transformDigitsData,
    [CONTRACT_TYPES.MATCH_DIFF.DIFF]: transformDigitsData,
    [CONTRACT_TYPES.EVEN_ODD.EVEN]: transformDigitsData,
    [CONTRACT_TYPES.EVEN_ODD.ODD]: transformDigitsData,
    [CONTRACT_TYPES.OVER_UNDER.OVER]: transformDigitsData,
    [CONTRACT_TYPES.OVER_UNDER.UNDER]: transformDigitsData,
    [CONTRACT_TYPES.RESET.CALL]: transformCallPutData,
    [CONTRACT_TYPES.PUT]: transformCallPutData,
    [CONTRACT_TYPES.PUTE]: transformCallPutData,
    [CONTRACT_TYPES.CALLE]: transformCallPutData,
    [CONTRACT_TYPES.CALL]: transformCallPutData,
    [CONTRACT_TYPES.TOUCH.ONE_TOUCH]: transformCallPutData,
    [CONTRACT_TYPES.TOUCH.NO_TOUCH]: transformCallPutData,
    [CONTRACT_TYPES.ACCUMULATOR]: transformAccumulatorData,
    [CONTRACT_TYPES.VANILLA.CALL]: transformVanillaData,
    [CONTRACT_TYPES.VANILLA.PUT]: transformVanillaData,
};

const useOrderDetails = (contract_info: TContractInfo) => {
    const contractInfo = contract_info;
    if (!contractInfo.contract_type) return;
    const transformFunction = transformFunctionMap[contractInfo.contract_type];
    const details = transformFunction ? transformFunction(contractInfo) : {};

    return {
        details,
    };
};

export default useOrderDetails;
