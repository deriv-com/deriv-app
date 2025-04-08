import moment from 'moment';
import * as DateTime from '../date-time';

describe('toMoment', () => {
    it('return utc epoch value date based on client epoch value passed', () => {
        const epoch = 1544756041;

        expect(DateTime.toMoment(epoch)).toEqual(moment.unix(epoch).utc());
    });
    it('return correct date when plain string date passed', () => {
        const format = 'DD MMM YYYY';
        const date = moment().format(format);

        expect(DateTime.toMoment(date).format(format)).toBe(date);
    });
});

describe('convertToUnix', () => {
    const setTime = (moment_obj, time) => {
        const [hour, minute, second] = time.split(':');
        moment_obj
            .hour(hour)
            .minute(minute || 0)
            .second(second || 0);

        return moment_obj;
    };

    it('return correct unix value when date and time passed', () => {
        const date_epoch = 1544745600;
        const time = '12:30';

        expect(DateTime.convertToUnix(date_epoch, time)).toEqual(setTime(DateTime.toMoment(date_epoch), time).unix());
    });
});

describe('toGMTFormat', () => {
    it('return correct GMT value when no argument passed', () => {
        expect(DateTime.toGMTFormat()).toEqual(moment().utc().format('YYYY-MM-DD HH:mm:ss [GMT]'));
    });

    it('return correct GMT value when argument passed', () => {
        const time_epoch = 1544757884620;
        expect(DateTime.toGMTFormat(time_epoch)).toEqual(moment(time_epoch).utc().format('YYYY-MM-DD HH:mm:ss [GMT]'));
    });
});

describe('formatDate', () => {
    const date_format = 'YYYY-MM-DD';
    it('return correct response when no argument passed', () => {
        expect(DateTime.formatDate()).toEqual(moment().utc().format(date_format));
    });

    it('return correct date value when argument passed', () => {
        // get today date
        const date = moment().utc();
        expect(DateTime.formatDate(date, date_format)).toEqual(moment(date).format(date_format));
    });

    it('returns undefined when date is null and should_format_null is false', () => {
        expect(DateTime.formatDate(null, date_format, false)).toBeUndefined();
    });

    it('returns formatted date when date is null and should_format_null is true', () => {
        expect(DateTime.formatDate(null, date_format, true)).toEqual(moment().utc().format(date_format));
    });

    it('returns formatted date when date is not null and should_format_null is true', () => {
        const date = moment('2023-09-20').utc();
        expect(DateTime.formatDate(date, date_format, true)).toEqual(moment(date).format(date_format));
    });

    it('returns formatted date when date is not null and should_format_null is false', () => {
        const date = moment('2023-09-20').utc();
        expect(DateTime.formatDate(date, date_format, false)).toEqual(moment(date).format(date_format));
    });
});

/* eslint-disable no-unused-expressions */
describe('daysFromTodayTo', () => {
    it('return empty string when there is no argument passed', () => {
        expect(DateTime.daysFromTodayTo()).toHaveLength(0);
    });

    it('return empty string if the user selected previous day', () => {
        // get previous day
        const date = moment().utc().startOf('day').subtract(1, 'days').format('YYYY-MM-DD');
        expect(DateTime.daysFromTodayTo(date)).toHaveLength(0);
    });

    it('return difference value between selected date and today', () => {
        // get date three days from now
        const date = moment().utc().startOf('day').add('3', 'days').format('YYYY-MM-DD');
        expect(DateTime.daysFromTodayTo(date)).toEqual(3);
    });
});

describe('convertDuration', () => {
    const start_time = moment().unix();
    const end_time = moment.unix(start_time).add(3, 'minutes').unix();

    describe('getDiffDuration', () => {
        it('return correct value when argument passed', () => {
            expect(DateTime.getDiffDuration(start_time, end_time)).toEqual(moment.duration(180000));
        });
    });

    describe('formatDuration', () => {
        it('return correct value when argument passed', () => {
            const duration = moment.duration(moment.unix(end_time).diff(moment.unix(start_time))); // three minutes
            expect(DateTime.formatDuration(duration).timestamp).toEqual('00:03:00');
        });
    });
});

describe('getTimeSince', () => {
    it('should return correct time since timestamp for each time unit', () => {
        const now = Date.now();
        const fifteen_sec_ago = Date.now() - 15000;
        const ninety_sec_ago = Date.now() - 90000;
        const four_thousand_sec_ago = Date.now() - 4000000;
        const hundred_thousand_sec_ago = Date.now() - 100000000;
        expect(DateTime.getTimeSince(now)).toEqual('0s ago');
        expect(DateTime.getTimeSince(fifteen_sec_ago)).toEqual('15s ago');
        expect(DateTime.getTimeSince(ninety_sec_ago)).toEqual('1m ago');
        expect(DateTime.getTimeSince(four_thousand_sec_ago)).toEqual('1h ago');
        expect(DateTime.getTimeSince(hundred_thousand_sec_ago)).toEqual('1d ago');
    });
    it('should return an empty string when called with 0', () => {
        expect(DateTime.getTimeSince(0)).toEqual('');
    });
});

describe('getDateFromTimestamp', () => {
    it('should return correct date with timestamp passed', () => {
        expect(DateTime.getDateFromTimestamp(1814966400)).toEqual('07 07 2027');
    });
});

describe('getTomorrowDate', () => {
    it("should return tomorrow's date in YYYY-MM-DD format", () => {
        const server_time = '2025-04-08 09:28:52';
        const expected_tomorrow = '2025-04-09';

        expect(DateTime.getTomorrowDate(server_time)).toBe(expected_tomorrow);
    });

    it('should handle different input formats', () => {
        const date_object = new Date('2025-04-08T09:28:52');
        const expected_tomorrow = '2025-04-09';

        expect(DateTime.getTomorrowDate(date_object)).toBe(expected_tomorrow);
    });

    it('should handle month rollover', () => {
        const server_time = '2025-04-30 09:28:52';
        const expected_tomorrow = '2025-05-01';

        expect(DateTime.getTomorrowDate(server_time)).toBe(expected_tomorrow);
    });
});

describe('getTomorrowAsDate', () => {
    it("should return tomorrow's date as Date object", () => {
        const server_time = '2025-04-08 09:28:52';
        const result = DateTime.getTomorrowAsDate(server_time);

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(3); // April is 3 (0-based)
        expect(result.getDate()).toBe(9);
    });

    it('should handle different input formats', () => {
        const date_object = new Date('2025-04-08T09:28:52');
        const result = DateTime.getTomorrowAsDate(date_object);

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(3);
        expect(result.getDate()).toBe(9);
    });

    it('should handle month rollover', () => {
        const server_time = '2025-04-30 09:28:52';
        const result = DateTime.getTomorrowAsDate(server_time);

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(4); // May is 4 (0-based)
        expect(result.getDate()).toBe(1);
    });
});
