import { expect }                        from 'chai';
import { isDigitContract, getDigitInfo } from '../digits';

describe('Digits', () => {
    describe('isDigitContract', () => {
        it('should return true if contract is digits', () => {
            expect(isDigitContract('DIGITMATCH')).to.eql(true);
        });

        it('should return false if contract is not digits', () => {
            expect(isDigitContract('CALLPUT')).to.eql(false);
        });
    });

    describe('getDigitInfo', () => {
        it('should return an empty object when tick_stream is not in contract_info', () => {
            const contract_info = {};
            expect(getDigitInfo({}, contract_info)).to.deep.eql({});
        });
        it('should return an empty object if tick_stream data is already in digits_info', () => {
            const contract_info = {
                entry_tick_time: 1544707342,
                entry_tick: 123.99,
                current_spot_time: 10000000,
                current_spot: 456.99,
                exit_tick_time: 10000001,
                contract_type: 'DIGITMATCH',
                barrier: 9,
                tick_stream: [
                    {
                        "tick"              : 123.456,
                        "tick_display_value": "123.456",
                        "epoch"             : 1544707344,
                    }
                ],
            };
            const digits_info = {
                1544707344: {
                    digit: 6,
                    spot: "123.456",
                },
            };
            expect(getDigitInfo(digits_info, contract_info)).to.deep.eql({});
        });
        it('should return a digits_info object with the latest tick_stream array data', () => {
            const contract_info = {
                tick_stream: [
                    {
                        "tick"              : 123.456,
                        "tick_display_value": "123.456",
                        "epoch"             : 1544707344,
                    },
                    {
                        "tick"              : 456.993,
                        "tick_display_value": "456.993",
                        "epoch"             : 1544707346,
                    }
                ],
            };
            const digits_info = {
                1544707346: {
                    digit: 3,
                    spot : "456.993",
                },
            };
            expect(getDigitInfo({}, contract_info)).to.deep.eql(digits_info);
        });
    });
});
