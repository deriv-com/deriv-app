import * as ContractUtils from '../contract';
import {
    TContractInfo,
    TDigitsInfo,
    TTickItem,
    TGetFinalPrice,
    TIsEnded,
    TGetDisplayStatus,
    TIsValidToSell,
} from '../contract-types';

describe('getFinalPrice', () => {
    it("should return sell_price as final price when it's available", () => {
        const contract_info = {
            sell_price: 12345,
            bid_price: 0,
        };
        expect(ContractUtils.getFinalPrice(contract_info)).toEqual(12345);
    });
    it('should return sell_price as final price when sell_price && bid_price are available', () => {
        const contract_info = {
            sell_price: 12345,
            bid_price: 789,
        };
        expect(ContractUtils.getFinalPrice(contract_info)).toEqual(12345);
    });
    it('should return bid_price as final price when sell_price is not available and bid_price is available', () => {
        const contract_info = {
            sell_price: 0,
            bid_price: 789,
        };
        expect(ContractUtils.getFinalPrice(contract_info)).toEqual(789);
    });
    it('should return 0 as final price when sell_price and bid_price are empty', () => {
        const contract_info = {
            sell_price: 0,
            bid_price: 0,
        };
        expect(ContractUtils.getFinalPrice(contract_info)).toEqual(0);
    });
});

describe('getIndicativePrice', () => {
    it('should return getFinalPrice if it has final price and contract is ended', () => {
        const contract_info: TGetFinalPrice & TIsEnded = {
            sell_price: 12345,
            bid_price: 0,
            status: 'sold',
        };
        expect(ContractUtils.getIndicativePrice(contract_info)).toEqual(12345);
    });
    it("should return null if it doesn't have final price, bid_price and contract is not ended", () => {
        const contract_info: TGetFinalPrice & TIsEnded = {
            status: 'open',
            sell_price: 0,
            bid_price: 0,
        };
        expect(ContractUtils.getIndicativePrice(contract_info)).toEqual(null);
    });
    it("should return bid_price if it doesn't have final price, has bid_price and contract is not ended", () => {
        const contract_info: TGetFinalPrice & TIsEnded = {
            status: 'open',
            bid_price: 12345,
            sell_price: 0,
        };
        expect(ContractUtils.getIndicativePrice(contract_info)).toEqual(12345);
    });
});

describe('isEnded', () => {
    it("should return false when there is status and it's equal to open in contract info", () => {
        const contract_info: TContractInfo = {
            status: 'open',
        };
        expect(ContractUtils.isEnded(contract_info)).toEqual(false);
    });
    it("should return true when there is status and it's not equal to open in contract info", () => {
        const contract_info: TContractInfo = {
            status: 'sold',
        };
        expect(ContractUtils.isEnded(contract_info)).toEqual(true);
    });
    it('should return true when contract is expired', () => {
        const contract_info: TContractInfo = {
            status: 'open',
            is_expired: 1,
        };
        expect(ContractUtils.isEnded(contract_info)).toEqual(true);
    });
    it('should return true when contract is settleable', () => {
        const contract_info: TContractInfo = {
            status: 'open',
            is_expired: 0,
            is_settleable: 1,
        };
        expect(ContractUtils.isEnded(contract_info)).toEqual(true);
    });
    it('should return true when contract is not expired', () => {
        const contract_info: TContractInfo = {
            status: 'open',
            is_expired: 0,
        };
        expect(ContractUtils.isEnded(contract_info)).toEqual(false);
    });
    it('should return true when contract does not have is_settleable, is_expired and status', () => {
        const contract_info: TContractInfo = {};
        expect(ContractUtils.isEnded(contract_info)).toEqual(false);
    });
});

describe('isUserSold', () => {
    it("should return true if contract's status is sold", () => {
        const contract_info: TContractInfo = {
            status: 'sold',
        };
        expect(ContractUtils.isUserSold(contract_info)).toEqual(true);
    });
    it("should return false if contract's status is not sold", () => {
        const contract_info: TContractInfo = {
            status: 'open',
        };
        expect(ContractUtils.isUserSold(contract_info)).toEqual(false);
    });
});

