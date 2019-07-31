import { getUnderlyingPipSize }      from 'Stores/Modules/Trading/Helpers/active-symbols';
import { getLastTickFromTickStream } from './logic';

export const isDigitContract = (contract_type) => /digit/i.test(contract_type);

export const getDigitInfo = async (digits_info, contract_info) => {
    const { tick_stream } = contract_info;
    const { tick, epoch } = getLastTickFromTickStream(tick_stream);

    if (!tick || !epoch) return {}; // filter out empty responses

    const decimal_places = await getUnderlyingPipSize(contract_info.underlying);
    const spot           = decimal_places ? tick.toFixed(decimal_places) : tick;

    const current = (epoch in digits_info) ? {} : // filter out duplicated responses
        createDigitInfo(spot, epoch);

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
