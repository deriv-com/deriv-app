import { expect }                                         from 'chai';
import moment                                             from 'moment';
import React                                              from 'react';
import { buildForwardStartingConfig, isSessionAvailable } from '../start-date';

describe('start_date', () => {
    describe('buildForwardStartingConfig', () => {
        it('Returns empty object when forward_starting_options and forward_starting_dates are both empties', () => {
            const contract = {
                "barrier_category":"euro_atm",
                "barriers":0,
                "contract_category":"callput",
                "contract_category_display":"Up\/Down",
                "contract_display":"Higher",
                "contract_type":"CALL",
                "exchange_name":"FOREX",
                "expiry_type":"daily",
                "market":"forex",
                "max_contract_duration":"365d",
                "min_contract_duration":"1d",
                "sentiment":"up",
                "start_type":"spot",
                "submarket":"major_pairs",
                "underlying_symbol":"frxAUDJPY"
            };
            expect(buildForwardStartingConfig(contract, {})).to.be.empty;
        });
    });

    describe('isSessionAvailable', () => {
        it('should return true with default values', () => {
            expect(isSessionAvailable()).to.eql(true);
        });
        it('should return true when should_only_check_hour is false and there is a session which opens before now and closes after now', () => {
            const sessions = [
                {
                    open: moment.utc((new Date()).getTime() - 100000),
                    close: moment.utc((new Date()).getTime() + 100000)
                }, {
                    open: moment.utc((new Date()).getTime() + 300000),
                    close: moment.utc((new Date()).getTime() + 400000)
                }
            ];
            expect(isSessionAvailable(sessions)).to.eql(true);
        });
        it('should return false when should_only_check_hour is false and there is not a session which opens before now and closes after now and compare_moment is before start_moment', () => {
            const sessions = [
                {
                    open: moment.utc((new Date()).getTime() + 400000),
                    close: moment.utc((new Date()).getTime() + 500000)
                }, {
                    open: moment.utc((new Date()).getTime() + 300000),
                    close: moment.utc((new Date()).getTime() + 400000)
                }
            ];
            const compare_moment = moment.utc((new Date()).getTime() - 1000);

            expect(isSessionAvailable(sessions, compare_moment)).to.eql(false);
        });
        it('should return false when should_only_check_hour is false and there is not a session which opens before now and closes after now and compare_moment is before start_moment', () => {
            const sessions = [
                {
                    open: moment.utc((new Date()).getTime() + 400000),
                    close: moment.utc((new Date()).getTime() + 500000)
                },
                {
                    open: moment.utc((new Date()).getTime() + 300000),
                    close: moment.utc((new Date()).getTime() + 400000)
                }
            ];
            expect(isSessionAvailable(sessions, moment.utc(), moment.utc(), false)).to.eql(false);
        });
        it('should return false when should_only_check_hour is true and there is not a session which opens before now and closes after now', () => {
            const sessions = [
                {
                    open: moment.utc((new Date()).getTime() + 3600000),
                    close: moment.utc((new Date()).getTime() + 3600001)
                }
            ];
            expect(isSessionAvailable(sessions, moment.utc(), moment.utc(), true)).to.eql(false);
        });
        it('should return true when should_only_check_hour is true and there is a session which opens before now and closes after now', () => {
            const sessions = [
                {
                    open: moment.utc((new Date()).getTime() -1000),
                    close: moment.utc((new Date()).getTime() + 1000)
                }
            ];
            expect(isSessionAvailable(sessions, moment.utc(), moment.utc(), true)).to.eql(true);
        });
    });
});
