import React from 'react';
import { localize } from '@deriv/translations';
import { ActiveSymbols } from '@deriv/api-types';
import { TContractType, TContractCategory, TList } from '../Components/Form/ContractType/types';

type TContractTypesList = {
    [key: string]: {
        name: string;
        categories: DeepRequired<TContractType[]>;
    };
};

type TDtraderVideoUrl = {
    [key: string]: TVideoVariants;
};

type TItem = {
    value: string;
};

type TVideoVariants = {
    dark: string;
    light: string;
};

export const isMajorPairsSymbol = (checked_symbol: string, active_symbols: ActiveSymbols) =>
    active_symbols.some(({ submarket, symbol }) => /major_pairs/i.test(submarket) && checked_symbol === symbol);

export const contract_category_icon = {
    [localize('Ups & Downs')]: 'IcUpsDowns',
    [localize('Highs & Lows')]: 'IcHighsLows',
    [localize('Ins & Outs')]: 'IcInsOuts',
    [localize('Look Backs')]: 'IcLookbacks',
    [localize('Digits')]: 'IcDigits',
    [localize('Multipliers')]: 'IcMultiplier',
    [localize('Accumulators')]: 'IcCatAccumulator',
} as const;

export const ordered_trade_categories = [
    'Accumulators',
    'Vanillas',
    'Turbos',
    'Multipliers',
    'Ups & Downs',
    'Highs & Lows',
    'Digits',
];

export const getContractTypeCategoryIcons = () =>
    ({
        All: 'IcCatAll',
        Accumulators: 'IcCatAccumulator',
        Options: 'IcCatOptions',
        Multipliers: 'IcCatMultiplier',
        Turbos: 'IcCatTurbos',
    } as const);

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

export const showLabelForMultipliers = (checked_symbol: string) =>
    /R_|1HZ/i.test(checked_symbol) && !/1HZ150V|1HZ250V/i.test(checked_symbol);

export const getAvailableContractTypes = (contract_types_list: TContractTypesList, unsupported_list: string[]) => {
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
                        contract_name === localize('Accumulators') ? (
                            <span className='dc-vertical-tab__header--new'>{localize('NEW!')}</span>
                        ) : null,
                };
            }
            return undefined;
        })
        .filter(Boolean) as {
        key: string;
        label: string;
        contract_types: TContractType[];
        icon:
            | 'IcUpsDowns'
            | 'IcHighsLows'
            | 'IcInsOuts'
            | 'IcLookbacks'
            | 'IcDigits'
            | 'IcMultiplier'
            | 'IcCatAccumulator';
        component: JSX.Element | null;
    }[];
};

/**
 * Returns a filtered list
 * @param {object} contract_types_list  - list of all contracts
 * @param {array}  filtered_items_array - list of filtered contract category names and/or contract types names
 */
/*export const getFilteredList = (contract_types_list, filtered_items_array: Array<string>) => {
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
};*/

// const flatten = (arr: any) => [].concat(...arr);

/**
 * Flatten list object into an array of contract category label and contract types names
 * @param {object} list
 */
// export const getContractsList = (list: any) =>
//     flatten(
//         Object.keys(list).map(
//             k => [
//                 list[k].label.toLowerCase(), // contract category names
//                 ...list[k].contract_types.map((c: any) => c.text.toLowerCase()),
//             ] // contract types names
//         )
//     );

export const findContractCategory = (list: Partial<TList[]>, item: TItem) =>
    list?.find(list_item => list_item?.contract_types?.some(i => i.value.includes(item.value))) ||
    ({} as TContractCategory);

export const getContractCategoryKey = (list: TList[], item: TItem) => findContractCategory(list, item)?.key;

export const getContractTypes = (list: TList[], item: TItem) => findContractCategory(list, item)?.contract_types;

export const getCategoriesSortedByKey = (list: TContractCategory[] = []) =>
    [...list].sort((a, b) => ordered_trade_categories.indexOf(a.key) - ordered_trade_categories.indexOf(b.key));

export const CF_STREAM_CUSTOMER_URL = 'https://customer-hhvo3ceuqt00w8g8.cloudflarestream.com';
/* The video upload feature is not available yet. The following video uids are taken from CF Stream account. */
export const DESCRIPTION_VIDEO_ID: TDtraderVideoUrl = {
    accumulator: {
        light: 'dc6145aaee3f6b3f1cd96be9a3d1bfee',
        dark: 'e122519abc977631e67d21fbe08e8192',
    },
    turbos: {
        light: 'df97133addc5b8863a617e03697ea051',
        dark: '38041ca7fdd5388df4db9563608d0bcc',
    },
    vanilla: {
        light: '2bacfe56a73840d1a4f3239affedaab2',
        dark: 'ed81e651f8bf01ab80e968091dc7fa35',
    },
};

export const ACCU_MANUAL_VIDEO_ID = {
    desktop: {
        light: 'c2df9e1c57de0a796dddb15e8889f97a',
        dark: '55c0d349423dedaffc2d039b05c68954',
    },
    mobile: {
        light: '1ed3940d92c0876fd3e37acd529b631e',
        dark: '77f2e150235e492f6a21e170a792515b',
    },
};

export const getAccuManualVideoId = (is_mobile = false, is_dark_theme = false) =>
    ACCU_MANUAL_VIDEO_ID[is_mobile ? 'mobile' : 'desktop'][is_dark_theme ? 'dark' : 'light'];

export const getDescriptionVideoId = (contract_type = '', is_dark_theme = false) =>
    DESCRIPTION_VIDEO_ID[contract_type]?.[is_dark_theme ? 'dark' : 'light'];

export const getDescriptionDownloadUrl = (contract_type = '', is_dark_theme = false) => {
    const uid = getDescriptionVideoId(contract_type, is_dark_theme);
    /* The following url will work only if the MP4 download is enabled for the video in the CF Stream account */
    return uid ? `${CF_STREAM_CUSTOMER_URL}${uid}/downloads/default.mp4` : '';
};
