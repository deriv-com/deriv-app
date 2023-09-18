import {
    getCardLabels,
    getMarketNamesMap,
    getUnsupportedContracts,
    getSupportedContracts,
    getContractConfig,
    getContractTypeDisplay,
    getContractTypePosition,
    TRADE_FEATURE,
} from '../contract';

type TGetSupportedContractsKey = keyof ReturnType<typeof getSupportedContracts>;
const card_label = 'Apply';
const markets_name = 'AUD/CAD';
const unsupported_contract = {
    name: 'Spread Up',
    position: 'top',
};
const supported_high_low = {
    feature_flag: TRADE_FEATURE.HIGH_LOW,
    name: 'Higher',
    position: 'top',
};
const supported_not_high_low = {
    feature_flag: TRADE_FEATURE.RISE_FALL,
    name: 'Rise',
    position: 'top',
};

describe('getCardLabels', () => {
    it('should return an object with card labels, e.g. such as Apply', () => {
        expect(getCardLabels().APPLY).toEqual(card_label);
    });
});

describe('getMarketNamesMap', () => {
    it('should return an object with markets names, e.g. such as AUD/CAD', () => {
        expect(getMarketNamesMap().FRXAUDCAD).toEqual(markets_name);
    });
});

describe('getUnsupportedContracts', () => {
    it('should return an object with unsupported contracts, e.g. such as Spread Up', () => {
        expect(getUnsupportedContracts().CALLSPREAD).toEqual(unsupported_contract);
    });
});

describe('getSupportedContracts', () => {
    it('should return an object with specific supported contracts if is_high_low === true', () => {
        expect(getSupportedContracts(true).CALL).toEqual(supported_high_low);
    });

    it('should return an object with specific supported contracts if is_high_low === false', () => {
        expect(getSupportedContracts(false).CALL).toEqual(supported_not_high_low);
    });
});

describe('getContractConfig', () => {
    it('should return an object with specific contracts if is_high_low === true', () => {
        expect(getContractConfig(true).CALL).toEqual(supported_high_low);
    });

    it('should return object with specific contracts if is_high_low === false', () => {
        expect(getContractConfig(false).CALL).toEqual(supported_not_high_low);
    });
});

describe('getContractTypeDisplay', () => {
    it('should return a specific button name if show_button_name === true and contract_config has a button_name field', () => {
        expect(getContractTypeDisplay('ACCU', false, true)).toEqual('Buy');
    });
    it('should return a specific contract name if show_button_name === false but contract_config has a button_name field', () => {
        expect(getContractTypeDisplay('ACCU')).toEqual('Accumulators');
    });
    it('should return a specific contract name if show_button_name === true but contract_config has no button_name field', () => {
        expect(getContractTypeDisplay('MULTDOWN', true, true)).toEqual('Down');
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
        expect(getContractTypePosition('NOTOUCH')).toBe('bottom');
    });
    it('should return a top position if such type does not exist', () => {
        expect(getContractTypePosition('TEST' as TGetSupportedContractsKey)).toBe('top');
    });
});
