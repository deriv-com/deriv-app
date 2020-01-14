import { getLastTickFromTickStream } from '../contract';

const digitCategoriesMap = [ 'even_odd', 'match_diff', 'over_under' ];
const digitTypesMap      = [ 'DIGITDIFF', 'DIGITMATCH', 'DIGITOVER', 'DIGITUNDER', 'DIGITEVEN', 'DIGITODD' ];

export const isDigitTradeType = (trade_type) => digitCategoriesMap.includes(trade_type);
export const isDigitContractType = (contract_type) => digitTypesMap.includes(contract_type);

export const getDigitInfo = (digits_info, contract_info) => {
    const { tick_stream } = contract_info;
    const { tick_display_value, epoch } = getLastTickFromTickStream(tick_stream);

    if (!tick_display_value || !epoch) return {}; // filter out empty responses

    const current = (epoch in digits_info) ? {} : // filter out duplicated responses
        createDigitInfo(tick_display_value, epoch);

    return {
        ...current,
    };
};

const createDigitInfo = (spot, spot_time) => {
    const digit = +`${spot}`.slice(-1);

    return {
        [+spot_time]: {
            digit,
            spot,
        },
    };
};
