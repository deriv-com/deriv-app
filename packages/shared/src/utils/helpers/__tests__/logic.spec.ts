import { hasContractStarted } from '../logic';

describe('hasContractStarted', () => {
    it('should return true if current_spot_time is more then date_start', () => {
        const contract_info = { current_spot_time: 1700481950, date_start: 1700481935 };
        expect(hasContractStarted(contract_info)).toBe(true);
    });
    it('should return false if current_spot_time is less then date_start', () => {
        const contract_info = { current_spot_time: 1700481935, date_start: 1700481950 };
        expect(hasContractStarted(contract_info)).toBe(false);
    });
    it('should return false if current_spot_time is equal then date_start', () => {
        const contract_info = { current_spot_time: 1700481935, date_start: 1700481935 };
        expect(hasContractStarted(contract_info)).toBe(false);
    });
    it('should return false if contract_info does not contain current_spot_time or date_start fields', () => {
        expect(hasContractStarted({})).toBe(false);
    });
});
