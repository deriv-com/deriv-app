import { getExpiryType, getDurationMinMaxValues } from '@deriv/shared';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';

export const onChangeExpiry = store => {
    const contract_expiry_type = getExpiryType(store);

    // TODO: there will be no barrier available if contract is only daily but client chooses intraday endtime. we should find a way to handle this.
    const obj_barriers =
        store.contract_expiry_type !== contract_expiry_type && // barrier value changes for tick/intraday/daily
        ContractType.getBarriers(store.contract_type, contract_expiry_type);

    return {
        contract_expiry_type,
        ...obj_barriers,
    };
};

export const onChangeContractType = store => {
    const contract_expiry_type = getExpiryType(store);

    const { duration, duration_min_max, duration_unit } = store;

    const obj_duration = assertDuration({ contract_expiry_type, duration, duration_min_max, duration_unit });

    return {
        ...obj_duration,
    };
};

const assertDuration = ({ contract_expiry_type, duration, duration_min_max, duration_unit } = {}) => {
    const [min, max] = getDurationMinMaxValues(duration_min_max, contract_expiry_type, duration_unit);

    if (duration < min) {
        return { duration: min };
    }
    if (duration > max) {
        return { duration: max };
    }
    return {};
};
