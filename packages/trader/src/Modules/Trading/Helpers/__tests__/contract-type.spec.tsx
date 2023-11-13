import {
    ACCU_MANUAL_VIDEO_ID,
    CF_STREAM_CUSTOMER_URL,
    DESCRIPTION_VIDEO_ID,
    getAccuManualVideoId,
    getAvailableContractTypes,
    getContractCategoryKey,
    getContractTypeCategoryIcons,
    getContractTypes,
    getCategoriesSortedByKey,
    getDescriptionDownloadUrl,
    getDescriptionVideoId,
    ordered_trade_categories,
} from '../contract-type';

const contract_types_test_list = {
    Accumulators: { name: 'Accumulators', categories: [{ value: 'accumulator', text: 'Accumulators' }] },
    Digits: { name: 'Digits', categories: [{ value: 'match_diff', text: 'Matches/Differs' }] },
    'Ins & Outs': { name: 'Ins & Outs', categories: [{ value: 'end', text: 'Ends In/Ends Out' }] },
};
const unsupported_test_list = ['end', 'stay'];
const unsupported_short_test_list = ['stay'];
const contract_type_array = [
    { value: 'accumulator', text: 'Accumulators' },
    { value: 'rise_fall', text: 'Rise/Fall' },
];
const contract_category_list = [
    {
        contract_types: contract_type_array,
        contract_categories: [
            {
                contract_types: contract_type_array,
                icon: 'IcCatAll',
                key: 'All',
                label: 'All',
            },
        ],
        icon: 'IcCatAll',
        key: 'All',
        label: 'All',
    },
    {
        contract_types: [{ value: 'Multipliers', text: 'Multiplierss' }],
        contract_categories: [
            {
                contract_types: [{ value: 'multipliers', text: 'Multipliers' }],
                icon: 'IcCatMultiplier',
                key: 'Multipliers',
                label: 'Multipliers',
            },
        ],
        icon: 'IcCatMultiplier',
        key: 'Multipliers',
        label: 'Multipliers',
    },
];
const unavailable_trade_types_list = [
    {
        contract_types: [{ text: 'Vanillas', value: 'vanilla' }],
        icon: 'IcVanillas',
        is_unavailable: true,
        key: 'Vanillas',
        label: 'Vanillas',
    },
    {
        contract_types: [{ text: 'Accumulators', value: 'accumulator' }],
        icon: 'IcAccumulators',
        is_unavailable: true,
        key: 'Accumulators',
        label: 'Accumulators',
    },
];

describe('getContractTypeCategoryIcons', () => {
    it('should return an object with specific fields (like All, Options , Multipliers and etc.)', () => {
        expect(getContractTypeCategoryIcons().All).toEqual('IcCatAll');
    });
});

describe('getAvailableContractTypes', () => {
    it('should return an object with specific availibale contracts if they are in the unsupported list', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_test_list)).toHaveLength(2);
    });
    it('should return an object with all availibale contracts if they are not in the unsupported list', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_short_test_list)).toHaveLength(3);
    });
    it('should return null for component field if it is not Accumulators', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_test_list)[1]?.component).toEqual(null);
    });
    it('should return html element for component field if it is Accumulators', () => {
        expect(getAvailableContractTypes(contract_types_test_list, unsupported_test_list)[0]?.component).not.toEqual(
            null
        );
    });
});

describe('getContractCategoryKey', () => {
    it('should return key (contract category) if passed item has the same value as some of the passed list', () => {
        expect(getContractCategoryKey(contract_category_list, { value: 'rise_fall' })).toEqual('All');
    });
    it('should return undefined (contract category) if passed item has not the same value as some of the passed list', () => {
        expect(getContractCategoryKey(contract_category_list, { value: 'match_diff' })).toEqual(undefined);
    });
});

describe('getContractTypes', () => {
    it('should return an array with contract types if passed item has the same value as some of the passed list', () => {
        expect(getContractTypes(contract_category_list, { value: 'rise_fall' })).toEqual(contract_type_array);
    });
    it('should return undefined if passed item has not the same value as some of the passed list', () => {
        expect(getContractTypes(contract_category_list, { value: 'match_diff' })).toEqual(undefined);
    });
});

describe('getCategoriesSortedByKey', () => {
    it('should return an array with contract type objects sorted based on ordered_trade_categories list', () => {
        expect(getCategoriesSortedByKey(unavailable_trade_types_list)[0].key).toEqual(ordered_trade_categories[0]);
    });
    it('should return an empty array if a list is not received', () => {
        expect(getCategoriesSortedByKey()).toEqual([]);
    });
});

describe('getAccuManualVideoId', () => {
    it('should return AccumulatorsStatsManualModal video id for desktop in light theme', () => {
        expect(getAccuManualVideoId(false, false)).toEqual(ACCU_MANUAL_VIDEO_ID.desktop.light);
    });
    it('should return AccumulatorsStatsManualModal video id for desktop in dark theme', () => {
        expect(getAccuManualVideoId(false, true)).toEqual(ACCU_MANUAL_VIDEO_ID.desktop.dark);
    });
    it('should return AccumulatorsStatsManualModal video id for mobile in dark theme', () => {
        expect(getAccuManualVideoId(true, true)).toEqual(ACCU_MANUAL_VIDEO_ID.mobile.dark);
    });
    it('should return AccumulatorsStatsManualModal video id for mobile in light theme', () => {
        expect(getAccuManualVideoId(true, false)).toEqual(ACCU_MANUAL_VIDEO_ID.mobile.light);
    });
    it('should return AccumulatorsStatsManualModal video id for desktop in light theme when arguments are empty', () => {
        expect(getAccuManualVideoId()).toEqual(ACCU_MANUAL_VIDEO_ID.desktop.light);
    });
});

describe('getDescriptionVideoId', () => {
    it('should return an id for Vanillas description video in light theme', () => {
        expect(getDescriptionVideoId('vanilla', false)).toEqual(DESCRIPTION_VIDEO_ID.vanilla.light);
    });
    it('should return an id for Turbos description video in dark theme', () => {
        expect(getDescriptionVideoId('turbos', true)).toEqual(DESCRIPTION_VIDEO_ID.turbos.dark);
    });
    it('should return undefined when called with empty arguments', () => {
        expect(getDescriptionVideoId()).toEqual(undefined);
    });
});

describe('getDescriptionDownloadUrl', () => {
    it('should return a download URL for Vanillas description video in light theme', () => {
        expect(getDescriptionDownloadUrl('vanilla', false)).toEqual(
            `${CF_STREAM_CUSTOMER_URL}${DESCRIPTION_VIDEO_ID.vanilla.light}/downloads/default.mp4`
        );
    });
    it('should return an empty string if called with empty arguments', () => {
        expect(getDescriptionDownloadUrl()).toEqual('');
    });
});