describe('isValidToSell', () => {
    it('should return true if contract is not ended and is not sold and contract is valid to_sell', () => {
        const contract_info: TIsValidToSell = {
            status: 'open',
            is_valid_to_sell: 1,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(true);
    });
    it('should return false if contract is ended and is sold and contract is valid to sell', () => {
        const contract_info: TIsValidToSell = {
            status: 'sold',
            is_valid_to_sell: 1,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is ended and is not sold and contract is valid to sell', () => {
        const contract_info: TIsValidToSell = {
            status: 'won',
            is_valid_to_sell: 1,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is ended and is sold and contract is not valid to sell', () => {
        const contract_info: TIsValidToSell = {
            status: 'sold',
            is_valid_to_sell: 0,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is ended and is not sold and contract is not valid to sell', () => {
        const contract_info: TIsValidToSell = {
            status: 'won',
            is_valid_to_sell: 0,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is not ended and is not sold and contract is not valid to sell', () => {
        const contract_info: TIsValidToSell = {
            status: 'open',
            is_valid_to_sell: 0,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
});

describe('getLastTickFromTickStream', () => {
    it('should return the last tick in the tick_stream array', () => {
        const tick_stream: TTickItem[] = [
            {
                tick: 766.53,
                epoch: 1000001,
            },
            {
                tick: 800.23,
                epoch: 1000002,
            },
        ];
        expect(ContractUtils.getLastTickFromTickStream(tick_stream)).toMatchObject({
            tick: 800.23,
            epoch: 1000002,
        });
    });
    it('should return an empty object if the tick_stream array is empty', () => {
        const tick_stream: TTickItem[] = [];
        expect(ContractUtils.getLastTickFromTickStream(tick_stream)).toEqual({});
    });
});

describe('isDigitContract', () => {
    it('should return true if contract is digits', () => {
        expect(ContractUtils.isDigitContract('DIGITMATCH')).toEqual(true);
    });

    it('should return false if contract is not digits', () => {
        expect(ContractUtils.isDigitContract('CALLPUT')).toEqual(false);
    });
});

describe('getDigitInfo', () => {
    it('should return an empty object when tick_stream is not in contract_info', () => {
        const contract_info: TContractInfo = {};
        expect(ContractUtils.getDigitInfo({}, contract_info)).toEqual({});
    });
    it('should return an empty object if tick_stream data is already in digits_info', () => {
        const contract_info: TContractInfo = {
            entry_tick_time: 1544707342,
            entry_tick: 123.99,
            current_spot_time: 10000000,
            current_spot: 456.99,
            exit_tick_time: 10000001,
            contract_type: 'DIGITMATCH',
            barrier: '9',
            tick_stream: [
                {
                    tick: 123.456,
                    tick_display_value: '123.456',
                    epoch: 1544707344,
                },
            ],
        };
        const digits_info: TDigitsInfo = {
            1544707344: {
                digit: 6,
                spot: '123.456',
            },
        };
        expect(ContractUtils.getDigitInfo(digits_info, contract_info)).toEqual({});
    });
    it('should return a digits_info object with the latest tick_stream array data', () => {
        const contract_info: TContractInfo = {
            tick_stream: [
                {
                    tick: 123.456,
                    tick_display_value: '123.456',
                    epoch: 1544707344,
                },
                {
                    tick: 456.993,
                    tick_display_value: '456.993',
                    epoch: 1544707346,
                },
            ],
        };
        const digits_info: TDigitsInfo = {
            1544707346: {
                digit: 3,
                spot: '456.993',
            },
        };
        expect(ContractUtils.getDigitInfo({}, contract_info)).toEqual(digits_info);
    });
});

describe('getDisplayStatus', () => {
    it('should return won if contract is ended and profit is more than zero', () => {
        const contract_info: TGetDisplayStatus = {
            status: 'sold',
            buy_price: 0,
            bid_price: 100,
        };
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('won');
    });
    it('should return lost if contract is ended and profit is less than zero', () => {
        const contract_info: TGetDisplayStatus = {
            status: 'sold',
            buy_price: 100,
            bid_price: 0,
        };
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('loss');
    });
    it('should return won if contract is ended and profit is zero', () => {
        const contract_info: TGetDisplayStatus = {
            status: 'sold',
            buy_price: 100,
            bid_price: 100,
        };
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('won');
    });
    it('should return purchased if contract is not ended', () => {
        const contract_info: TGetDisplayStatus = {
            status: 'open',
            buy_price: 0,
            bid_price: 100,
        };
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('purchased');
    });
});
