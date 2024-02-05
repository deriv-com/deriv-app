import { onChangeSymbolAsync } from '../symbol';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        contractsFor: jest.fn(() =>
            Promise.resolve({
                contracts_for: {
                    available: [],
                },
            })
        ),
    },
}));

const build_contract_types_config_spy = jest.spyOn(ContractType, 'buildContractTypesConfig');

describe('onChangeSymbolAsync', () => {
    it('should call ContractType.buildContractTypesConfig with a provided underlying symbol and should not return any value', async () => {
        const underlying = 'R_10';
        const test_underlying = 'test_underlying';

        const result = await onChangeSymbolAsync(underlying);
        expect(result).not.toBeDefined();
        expect(build_contract_types_config_spy).toHaveBeenLastCalledWith(underlying);

        await onChangeSymbolAsync(test_underlying);
        expect(build_contract_types_config_spy).toHaveBeenLastCalledWith(test_underlying);
    });
});
