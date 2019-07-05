import ContractType      from '../Helpers/contract-type';
import { getExpiryType } from '../Helpers/duration';

export const onChangeExpiry = (store) => {
    const contract_expiry_type = getExpiryType(store);

    // TODO: there will be no barrier available if contract is only daily but client chooses intraday endtime. we should find a way to handle this.
    const obj_barriers = store.contract_expiry_type !== contract_expiry_type && // barrier value changes for tick/intraday/daily
        ContractType.getBarriers(store.contract_type, contract_expiry_type);

    return {
        contract_expiry_type,
        ...obj_barriers,
    };
};
