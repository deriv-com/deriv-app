import { hasContractStarted, isContractSupportedAndStarted } from '../logic';
import { mockContractInfo } from '../../contract/contract-info';

describe('hasContractStarted', () => {
    it('should return true if current_spot_time is more then date_start', () => {
        const contractInfo = { current_spot_time: 1700481950, date_start: 1700481935 };
        expect(hasContractStarted(contractInfo)).toBe(true);
    });
    it('should return false if current_spot_time is less then date_start', () => {
        const contractInfo = { current_spot_time: 1700481935, date_start: 1700481950 };
        expect(hasContractStarted(contractInfo)).toBe(false);
    });
    it('should return false if current_spot_time is equal then date_start', () => {
        const contractInfo = { current_spot_time: 1700481935, date_start: 1700481935 };
        expect(hasContractStarted(contractInfo)).toBe(false);
    });
    it('should return false if passed object does not contain current_spot_time or date_start fields', () => {
        expect(hasContractStarted({})).toBe(false);
    });
});

describe('isContractSupportedAndStarted', () => {
    const mock_props = {
        symbol: '1HZ100V',
        contract_info: mockContractInfo(),
    };
    it('should return true if contract_info was passed,symbol is the same as in underlying, contract is supported and it has been started', () => {
        expect(isContractSupportedAndStarted(mock_props.symbol, mock_props.contract_info)).toBe(true);
    });
    it('should return false if contract_info was not passed', () => {
        expect(isContractSupportedAndStarted(mock_props.symbol)).toBe(false);
    });
    it('should return false if symbol is not the same as in underlying', () => {
        expect(isContractSupportedAndStarted('1HZ200V', mock_props.contract_info)).toBe(false);
    });
    it('should return false if contract is not supported', () => {
        expect(
            isContractSupportedAndStarted(mock_props.symbol, mockContractInfo({ contract_type: 'UNSUPPORTED' }))
        ).toBe(false);
    });
    it('should return false if contract has not been started', () => {
        expect(
            isContractSupportedAndStarted(
                mock_props.symbol,
                mockContractInfo({ current_spot_time: 1700481930, date_start: 1700481935 })
            )
        ).toBe(false);
    });
});
