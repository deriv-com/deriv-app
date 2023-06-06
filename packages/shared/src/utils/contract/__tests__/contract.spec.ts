import * as ContractUtils from '../contract';
import { TContractInfo, TContractInfoWithNumericBarriers, TDigitsInfo, TTickItem } from '../contract-types';

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
        const contract_info: TContractInfo = {
            sell_price: 12345,
            bid_price: 0,
            status: 'sold',
        };
        expect(ContractUtils.getIndicativePrice(contract_info)).toEqual(12345);
    });
    it("should return null if it doesn't have final price, bid_price and contract is not ended", () => {
        const contract_info: TContractInfo = {
            status: 'open',
            sell_price: 0,
            bid_price: 0,
        };
        expect(ContractUtils.getIndicativePrice(contract_info)).toEqual(null);
    });
    it("should return bid_price if it doesn't have final price, has bid_price and contract is not ended", () => {
        const contract_info: TContractInfo = {
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
        const contract_info: TContractInfo = {
            status: 'open',
            is_valid_to_sell: 1,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(true);
    });
    it('should return false if contract is ended and is sold and contract is valid to sell', () => {
        const contract_info: TContractInfo = {
            status: 'sold',
            is_valid_to_sell: 1,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is ended and is not sold and contract is valid to sell', () => {
        const contract_info: TContractInfo = {
            status: 'won',
            is_valid_to_sell: 1,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is ended and is sold and contract is not valid to sell', () => {
        const contract_info: TContractInfo = {
            status: 'sold',
            is_valid_to_sell: 0,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is ended and is not sold and contract is not valid to sell', () => {
        const contract_info: TContractInfo = {
            status: 'won',
            is_valid_to_sell: 0,
        };
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is not ended and is not sold and contract is not valid to sell', () => {
        const contract_info: TContractInfo = {
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
        const contract_info: TContractInfo = {
            status: 'sold',
            buy_price: 0,
            bid_price: 100,
        };
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('won');
    });
    it('should return lost if contract is ended and profit is less than zero', () => {
        const contract_info: TContractInfo = {
            status: 'sold',
            buy_price: 100,
            bid_price: 0,
        };
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('lost');
    });
    it('should return won if contract is ended and profit is zero', () => {
        const contract_info: TContractInfo = {
            status: 'sold',
            buy_price: 100,
            bid_price: 100,
        };
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('won');
    });
    it('should return purchased if contract is not ended', () => {
        const contract_info: TContractInfo = {
            status: 'open',
            buy_price: 0,
            bid_price: 100,
        };
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('purchased');
    });
});

describe('isAccumulatorContract', () => {
    it('should return true if contract_type includes ACCU', () => {
        expect(ContractUtils.isAccumulatorContract('ACCU')).toEqual(true);
    });
    it('should return false if contract_type is not ACCU', () => {
        expect(ContractUtils.isAccumulatorContract('CALL')).toEqual(false);
    });
});

describe('isAccumulatorContractOpen', () => {
    it('should return true if contract_type includes ACCU, status is open, and current spot has NOT crossed barriers', () => {
        const contract_info: TContractInfo = {
            contract_type: 'ACCU',
            current_spot: 1232.44,
            high_barrier: '1232.555',
            low_barrier: '1232.222',
            status: 'open',
        };
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(true);
    });
    it('should return false if contract_type is not ACCU', () => {
        const contract_info: TContractInfo = {
            contract_type: 'CALL',
            current_spot: 1232.44,
            high_barrier: '1232.555',
            low_barrier: '1232.222',
            status: 'open',
        };
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(false);
    });
    it('should return false if status is not open', () => {
        const contract_info: TContractInfo = {
            contract_type: 'ACCU',
            current_spot: 1232.44,
            high_barrier: '1232.555',
            low_barrier: '1232.222',
            status: 'lost',
        };
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(false);
    });
    it('should return false if current spot has crossed high barrier', () => {
        const contract_info: TContractInfo = {
            contract_type: 'ACCU',
            current_spot: 1232.44,
            high_barrier: '1232.333',
            low_barrier: '1232.222',
            status: 'open',
        };
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(false);
    });
    it('should return false if current spot has crossed low barrier', () => {
        const contract_info: TContractInfo = {
            contract_type: 'ACCU',
            current_spot: 1232.44,
            high_barrier: '1232.666',
            low_barrier: '1232.555',
            status: 'open',
        };
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(false);
    });
    it('should return true if current spot top position is more than high barrier top position and less than low barrier top position in pixels', () => {
        const contract_info: TContractInfoWithNumericBarriers = {
            contract_type: 'ACCU',
            current_spot: 555,
            high_barrier: 444,
            low_barrier: 666,
            status: 'open',
        };
        expect(ContractUtils.isAccumulatorContractOpen(contract_info, true)).toEqual(true);
    });
    it('should return false if current spot top position is less than high barrier top position in pixels', () => {
        const contract_info: TContractInfoWithNumericBarriers = {
            contract_type: 'ACCU',
            current_spot: 555,
            high_barrier: 666,
            low_barrier: 777,
            status: 'open',
        };
        expect(ContractUtils.isAccumulatorContractOpen(contract_info, true)).toEqual(false);
    });
    it('should return false if current spot top position is more than low barrier top position in pixels', () => {
        const contract_info: TContractInfoWithNumericBarriers = {
            contract_type: 'ACCU',
            current_spot: 777,
            high_barrier: 555,
            low_barrier: 666,
            status: 'open',
        };
        expect(ContractUtils.isAccumulatorContractOpen(contract_info, true)).toEqual(false);
    });
    it('should return false if exit_tick is present', () => {
        const contract_info: TContractInfo = {
            contract_type: 'ACCU',
            current_spot: 1232.44,
            high_barrier: '1232.555',
            low_barrier: '1232.333',
            status: 'open',
            exit_tick: 1232.44,
        };
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(false);
    });
});

describe('getAccuBarriersForContractDetails', () => {
    const mocked_contract_info: TContractInfo = {
        contract_type: 'ACCU',
        high_barrier: '1232.666',
        low_barrier: '1232.222',
        status: 'open',
    };
    const previous_spot_barriers = {
        accu_high_barrier: mocked_contract_info.high_barrier,
        accu_low_barrier: mocked_contract_info.low_barrier,
    };
    it('should return an object { accu_high_barrier: current_spot_high_barrier, accu_low_barrier: current_spot_low_barrier } while ACCU contract is open', () => {
        const contract_info: TContractInfo = {
            ...mocked_contract_info,
            current_spot: 1232.555,
            current_spot_high_barrier: '1232.777',
            current_spot_low_barrier: '1232.333',
        };
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual({
            accu_high_barrier: contract_info.current_spot_high_barrier,
            accu_low_barrier: contract_info.current_spot_low_barrier,
        });
    });
    it('should return an object { accu_high_barrier: high_barrier, accu_low_barrier: low_barrier } if status is not open', () => {
        const contract_info: TContractInfo = {
            ...mocked_contract_info,
            current_spot: 1232.555,
            current_spot_high_barrier: '1232.777',
            current_spot_low_barrier: '1232.333',
            status: 'lost',
        };
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual(previous_spot_barriers);
    });
    it('should return an object { accu_high_barrier: high_barrier, accu_low_barrier: low_barrier } if current spot has crossed high barrier', () => {
        const contract_info: TContractInfo = {
            ...mocked_contract_info,
            current_spot: 1232.777,
            current_spot_high_barrier: '1232.999',
            current_spot_low_barrier: '1232.555',
        };
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual(previous_spot_barriers);
    });
    it('should return an object { accu_high_barrier: high_barrier, accu_low_barrier: low_barrier } if current spot has crossed low barrier', () => {
        const contract_info: TContractInfo = {
            ...mocked_contract_info,
            current_spot: 1232.111,
            current_spot_high_barrier: '1232.333',
            current_spot_low_barrier: '1231.999',
        };
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual(previous_spot_barriers);
    });
    it('should return an object { accu_high_barrier: high_barrier, accu_low_barrier: low_barrier } if exit_tick is present', () => {
        const contract_info: TContractInfo = {
            ...mocked_contract_info,
            current_spot: 1232.555,
            current_spot_high_barrier: '1232.777',
            current_spot_low_barrier: '1232.333',
            exit_tick: 1232.555,
        };
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual(previous_spot_barriers);
    });
    it('should return an empty object if contract type is not ACCU', () => {
        const contract_info: TContractInfo = {
            contract_type: 'CALL',
            current_spot: 1232.555,
        };
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual({});
    });
});

describe('getAccuTickStreamWithCurrentSpot', () => {
    const mocked_tick_stream = [
        {
            epoch: 1686067582,
            tick: 1232.666,
            tick_display_value: '1232.666',
        },
        {
            epoch: 1686067584,
            tick: 1232.777,
            tick_display_value: '1232.777',
        },
        {
            epoch: 1686067586,
            tick: 1232.222,
            tick_display_value: '1232.222',
        },
        {
            epoch: 1686067588,
            tick: 1232.333,
            tick_display_value: '1232.333',
        },
        {
            epoch: 1686067590,
            tick: 1232.111,
            tick_display_value: '1232.111',
        },
    ];
    const mocked_current_tick = {
        epoch: 1686067592,
        tick: 1232.555,
        tick_display_value: '1232.555',
    };
    it('should return tick_stream array of ticks including current spot if current spot is missing from non-empty tick_stream for ACCU contract', () => {
        const contract_info: TContractInfo = {
            current_spot: mocked_current_tick.tick,
            current_spot_display_value: mocked_current_tick.tick_display_value,
            current_spot_time: mocked_current_tick.epoch,
            tick_stream: mocked_tick_stream,
        };
        expect(ContractUtils.getAccuTickStreamWithCurrentSpot(contract_info)).toEqual([
            ...mocked_tick_stream,
            mocked_current_tick,
        ]);
    });
    it('should return a 10-tick array with the 1st tick removed & current spot added as its last tick if initial tick_stream is a 10-tick array missing current spot', () => {
        const contract_info: TContractInfo = {
            current_spot: mocked_current_tick.tick,
            current_spot_display_value: mocked_current_tick.tick_display_value,
            current_spot_time: mocked_current_tick.epoch,
            tick_stream: [...mocked_tick_stream, ...mocked_tick_stream],
        };
        expect(ContractUtils.getAccuTickStreamWithCurrentSpot(contract_info)).toEqual([
            ...mocked_tick_stream.slice(1),
            ...mocked_tick_stream,
            mocked_current_tick,
        ]);
        expect(ContractUtils.getAccuTickStreamWithCurrentSpot(contract_info)?.length).toEqual(10);
    });
    it('should return unchanged tick_stream array of ticks if current spot is present at the end of tick_stream', () => {
        const last_tick = mocked_tick_stream[mocked_tick_stream.length - 1];
        const contract_info: TContractInfo = {
            current_spot: last_tick.tick,
            current_spot_display_value: last_tick.tick_display_value,
            current_spot_time: last_tick.epoch,
            tick_stream: mocked_tick_stream,
        };
        expect(ContractUtils.getAccuTickStreamWithCurrentSpot(contract_info)).toEqual(mocked_tick_stream);
    });
    it('should return unchanged tick_stream array of ticks if tick_stream is empty', () => {
        const contract_info: TContractInfo = { tick_stream: [] };
        expect(ContractUtils.getAccuTickStreamWithCurrentSpot(contract_info)).toEqual([]);
    });
});
