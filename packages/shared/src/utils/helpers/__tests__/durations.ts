import { expect } from 'chai';
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
        expect(Duration.buildDurationConfig(contract, durations)).to.eql(durations);
    });

    it('Returns correct value when durations passed', () => {
        expect(Duration.buildDurationConfig(contract, durations)).to.eql(durations);
    });
});

describe('convertDurationUnit', () => {
    it('Returns correct value convert day to second', () => {
        expect(Duration.convertDurationUnit(365, 'd', 's')).to.eql(31536000);
    });

    it('Returns correct value convert minute to second', () => {
        expect(Duration.convertDurationUnit(5, 'm', 's')).to.eql(300);
    });

    it('Returns correct value convert day to minute', () => {
        expect(Duration.convertDurationUnit(1, 'd', 'm')).to.eql(1440);
    });

    it('Returns correct value convert second to minute', () => {
        expect(Duration.convertDurationUnit(180, 's', 'm')).to.eql(3);
    });

    it('Returns correct value convert minute to day', () => {
        expect(Duration.convertDurationUnit(2880, 'm', 'd')).to.eql(2);
    });

    it('Returns correct value convert second to day', () => {
        expect(Duration.convertDurationUnit(86400, 's', 'd')).to.eql(1);
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
        expect(Duration.getExpiryType(store)).to.eql('intraday');
    });

    it('Return daily if expiry date is tomorrow', () => {
        store.expiry_date = moment().utc().add(1, 'days').toString();
        store.expiry_type = 'endtime';
        expect(Duration.getExpiryType(store)).to.eql('daily');
    });

    it('Return tick if duration unit is t', () => {
        store.duration_unit = 't';
        store.expiry_type = 'duration';
        expect(Duration.getExpiryType(store)).to.eql('tick');
    });

    it('Return intraday if duration unit is m', () => {
        store.duration_unit = 'm';
        store.expiry_type = 'duration';
        expect(Duration.getExpiryType(store)).to.eql('intraday');
    });

    it('Return daily if duration unit is d', () => {
        store.duration_unit = 'd';
        store.expiry_type = 'duration';
        expect(Duration.getExpiryType(store)).to.eql('daily');
    });
});

describe('convertDurationLimit', () => {
    it('Returns correct value for ticks unit', () => {
        expect(Duration.convertDurationLimit(5, 't')).to.eql(5);
    });

    it('Returns correct value for minutes unit', () => {
        expect(Duration.convertDurationLimit(180, 'm')).to.eql(3);
    });

    it('Returns correct value for hour unit', () => {
        expect(Duration.convertDurationLimit(7200, 'h')).to.eql(2);
    });

    it('Returns correct value for day unit', () => {
        expect(Duration.convertDurationLimit(86400, 'd')).to.eql(1);
    });
});
