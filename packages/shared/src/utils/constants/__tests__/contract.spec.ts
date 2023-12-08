import {
    getCardLabels,
    getMarketNamesMap,
    getUnsupportedContracts,
    getSupportedContracts,
    getContractConfig,
    getContractTypeDisplay,
    getContractTypePosition,
    getCleanedUpCategories,
} from '../contract';
import { CONTRACT_TYPES, TRADE_TYPES } from '../../contract';

type TGetSupportedContractsKey = keyof ReturnType<typeof getSupportedContracts>;
const card_label = 'Apply';
const markets_name = 'AUD/CAD';
const unsupported_contract = {
    name: 'Spread Up',
    position: 'top',
};
const supported_high_low_contract = {
    name: 'Higher',
    position: 'top',
};
const supported_non_high_low_contract = {
    name: 'Rise',
    position: 'top',
};

jest.mock('../../storage', () => ({
    ...jest.requireActual('../../storage'),
    LocalStore: {
        getObject: jest.fn(() => ({ data: { sharkfin: false } })),
    },
}));

describe('getCardLabels', () => {
    it('should return an object with card labels, e.g. such as Apply', () => {
        expect(getCardLabels().APPLY).toEqual(card_label);
    });
});

describe('getMarketNamesMap', () => {
    const symbols_translation_object = getMarketNamesMap();

    it('should return an object with symbols, e.g. such as AUD/CAD', () => {
        expect(symbols_translation_object.FRXAUDCAD).toEqual(markets_name);
    });
    it('should return an object with symbols, including Volatility 25 (1s) Index, Volatility 50 (1s) Index and Volatility 75 (1s) Index', () => {
        expect(symbols_translation_object['1HZ25V']).toEqual('Volatility 25 (1s) Index');
        expect(symbols_translation_object['1HZ50V']).toEqual('Volatility 50 (1s) Index');
        expect(symbols_translation_object['1HZ75V']).toEqual('Volatility 75 (1s) Index');
    });
});

describe('getUnsupportedContracts', () => {
    it('should return an object with unsupported contracts, e.g. such as Spread Up', () => {
        expect(getUnsupportedContracts().CALLSPREAD).toEqual(unsupported_contract);
    });
});

describe('getSupportedContracts', () => {
    it('should return an object with specific supported contracts if is_high_low === true', () => {
        expect(getSupportedContracts(true).CALL).toEqual(supported_high_low_contract);
    });

    it('should return an object with specific supported contracts if is_high_low === false', () => {
        expect(getSupportedContracts(false).CALL).toEqual(supported_non_high_low_contract);
    });
});

describe('getContractConfig', () => {
    it('should return an object with specific contracts if is_high_low === true', () => {
        expect(getContractConfig(true).CALL).toEqual(supported_high_low_contract);
    });

    it('should return object with specific contracts if is_high_low === false', () => {
        expect(getContractConfig(false).CALL).toEqual(supported_non_high_low_contract);
    });
});

describe('getContractTypeDisplay', () => {
    it('should return a specific button name if show_button_name === true and contract_config has a button_name field', () => {
        expect(getContractTypeDisplay(CONTRACT_TYPES.ACCUMULATOR, false, true)).toEqual('Buy');
    });
    it('should return a specific contract name if show_button_name === false but contract_config has a button_name field', () => {
        expect(getContractTypeDisplay(CONTRACT_TYPES.ACCUMULATOR)).toEqual('Accumulators');
    });
    it('should return a specific contract name if show_button_name === true but contract_config has no button_name field', () => {
        expect(getContractTypeDisplay(CONTRACT_TYPES.MULTIPLIER.DOWN, true, true)).toEqual('Down');
    });
    it('should return an empty string if show_button_name === false and contract_config has no name field', () => {
        expect(getContractTypeDisplay('TEST', true, false)).toBe('');
    });
    it('should return an empty string if show_button_name === true and contract_config has no name field and no button_name', () => {
        expect(getContractTypeDisplay('TEST', true, true)).toBe('');
    });
});

describe('getContractTypePosition', () => {
    it('should return a specific button position if such type exist', () => {
        expect(getContractTypePosition(CONTRACT_TYPES.TOUCH.NO_TOUCH)).toBe('bottom');
    });
    it('should return a top position if such type does not exist', () => {
        expect(getContractTypePosition('TEST' as TGetSupportedContractsKey)).toBe('top');
    });
});

describe('getCleanedUpCategories', () => {
    it('should return only those trade categories that are objects containing value & text', () => {
        const initial_categories = {
            'Ups & Downs': {
                name: 'Ups & Downs',
                categories: [
                    {
                        value: TRADE_TYPES.RISE_FALL,
                        text: 'Rise/Fall',
                    },
                    TRADE_TYPES.RISE_FALL_EQUAL,
                    TRADE_TYPES.RUN_HIGH_LOW,
                    TRADE_TYPES.RESET,
                    TRADE_TYPES.ASIAN,
                    TRADE_TYPES.CALL_PUT_SPREAD,
                ],
            },
            Vanillas: {
                name: 'Vanillas',
                categories: [TRADE_TYPES.VANILLA.CALL, TRADE_TYPES.VANILLA.PUT],
            },
        };
        const resulting_categories = {
            'Ups & Downs': {
                name: 'Ups & Downs',
                categories: [
                    {
                        value: TRADE_TYPES.RISE_FALL,
                        text: 'Rise/Fall',
                    },
                ],
            },
        };
        expect(getCleanedUpCategories(initial_categories)).toEqual(resulting_categories);
    });
    it('should return only those trade categories that do not have disabled feature flag', () => {
        const initial_categories = {
            Sharkfin: {
                name: 'Sharkfin',
                categories: [
                    {
                        value: 'sharkfincall',
                        text: 'Call/Put',
                    },
                    {
                        value: 'sharkfinput',
                        text: 'Call/Put',
                    },
                ],
            },
            Multipliers: {
                name: 'Multipliers',
                categories: [
                    {
                        value: TRADE_TYPES.MULTIPLIER,
                        text: 'Multipliers',
                    },
                ],
            },
        };
        const resulting_categories = {
            Multipliers: {
                name: 'Multipliers',
                categories: [
                    {
                        value: TRADE_TYPES.MULTIPLIER,
                        text: 'Multipliers',
                    },
                ],
            },
        };
        expect(getCleanedUpCategories(initial_categories)).toEqual(resulting_categories);
    });
});
