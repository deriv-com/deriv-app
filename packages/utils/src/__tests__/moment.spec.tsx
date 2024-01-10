import moment from 'moment';
import { epochToMoment, toMoment } from '../moment';

describe('epochToMoment', () => {
    it('should convert a numerical epoch value to a Moment instance', () => {
        const epochValue = 1609459200;
        const momentInstance = epochToMoment(epochValue);
        expect(momentInstance).toBeInstanceOf(moment);
        expect(momentInstance.valueOf()).toBe(epochValue * 1000);
    });
});

describe('toMoment', () => {
    it('should return the current UTC moment if no value is provided', () => {
        const momentInstance = toMoment();
        expect(momentInstance).toBeInstanceOf(moment);
        expect(momentInstance.isSameOrBefore(moment())).toBe(true);
    });

    it('should return a Moment instance if already provided', () => {
        const existingMoment = moment.utc();
        const momentInstance = toMoment(existingMoment);
        expect(momentInstance).toBe(existingMoment);
    });

    it('should convert a numerical value to a Moment instance using epochToMoment', () => {
        const epochValue = 1609459200;
        const momentInstance = toMoment(epochValue);
        expect(momentInstance).toBeInstanceOf(moment);
        expect(momentInstance.valueOf()).toBe(epochValue * 1000);
    });

    it('should handle string input and convert it to a valid Moment instance', () => {
        const dateString = '15 Jan 2022';
        const momentInstance = toMoment(dateString);
        expect(momentInstance).toBeInstanceOf(moment);
        expect(momentInstance.format('DD MMM YYYY')).toBe(dateString);
    });

    it('should handle invalid date string input and adjust accordingly', () => {
        const invalidDateString = '31 Feb 2022';
        const momentInstance = toMoment(invalidDateString);
        expect(momentInstance).toBeInstanceOf(moment);
        expect(momentInstance.isValid()).toBe(true);
    });
});
