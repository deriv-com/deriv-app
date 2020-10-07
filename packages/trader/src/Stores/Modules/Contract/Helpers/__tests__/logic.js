import { expect } from 'chai';
import React from 'react';
import * as Logic from '../logic';

describe('logic', () => {
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

    describe('getEndTime', () => {
        it('Should return exit tick time for tick contracts', () => {
            const contract_info = {
                tick_count: 5,
                exit_tick_time: 9999999,
                sell_time: 1000000,
                is_expired: 1,
                date_expiry: 8888888,
            };
            expect(Logic.getEndTime(contract_info)).to.eql(9999999);
        });
        it('Should return date expiry if sell time is after date expiry for non-tick contracts', () => {
            const contract_info = {
                exit_tick_time: 9999999,
                sell_time: 8888888,
                is_expired: 1,
                date_expiry: 7777777,
            };
            expect(Logic.getEndTime(contract_info)).to.eql(7777777);
        });
        it('Should return exit tick time if sell time is before date expiry for non-tick contracts', () => {
            const contract_info = {
                exit_tick_time: 9999999,
                sell_time: 7777777,
                is_expired: 1,
                date_expiry: 8888888,
            };
            expect(Logic.getEndTime(contract_info)).to.eql(9999999);
        });
        it('Should return date_expiry time for user sold contracts if sell_time is after date_expiry', () => {
            const contract_info = {
                date_expiry: 8888888,
                exit_tick_time: 8888887,
                sell_time: 8888889,
                status: 'sold',
            };
            expect(Logic.getEndTime(contract_info)).to.eql(8888888);
        });
        it('Should return sell_time time for user sold contracts if sell_time is before date_expiry', () => {
            const contract_info = {
                date_expiry: 8888889,
                exit_tick_time: 8888887,
                sell_time: 8888888,
                status: 'sold',
            };
            expect(Logic.getEndTime(contract_info)).to.eql(8888888);
        });
        it('Should return undefined if not sold for all contracts', () => {
            const contract_info = {
                exit_tick_time: 9999999,
                sell_time: 1000000,
                is_expired: 0,
                date_expiry: 888888,
            };
            expect(Logic.getEndTime(contract_info)).to.eql(undefined);
        });
        it('Should return exit_tick_time if contract is_path_dependent', () => {
            const contract_info = {
                exit_tick_time: 9999999,
                sell_time: 1000000,
                is_expired: 0,
                is_path_dependent: '1',
                date_expiry: 888888,
            };
            expect(Logic.getEndTime(contract_info)).to.eql(undefined);
        });
    });
});
