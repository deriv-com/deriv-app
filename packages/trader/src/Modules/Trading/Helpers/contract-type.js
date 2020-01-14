import { localize } from '@deriv/translations';

export const unsupported_contract_types_list = [
    // TODO: uncomment before merge
    // 'run_high_low',
    // 'reset',
    // 'asian',
    // 'tick_high_low',
    // 'end',
    // 'stay',
    // 'lb_call',
    // 'lb_put',
    // 'lb_high_low',
    // 'multiplier',
];

export const contract_category_icon = {
    [localize('Ups & Downs')]      : 'IcUpsDowns',
    [localize('Highs & Lows')]     : 'IcHighsLows',
    [localize('Ins & Outs')]       : 'IcInsOuts',
    [localize('Look Backs')]       : 'IcLookbacks',
    [localize('Digits')]           : 'IcDigits',
    [localize('Multiplier option')]: 'IcMultiplier',
};

export const getAvailableContractTypes = (contract_types_list, unsupported_list) => {
    const list = Object.keys(contract_types_list)
        .map(key => {
            const contract_types = contract_types_list[key];
            const available_contract_types =
            contract_types.filter(type => type.value &&
                    // TODO: remove this check once all contracts are supported
                    !unsupported_list.includes(type.value) ? type : undefined
            );

            if (available_contract_types.length) {
                return {
                    label         : key,
                    contract_types: available_contract_types,
                    icon          : contract_category_icon[key],
                    is_new        : key === localize('Multiplier option'), // TODO: remove line to hide 'NEW' label besides contract names
                };
            }
            return undefined;
        })
        .filter(key => !!key);

    return list;
};

export const getFilteredList = (contract_types_list, filtered_items_array) => {
    const filtered_list = Object.keys(contract_types_list)
        .map(key => {
            const {
                label,
                contract_types,
                icon,
            } = contract_types_list[key];

            const filtered_contract_types = contract_types
                .filter(c => filtered_items_array.includes(c.text.toLowerCase()));

            if (filtered_contract_types.length) {
                return {
                    label,
                    contract_types: filtered_contract_types,
                    icon,
                };
            }
            return undefined;
        })
        .filter(key => !!key);

    return filtered_list;
};

const findContractCategory = (list, item) => Object.keys(list).map(key =>
    list[key].contract_types.find(i => i.value === item.value) ? list[key] : null)
    .filter(i => !!i)[0];

export const getContractsList = (contract_types_list, property) => Object.keys(contract_types_list || {})
    .reduce((key, list) => ([...key, ...contract_types_list[list].contract_types
        .map(contract => property ? contract[property].toLowerCase() : contract.value)]), []);

export const getContractCategoryLabel = (list, item) => findContractCategory(list, item).label;

export const getContractTypes = (list, item) => findContractCategory(list, item).contract_types;

