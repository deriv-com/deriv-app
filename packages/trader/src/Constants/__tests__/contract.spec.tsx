import React from 'react';
import { localize, Localize } from '@deriv/translations';
import {
    getCardLabels,
    getMarketNamesMap,
    getUnsupportedContracts,
    getSupportedContracts,
    getContractConfig,
    getContractTypeDisplay,
    getContractTypePosition,
    TContractsKeys,
} from '../contract';

const card_label = localize('Apply');
const markets_name = localize('AUD/CAD');
const unsupported_contract = {
    name: <Localize i18n_default_text='Ends Outside' />,
    position: 'top',
};
const supported_high_low = {
    name: <Localize i18n_default_text='Higher' />,
    position: 'top',
};
const not_supported_high_low = {
    name: <Localize i18n_default_text='Rise' />,
    position: 'top',
};

describe('getCardLabels', () => {
    it('should return an object with card labels', () => {
        expect(getCardLabels().APPLY).toEqual(card_label);
    });
});

describe('getMarketNamesMap', () => {
    it('should return an object with markets names', () => {
        expect(getMarketNamesMap().FRXAUDCAD).toEqual(markets_name);
    });
});

describe('getUnsupportedContracts', () => {
    it('should return an object with unsupported contracts', () => {
        expect(getUnsupportedContracts().EXPIRYMISS).toEqual(unsupported_contract);
    });
});

describe('getSupportedContracts', () => {
    it('should return an object with specific supported contracts if is_high_low === true', () => {
        expect(getSupportedContracts(true).CALL).toEqual(supported_high_low);
    });

    it('should return an object with specific supported contracts if is_high_low === false', () => {
        expect(getSupportedContracts(false).CALL).toEqual(not_supported_high_low);
    });
});

describe('getContractConfig', () => {
    it('should return an object with specific contracts if is_high_low === true', () => {
        expect(getContractConfig(true).CALL).toEqual(supported_high_low);
    });

    it('should return object with specific contracts if is_high_low === false', () => {
        expect(getContractConfig(false).CALL).toEqual(not_supported_high_low);
    });
});

describe('getContractTypeDisplay', () => {
    it('should return a specific button name if show_button_name === true and contract_config has a button_name field', () => {
        expect(getContractTypeDisplay('ACCU', false, true)).toEqual(<Localize i18n_default_text='Buy' />);
    });
    it('should return a specific contract name if show_button_name === false but contract_config has a button_name field', () => {
        expect(getContractTypeDisplay('ACCU')).toEqual(<Localize i18n_default_text='Accumulator' />);
    });
    it('should return a specific contract name if show_button_name === true but contract_config has no button_name field', () => {
        expect(getContractTypeDisplay('MULTDOWN', true, true)).toEqual(<Localize i18n_default_text='Down' />);
    });
    it('should return an empty string if show_button_name === false and contract_config has no name field', () => {
        expect(getContractTypeDisplay('TEST' as TContractsKeys, true, false)).toBe('');
    });
    it('should return an empty string if show_button_name === true and contract_config has no name field and no button_name', () => {
        expect(getContractTypeDisplay('TEST' as TContractsKeys, true, true)).toBe('');
    });
});

describe('getContractTypePosition', () => {
    it('should return a specific button position if such type exist', () => {
        expect(getContractTypePosition('NOTOUCH')).toBe('bottom');
    });
    it('should return a top position if such type does not exist', () => {
        expect(getContractTypePosition('TEST' as TContractsKeys)).toBe('top');
    });
});
