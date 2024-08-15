import { CONTRACT_TYPES } from '@deriv/shared';
import { getContractDetailsConfig } from '../contract-details-config';

describe('getContractDetailsConfig', () => {
    it('should return correct part of config for contract type which is among configs keys', () => {
        expect(getContractDetailsConfig(CONTRACT_TYPES.ACCUMULATOR)).toEqual({
            isTakeProfitVisible: true,
            isDealCancellationVisible: false,
            isStopLossVisible: false,
            isTpHistoryVisible: true,
        });
    });

    it('should return default config for contract type which is not among configs keys', () => {
        expect(getContractDetailsConfig(CONTRACT_TYPES.CALL)).toEqual({
            isTakeProfitVisible: false,
            isDealCancellationVisible: false,
            isStopLossVisible: false,
            isTpHistoryVisible: false,
        });
    });
});
