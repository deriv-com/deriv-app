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

type TItem = {
    value: string;
};

type TVideoVariants = {
    dark: { mp4: string; webm: string };
    light: { mp4: string; webm: string };
};

type TDtraderVideoUrl = {
    [key: string]: TVideoVariants;
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
    list?.find(list_item => list_item?.contract_types?.some(i => i.value === item.value)) || ({} as TContractCategory);

export const getContractCategoryKey = (list: TList[], item: TItem) => findContractCategory(list, item)?.key;

export const getContractTypes = (list: TList[], item: TItem) => findContractCategory(list, item)?.contract_types;

const STRAPI_MEDIA_URL = 'https://chief-skinny-instrument.media.strapiapp.com/';
/* In order to add more videos, please contact Deriv-com team,
    send the properly named new video files to them and ask to upload the videos to CMS.
    Then the urls for each video file will become available at https://chief-skinny-instrument.strapiapp.com/api/dtrader-videos
  */
const DESCRIPTION_VIDEO_URL: TDtraderVideoUrl = {
    accumulator: {
        light: {
            mp4: 'accumulator_description_light_cdb533b66f.mp4',
            webm: 'accumulator_description_light_c9ebc2f4ce.webm',
        },
        dark: {
            mp4: 'accumulator_description_dark_04e41f4d77.mp4',
            webm: 'accumulator_description_dark_1b5c77f52b.webm',
        },
    },
    vanilla: {
        light: {
            mp4: 'vanilla_description_light_0bd428ad76.mp4',
            webm: 'vanilla_description_light_0b8373eb16.webm',
        },
        dark: {
            mp4: 'vanilla_description_dark_5b7c818a6f.mp4',
            webm: 'vanilla_description_dark_2460d2e864.webm',
        },
    },
};

const ACCU_MANUAL_VIDEO_URL = {
    desktop: {
        light: {
            mp4: 'accumulators_manual_desktop_d86097d525.mp4',
            webm: 'accumulators_manual_desktop_c04d52a8f3.webm',
        },
        dark: {
            mp4: 'accumulators_manual_desktop_dark_d8ecb5cde3.mp4',
            webm: 'accumulators_manual_desktop_dark_4cec2afa4b.webm',
        },
    },
    mobile: {
        light: {
            mp4: 'accumulators_manual_mobile_0664b3de44.mp4',
            webm: 'accumulators_manual_mobile_7e4663e580.webm',
        },
        dark: {
            mp4: 'accumulators_manual_mobile_dark_fae872a8cc.mp4',
            webm: 'accumulators_manual_mobile_dark_8d97dd8816.webm',
        },
    },
};

export const getDescriptionVideoUrl = (contract_type: string, is_dark_theme: boolean, extension: string) => {
    const url = DESCRIPTION_VIDEO_URL[contract_type]?.[is_dark_theme ? 'dark' : 'light'][extension as 'mp4'];
    return STRAPI_MEDIA_URL + url ?? '';
};

export const getAccuManualVideoUrl = (is_mobile: boolean, is_dark_theme: boolean, extension: string) => {
    const url =
        ACCU_MANUAL_VIDEO_URL[is_mobile ? 'mobile' : 'desktop'][is_dark_theme ? 'dark' : 'light'][extension as 'mp4'];
    return STRAPI_MEDIA_URL + url ?? '';
};
