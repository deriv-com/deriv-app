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
} from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { getBarrierValue } from 'App/Components/Elements/PositionsDrawer/helpers';

// Contains all key values that are used more than once in different transform objects
const getCommonFields = (data: TContractInfo) => {
    const { tick_count, tick_passed, contract_type } = data;
    const ticks_label = Number(tick_count) < 2 ? localize('tick') : localize('ticks');
    const ticks_duration_text = isAccumulatorContract(contract_type)
        ? `${tick_passed}/${tick_count} ${localize('ticks')}`
        : `${tick_count} ${ticks_label}`;

    return {
        [localize('Reference ID')]: [
            data.transaction_ids?.buy ? `${data.transaction_ids.buy} (Buy)` : '',
            data.transaction_ids?.sell ? `${data.transaction_ids.sell} (Sell)` : '',
        ],
        [localize('Stake')]: data.buy_price ? `${data.buy_price.toFixed(2)} ${data.currency}` : '',
        [localize('Duration')]:
            Number(tick_count) > 0
                ? ticks_duration_text
                : `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [localize('Payout per point')]: data.display_number_of_contracts ? `${data.display_number_of_contracts}` : '',
    };
};

// For Multiplier
const transformMultiplierData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [localize('Reference ID')]: commonFields[localize('Reference ID')],
        [localize('Multiplier')]: data.multiplier ? `x${data.multiplier}` : '',
        [localize('Stake')]: commonFields[localize('Stake')],
        [localize('Commission')]: data.commission ? `${data.commission} ${data.currency}` : '',
        [localize('Take Profit')]: data.limit_order?.take_profit?.order_amount
            ? `${data.limit_order.take_profit.order_amount.toFixed(2)} ${data.currency}`
            : localize('Not set'),
        [localize('Stop loss')]: data.limit_order?.stop_loss?.order_amount
            ? `${data.limit_order.stop_loss.order_amount.toFixed(2)} ${data.currency}`
            : localize('Not set'),
        [localize('Stop out level')]: data.limit_order?.stop_out?.order_amount
            ? `${data.limit_order.stop_out.order_amount.toFixed(2)} ${data.currency}`
            : '',
    };
};

// For Rise
const transformRiseData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [localize('Reference ID')]: commonFields[localize('Reference ID')],
        [localize('Duration')]: commonFields[localize('Duration')],
        [localize('Barrier')]: data.barrier ? data.barrier : '',
        [localize('Stake')]: commonFields[localize('Stake')],
    };
};

// For Turbos
const transformTurbosData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [localize('Reference ID')]: commonFields[localize('Reference ID')],
        [localize('Duration')]: commonFields[localize('Duration')],
        [localize('Barrier')]: data.barrier ? data.barrier : '',
        [localize('Payout per point')]: commonFields[localize('Payout per point')],
        [localize('Stake')]: commonFields[localize('Stake')],
        [localize('Take Profit')]: data.limit_order?.take_profit?.order_amount
            ? `${data.limit_order.take_profit.order_amount.toFixed(2)} ${data.currency}`
            : localize('Not set'),
    };
};

// For Digits
const transformMatcherData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [localize('Reference ID')]: commonFields[localize('Reference ID')],
        [localize('Duration')]: `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [localize('Target')]: getBarrierValue(data),
        [localize('Stake')]: commonFields[localize('Stake')],
    };
};
// For Accumulators
const transformAccumulatorData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [localize('Reference ID')]: commonFields[localize('Reference ID')],
        [localize('Growth rate')]: data.growth_rate ? `${getGrowthRatePercentage(data.growth_rate)}%` : '',
        [localize('Duration')]: `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [localize('Stake')]: commonFields[localize('Stake')],
        ...{
            ...(data.limit_order?.take_profit && {
                [localize('Take Profit')]: data.limit_order?.take_profit?.order_amount
                    ? `${data.limit_order.take_profit.order_amount} ${data.currency}`
                    : localize('Not set'),
            }),
        },
    };
};

// For Vanillas
const transformVanillaData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [localize('Reference ID')]: commonFields[localize('Reference ID')],
        [localize('Strike Price')]:
            (isResetContract(data.contract_type) ? addComma(data.entry_spot_display_value) : getBarrierValue(data)) ||
            ' - ',
        [localize('Duration')]: `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [localize('Payout per point')]: commonFields[localize('Payout per point')],
        [localize('Stake')]: commonFields[localize('Stake')],
    };
};

// Map of contract types to their respective transform functions
const transformFunctionMap: Record<string, (data: TContractInfo) => Record<string, any>> = {
    [CONTRACT_TYPES.TURBOS.LONG]: transformTurbosData,
    [CONTRACT_TYPES.TURBOS.SHORT]: transformTurbosData,
    [CONTRACT_TYPES.MULTIPLIER.DOWN]: transformMultiplierData,
    [CONTRACT_TYPES.MULTIPLIER.UP]: transformMultiplierData,
    [CONTRACT_TYPES.MATCH_DIFF.MATCH]: transformMatcherData,
    [CONTRACT_TYPES.MATCH_DIFF.DIFF]: transformMatcherData,
    [CONTRACT_TYPES.EVEN_ODD.EVEN]: transformMatcherData,
    [CONTRACT_TYPES.EVEN_ODD.ODD]: transformMatcherData,
    [CONTRACT_TYPES.OVER_UNDER.OVER]: transformMatcherData,
    [CONTRACT_TYPES.OVER_UNDER.UNDER]: transformMatcherData,
    [CONTRACT_TYPES.RESET.CALL]: transformRiseData,
    [CONTRACT_TYPES.PUT]: transformRiseData,
    [CONTRACT_TYPES.CALL]: transformRiseData,
    [CONTRACT_TYPES.TOUCH.ONE_TOUCH]: transformRiseData,
    [CONTRACT_TYPES.TOUCH.NO_TOUCH]: transformRiseData,
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
