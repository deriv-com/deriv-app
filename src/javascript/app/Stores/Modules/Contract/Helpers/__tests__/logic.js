import { expect } from 'chai';
import React      from 'react';
import * as Logic from '../logic';

describe('logic', () => {
    describe('isEnded', () => {
        it('should return false when there is status and it\'s equal to open in contract info', () => {
            const contract_info = {
                "status": "open",
            };
            expect(Logic.isEnded(contract_info)).to.eql(false);
        });
        it('should return true when there is status and it\'s not equal to open in contract info', () => {
            const contract_info = {
                "status": "sold",
            };
            expect(Logic.isEnded(contract_info)).to.eql(true);
        });
        it('should return true when contract is expired', () => {
            const contract_info = {
                "status": "open",
                "is_expired": true,
            };
            expect(Logic.isEnded(contract_info)).to.eql(true);
        });
        it('should return true when contract is settleable', () => {
            const contract_info = {
                "status": "open",
                "is_expired": false,
                "is_settleable": true,
            };
            expect(Logic.isEnded(contract_info)).to.eql(true);
        });
        it('should return true when contract is not expired', () => {
            const contract_info = {
                "status": "open",
                "is_expired": false,
            };
            expect(Logic.isEnded(contract_info)).to.eql(false);
        });
        it('should return true when contract does not have is_settleable, is_expired and status', () => {
            const contract_info = {};
            expect(Logic.isEnded(contract_info)).to.eql(false);
        });
    });

    expect('getDisplayStatus', () => {
        it('should return won if contract is ended and profit is more than zero', () => {
            const contract_info = {
                "status": "sold",
                "profit": 100,
            };
            expect(Logic.getDisplayStatus(contract_info)).to.eql('won');
        });
        it('should return lost if contract is ended and profit is less than zero', () => {
            const contract_info = {
                "status": "sold",
                "profit": -100,
            };
            expect(Logic.getDisplayStatus(contract_info)).to.eql('loss');
        });
        it('should return won if contract is ended and profit is zero', () => {
            const contract_info = {
                "status": "sold",
                "profit": 0,
            };
            expect(Logic.getDisplayStatus(contract_info)).to.eql('won');
        });
        it('should return purchased if contract is not ended', () => {
            const contract_info = {
                "status": "open",
            };
            expect(Logic.getDisplayStatus(contract_info)).to.eql('purchased');
        });
    });

    describe('getEndSpot', () => {
        it('should return contract\'s exit spot if contract is path dependent', () => {
            const contract_info = {
                "is_path_dependent": true,
                "sell_spot": 123456,
                "exit_tick": 987654321,
            };
            expect(Logic.getEndSpot(contract_info)).to.eql(987654321);
        });
        it('should return contract\'s exit tick if contract is not path dependent', () => {
            const contract_info = {
                "is_path_dependent": false,
                "sell_spot": 123456,
                "exit_tick": 987654321,
            };
            expect(Logic.getEndSpot(contract_info)).to.eql(987654321);
        });
        it('should return contract\'s exit tick if is_path_dependent is undefined', () => {
            const contract_info = {
                "sell_spot": 123456,
                "exit_tick": 987654321,
            };
            expect(Logic.getEndSpot(contract_info)).to.eql(987654321);
        });
    });

    describe('getEndSpotTime', () => {
        it('should return contract\'s exit tick time if it is path dependent', () => {
            const contract_info = {
                "is_path_dependent": true,
                "sell_spot_time": 123456,
                "exit_tick_time": 987654321,
            };
            expect(Logic.getEndSpotTime(contract_info)).to.eql(987654321);
        });
        it('should return contract\'s exit tick time if it is not path dependent', () => {
            const contract_info = {
                "is_path_dependent": false,
                "sell_spot_time": 123456,
                "exit_tick_time": 987654321,
            };
            expect(Logic.getEndSpotTime(contract_info)).to.eql(987654321);
        });
        it('should return contract\'s exit tick time if is_path_dependent is undefined', () => {
            const contract_info = {
                "sell_spot_time": 123456,
                "exit_tick_time": 987654321,
            };
            expect(Logic.getEndSpotTime(contract_info)).to.eql(987654321);
        });
    });

    describe('getFinalPrice', () => {
        it('should return sell_price as final price when it\'s available', () => {
            const contract_info = {
                "sell_price": 12345,
            };
            expect(Logic.getFinalPrice(contract_info)).to.eql(12345);
        });
        it('should return sell_price as final price when sell_price && bid_price are available', () => {
            const contract_info = {
                "sell_price": 12345,
                "bid_price": 789,
            };
            expect(Logic.getFinalPrice(contract_info)).to.eql(12345);
        });
        it('should return bid_price as final price when sell_price is not available and bid_price is available', () => {
            const contract_info = {
                "bid_price": 789,
            };
            expect(Logic.getFinalPrice(contract_info)).to.eql(789);
        });
        it('should return 0 as final price when sell_price and bid_price are empty', () => {
            const contract_info = {
                "sell_price": false,
                "bid_price": false,
            };
            expect(Logic.getFinalPrice(contract_info)).to.eql(0);
        });
    });

    describe('getIndicativePrice', () => {
        it('should return getFinalPrice if it has final price and contract is ended', () => {
            const contract_info = {
                "sell_price": 12345,
                "status": "sold"
            };
            expect(Logic.getIndicativePrice(contract_info)).to.eql(12345);
        });
        it('should return null if it doesn\'t have final price, bid_price and contract is not ended', () => {
            const contract_info = {
                "status": "open",
            };
            expect(Logic.getIndicativePrice(contract_info)).to.eql(null);
        });
        it('should return bid_price if it doesn\'t have final price, has bid_price and contract is not ended', () => {
            const contract_info = {
                "status": "open",
                "bid_price": 12345,
            };
            expect(Logic.getIndicativePrice(contract_info)).to.eql(12345);
        });
    });

    describe('getLastTickFromTickStream', () => {
        it('should return the last tick in the tick_stream array', () => {
            const tick_stream = [
                {
                    "tick" : 766.53,
                    "epoch": 1000001,
                },
                {
                    "tick" : 800.23,
                    "epoch": 1000002,
                },
            ];
            expect(Logic.getLastTickFromTickStream(tick_stream)).to.deep.include({
                "tick" : 800.23,
                "epoch": 1000002,
            });
        });
        it('should return an empty object if the tick_stream array is empty', () => {
            const tick_stream = [];
            expect(Logic.getLastTickFromTickStream(tick_stream)).to.eql({});
        });
    });

    describe('isSoldBeforeStart', () => {
        it('should return true when sell_time is before date_start', () => {
            const contract_info = {
                sell_time: 1000000,
                date_start: 1000001,
            };
            expect(Logic.isSoldBeforeStart(contract_info)).to.eql(true);
        });
        it('should return true when sell_time is after date_start', () => {
            const contract_info = {
                sell_time: 1000000,
                date_start: 99999,
            };
            expect(Logic.isSoldBeforeStart(contract_info)).to.eql(false);
        });
    });

    describe('isStarted', () => {
        it('should return true if contract is not forward_starting and current_spot_time is after start_time', () => {
            const contract_info = {
                is_forward_starting: false,
                current_spot_time: 1000000,
                date_start: 99999,
            };
            expect(Logic.isStarted(contract_info)).to.eql(true);
        });
        it('should return true if contract is not forward_starting and current_spot_time is before start_time', () => {
            const contract_info = {
                is_forward_starting: false,
                current_spot_time: 99999,
                date_start: 1000000,
            };
            expect(Logic.isStarted(contract_info)).to.eql(true);
        });
        it('should return true if contract is forward_starting and current_spot_time is after start_time', () => {
            const contract_info = {
                is_forward_starting: true,
                current_spot_time: 1000000,
                date_start: 99999,
            };
            expect(Logic.isStarted(contract_info)).to.eql(true);
        });
        it('should return false if contract is forward_starting and current_spot_time is before start_time', () => {
            const contract_info = {
                is_forward_starting: true,
                current_spot_time: 99999,
                date_start: 1000000,
            };
            expect(Logic.isStarted(contract_info)).to.eql(false);
        });
    });

    describe('isUserSold', () => {
        it('should return true if contract\'s status is sold', () => {
            const contract_info = {
                status: 'sold',
            };
            expect(Logic.isUserSold(contract_info)).to.eql(true);
        });
        it('should return false if contract\'s status is not sold', () => {
            const contract_info = {
                status: 'open',
            };
            expect(Logic.isUserSold(contract_info)).to.eql(false);
        });
    });

    describe('isValidToSell', () => {
        it('should return true if contract is not ended and is not sold and contract is valid to_sell', () => {
            const contract_info = {
                status: 'open',
                is_valid_to_sell: 1,
            };
            expect(Logic.isValidToSell(contract_info)).to.eql(true);
        });
        it('should return false if contract is ended and is sold and contract is valid to sell', () => {
            const contract_info = {
                status: 'sold',
                is_valid_to_sell: 1,
            };
            expect(Logic.isValidToSell(contract_info)).to.eql(false);
        });
        it('should return false if contract is ended and is not sold and contract is valid to sell', () => {
            const contract_info = {
                status: 'won',
                is_valid_to_sell: 1,
            };
            expect(Logic.isValidToSell(contract_info)).to.eql(false);
        });
        it('should return false if contract is ended and is sold and contract is not valid to sell', () => {
            const contract_info = {
                status: 'sold',
                is_valid_to_sell: 0,
            };
            expect(Logic.isValidToSell(contract_info)).to.eql(false);
        });
        it('should return false if contract is ended and is not sold and contract is not valid to sell', () => {
            const contract_info = {
                status: 'won',
                is_valid_to_sell: 0,
            };
            expect(Logic.isValidToSell(contract_info)).to.eql(false);
        });
        it('should return false if contract is not ended and is not sold and contract is not valid to sell', () => {
            const contract_info = {
                status: 'open',
                is_valid_to_sell: 0,
            };
            expect(Logic.isValidToSell(contract_info)).to.eql(false);
        });
    });

    describe('getEndTime', () => {
        it('Should return exit tick time for tick contracts', () => {
            const contract_info = {
                tick_count: 5,
                exit_tick_time: 9999999,
                sell_time: 1000000,
                is_sold: 1,
                date_expiry: 8888888,
            };
            expect(Logic.getEndTime(contract_info)).to.eql(9999999);
        });
        it('Should return date expiry if sell time is after date expiry for non-tick contracts', () => {
            const contract_info = {
                exit_tick_time: 9999999,
                sell_time: 8888888,
                is_sold: 1,
                date_expiry: 7777777,
            };
            expect(Logic.getEndTime(contract_info)).to.eql(7777777);
        });
        it('Should return exit tick time if sell time is before date expiry for non-tick contracts', () => {
            const contract_info = {
                exit_tick_time: 9999999,
                sell_time: 7777777,
                is_sold: 1,
                date_expiry: 8888888,
            };
            expect(Logic.getEndTime(contract_info)).to.eql(9999999);
        });
        it('Should return undefined if not sold for non-tick contracts', () => {
            const contract_info = {
                exit_tick_time: 9999999,
                sell_time: 1000000,
                is_sold: 0,
                date_expiry: 888888,
            };
            expect(Logic.getEndTime(contract_info)).to.eql(undefined);
        });
    });
});
