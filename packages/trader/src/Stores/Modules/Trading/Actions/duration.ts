import { getExpiryType, getDurationMinMaxValues } from '@deriv/shared';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { TTextValueStrings, TTradeStore } from 'Types';

type TOnChangeExpiry = (store: TTradeStore) => {
    contract_expiry_type: string;
    barrier_count?: number;
    barrier_1?: string;
    barrier_2?: string;
};

export const onChangeExpiry: TOnChangeExpiry = store => {
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

export const onChangeContractType = (store: TTradeStore, prev_duration_unit: string) => {
    const contract_expiry_type = getExpiryType(store);

    const { duration, duration_min_max, duration_unit, duration_units_list } = store;

    const obj_duration = assertDuration({
        contract_expiry_type,
        duration,
        duration_min_max,
        duration_unit,
        prev_duration_unit,
        duration_units_list,
    });

    return {
        ...obj_duration,
    };
};

const assertDuration = ({
    contract_expiry_type,
    duration,
    duration_min_max,
    duration_unit,
    prev_duration_unit,
    duration_units_list,
}: {
    contract_expiry_type: string;
    duration: number;
    duration_min_max: TTradeStore['duration_min_max'];
    duration_unit: string;
    prev_duration_unit?: string;
    duration_units_list?: TTextValueStrings[];
}) => {
    const [min, max] = getDurationMinMaxValues(duration_min_max ?? {}, contract_expiry_type ?? '', duration_unit ?? '');

    if (prev_duration_unit && !duration_units_list?.map(unit => unit.value).includes(prev_duration_unit)) {
        return { duration: min };
    }

    if (Number(duration) < Number(min)) {
        return { duration: min };
    }
    if (Number(duration) > Number(max)) {
        return { duration: max };
    }
    return {};
};
