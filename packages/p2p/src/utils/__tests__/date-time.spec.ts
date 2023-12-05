import { getFormattedDateString, convertToMillis, getDateAfterHours, millisecondsToTimer } from '../date-time';

describe('getFormattedDateString', () => {
    const date = new Date('2022-02-02T00:00:00.000+00:00');

    it('should return the date in the format "DD MMM YYYY, HH:mm"', () => {
        expect(getFormattedDateString(date)).toEqual('02 Feb 2022, 00:00');
    });

    it('should return the date in the format "DD MMM YYYY, HH:mm:ss"', () => {
        expect(getFormattedDateString(date, false, true)).toEqual('02 Feb 2022, 00:00:00');
    });
});

describe('convertToMillis', () => {
    it('should return the epoch time in milliseconds', () => {
        expect(convertToMillis(0)).toEqual(0);
        expect(convertToMillis(1)).toEqual(1000);
        expect(convertToMillis(2)).toEqual(2000);
    });
});

describe('getDateAfterHours', () => {
    it('should return the date string after the given number of hours', () => {
        expect(getDateAfterHours(0, 0)).toEqual('01 Jan 1970, 00:00');
        expect(getDateAfterHours(0, 1)).toEqual('01 Jan 1970, 01:00');
        expect(getDateAfterHours(0, 2)).toEqual('01 Jan 1970, 02:00');
    });
});

describe('millisecondsToTimer', () => {
    it('should return the timer string in the format "HH:MM:SS"', () => {
        expect(millisecondsToTimer(0)).toEqual('00:00:00');
        expect(millisecondsToTimer(10000)).toEqual('00:00:10');
        expect(millisecondsToTimer(60000)).toEqual('00:01:00');
        expect(millisecondsToTimer(90000)).toEqual('00:01:30');
        expect(millisecondsToTimer(3600000)).toEqual('01:00:00');
        expect(millisecondsToTimer(5430000)).toEqual('01:30:30');
    });
});
