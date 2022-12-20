import React from 'react';
import { localize } from '@deriv/translations';

export const contract_category_icon = {
    [localize('Ups & Downs')]: 'IcUpsDowns',
    [localize('Highs & Lows')]: 'IcHighsLows',
    [localize('Ins & Outs')]: 'IcInsOuts',
    [localize('Look Backs')]: 'IcLookbacks',
    [localize('Digits')]: 'IcDigits',
    [localize('Multipliers')]: 'IcMultiplier',
};

export const getContractTypeCategoryIcons = () => ({
    All: 'IcCatAll',
    Options: 'IcCatOptions',
    Multipliers: 'IcCatMultiplier',
});

/**
 * Returns a list of contracts in the following format:
 * {
 *      label: '', // contract category label
 *      contract_types: [], // list of contract types
 *      icon: '', // contract categoty icon
 * }
 * @param {object} contract_types_list  - list of all contracts
 * @param {array}  unsupported_list - list of unsupported contract types
 */
export const getAvailableContractTypes = (contract_types_list, unsupported_list) => {
    return Object.keys(contract_types_list)
        .map(key => {
            const contract_types = contract_types_list[key].categories;
            const contract_name = contract_types_list[key].name;
            const available_contract_types = contract_types.filter(type =>
                type.value &&
                // TODO: remove this check once all contract types are supported
                !unsupported_list.includes(type.value)
                    ? type
                    : undefined
            );

            if (available_contract_types.length) {
                return {
                    key,
                    label: contract_name,
                    contract_types: available_contract_types,
                    icon: contract_category_icon[contract_name],
                    component:
                        contract_name === localize('Multipliers') ? (
                            <span className='dc-vertical-tab__header--new'>{localize('NEW!')}</span>
                        ) : null,
                };
            }
            return undefined;
        })
        .filter(Boolean);
};

/**
 * Returns a filtered list
 * @param {object} contract_types_list  - list of all contracts
 * @param {array}  filtered_items_array - list of filtered contract category names and/or contract types names
 */
export const getFilteredList = (contract_types_list, filtered_items_array) => {
    return Object.keys(contract_types_list)
        .map(key => {
            const { label, contract_types, icon } = contract_types_list[key];

            const filtered_by_contract_types = contract_types.filter(c =>
                filtered_items_array.includes(c.text.toLowerCase())
            );

            const filtered_by_contract_category = filtered_items_array.includes(label.toLowerCase());

            if (filtered_by_contract_types.length) {
                return {
                    label,
                    contract_types: filtered_by_contract_types,
                    icon,
                };
            } else if (filtered_by_contract_category) {
                return {
                    label,
                    contract_types,
                    icon,
                };
            }
            return undefined;
        })
        .filter(Boolean);
};

const flatten = arr => [].concat(...arr);
/**
 * Flatten list object into an array of contract category label and contract types names
 * @param {object} list
 */
export const getContractsList = list =>
    flatten(
        Object.keys(list).map(
            k => [
                list[k].label.toLowerCase(), // contract category names
                ...list[k].contract_types.map(c => c.text.toLowerCase()),
            ] // contract types names
        )
    );

export const findContractCategory = (list, item) =>
    list.find(list_item => list_item.contract_types.some(i => i.value === item.value)) || {};

export const getContractCategoryKey = (list, item) => findContractCategory(list, item).key;

export const getContractTypes = (list, item) => findContractCategory(list, item).contract_types;
