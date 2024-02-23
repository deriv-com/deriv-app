import * as Duration from '../duration';
import moment from 'moment';

describe('buildDurationConfig', () => {
    const contract = {
        barrier_category: 'euro_atm',
        barriers: 0,
        contract_category: 'callput',
        contract_category_display: 'Up/Down',
        contract_display: 'Higher',
        contract_type: 'CALL',
        exchange_name: 'FOREX',
        expiry_type: 'daily',
        market: 'forex',
        max_contract_duration: '365d',
        min_contract_duration: '1d',
        sentiment: 'up',
        start_type: 'spot',
        submarket: 'major_pairs',
        underlying_symbol: 'frxAUDJPY',
    };

    const durations = {
        min_max: {
            spot: {
                daily: {
                    min: 86400,
                    max: 31536000,
                },
            },
            forward: {},
        },
        units_display: {
            spot: [
                {
                    text: 'Days',
                    value: 'd',
                },
            ],
        },
    };

    it('Returns correct value when durations is not passed', () => {
        expect(Duration.buildDurationConfig(contract, durations)).toEqual(durations);
    });

    it('Returns correct value when durations passed', () => {
        expect(Duration.buildDurationConfig(contract, durations)).toEqual(durations);
    });
});

describe('convertDurationUnit', () => {
    it('Returns correct value convert day to second', () => {
        expect(Duration.convertDurationUnit(365, 'd', 's')).toEqual(31536000);
    });

    it('Returns correct value convert minute to second', () => {
        expect(Duration.convertDurationUnit(5, 'm', 's')).toEqual(300);
    });

    it('Returns correct value convert day to minute', () => {
        expect(Duration.convertDurationUnit(1, 'd', 'm')).toEqual(1440);
    });

    it('Returns correct value convert second to minute', () => {
        expect(Duration.convertDurationUnit(180, 's', 'm')).toEqual(3);
    });

    it('Returns correct value convert minute to day', () => {
        expect(Duration.convertDurationUnit(2880, 'm', 'd')).toEqual(2);
    });

    it('Returns correct value convert second to day', () => {
        expect(Duration.convertDurationUnit(86400, 's', 'd')).toEqual(1);
    });
});

describe('getExpiryType', () => {
    const store = {
        root_store: {
            common: {
                server_time: '2018-12-25 23:59:59',
            },
        },
        duration_units_list: [
            { text: 'ticks', value: 't' },
            { text: 'minutes', value: 'm' },
            { text: 'hours', value: 'h' },
            { text: 'days', value: 'd' },
        ],
        expiry_date: '',
        expiry_type: '',
        duration_unit: '',
    };

    it('Return intraday if expiry date is today', () => {
        store.expiry_date = '2018-12-25';
        store.expiry_type = 'endtime';
        expect(Duration.getExpiryType(store)).toEqual('intraday');
    });

    it('Return daily if expiry date is tomorrow', () => {
        store.expiry_date = moment().utc().add(1, 'days').toString();
        store.expiry_type = 'endtime';
        store.expiry_type = 'duration';
        store.duration_unit = 'd';
        expect(Duration.getExpiryType(store)).toEqual('daily');
    });

    it('Return tick if duration unit is t', () => {
        store.duration_unit = 't';
        store.expiry_type = 'duration';
        expect(Duration.getExpiryType(store)).toEqual('tick');
    });

    it('Return intraday if duration unit is m', () => {
        store.duration_unit = 'm';
        store.expiry_type = 'duration';
        expect(Duration.getExpiryType(store)).toEqual('intraday');
    });

    it('Return daily if duration unit is d', () => {
        store.duration_unit = 'd';
        store.expiry_type = 'duration';
        expect(Duration.getExpiryType(store)).toEqual('daily');
    });
});

describe('convertDurationLimit', () => {
    it('Returns correct value for ticks unit', () => {
        expect(Duration.convertDurationLimit(5, 't')).toEqual(5);
    });

    it('Returns correct value for minutes unit', () => {
        expect(Duration.convertDurationLimit(180, 'm')).toEqual(3);
    });

    it('Returns correct value for hour unit', () => {
        expect(Duration.convertDurationLimit(7200, 'h')).toEqual(2);
    });

    it('Returns correct value for day unit', () => {
        expect(Duration.convertDurationLimit(86400, 'd')).toEqual(1);
    });
});

describe('formatDurationTime', () => {
    it('should return dummy duration if time was not passed', () => {
        expect(Duration.formatDurationTime()).toBe('00:00');
    });

    it('should return dummy duration if time is equal to 0', () => {
        expect(Duration.formatDurationTime(0)).toBe('00:00');
    });

    it('should return correct duration', () => {
        expect(Duration.formatDurationTime(3)).toBe('00:03');
        expect(Duration.formatDurationTime(33)).toBe('00:33');
        expect(Duration.formatDurationTime(60)).toBe('01:00');
        expect(Duration.formatDurationTime(130)).toBe('02:10');
    });
});
